//background.js

/**
 * @fileoverview Background service worker for handling URL scans.
 * This module acts as the central logic controller between the UI (popup) and the backend server,
 * performs reachability checks and security scans using the Google Safe Browsing API.
 *
 * @description
 * Listens for scan requests from the popup UI, validates the URL,
 * performs reachability checks, and delegates the phishing scan to a backend service.
 * Uses Chrome's messaging API and async IIFE patterns for non-blocking communication.
 *
 * @module background.js
 * @requires ./api/api.js
 * @version 1.0.0
 * @since 2025-10-22
 */

// Function to call backend for Safe Browsing check
import { checkUrlWithBackend } from './api/api.js';

// Handles messages sent from other extension components, primarily popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan_url") {
    const url = message.url;

    // Early validation: Only scan HTTP(S) URLs
    if (!isScannableUrl(url)) {
      sendResponse({
        success: false,
        reachable: false,
        scannable: false,
        error: "Unsupported URL scheme. Only http and https are allowed."
        });
      return true; // Return true to indicate async response
    }

    // Run async code inside an IIFE
    (async () => {
      try {
        // Check if the target site is reachable
        const reachable = await isReachable(url);

        // Query backend to check if URL is flagged by Google Safe Browsing
        const safe = await checkUrlWithBackend(url);

        // Return results to sender (popup.js)
        sendResponse({
          success: true,
          safe,
          reachable,
          scannable: true
        });
      } catch (error) {      // Handle unexpected backend or network issues
        console.error("Scan error:", error);
        sendResponse({
          success: false,
          reachable: false,
          scannable: true,
          error: error.message
        });
      }
    })();

    // Tell Chrome this is an async response
    return true;
  }
});

/**
 * Checks if the given URL is reachable within a timeout window.
 * This is done using a simple GET request and allows detection of dead links.
 *
 * @param {string} url - The URL to test
 * @returns {Promise<boolean>} - True if reachable, false otherwise
 */
async function isReachable(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); //15s timeout

  try {
    await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      redirect: "follow",
      signal: controller.signal
    });
    return true;
  } catch (err) {
    console.warn("Fetch failed or timed out:", err.message);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Validates whether a URL has a supported and scannable scheme.
 * Currently supports only 'http' and 'https' protocols.
 *
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if scannable, false otherwise
 */
function isScannableUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}
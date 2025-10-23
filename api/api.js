// ./api/api.js

/**
 * @fileoverview API to communicate with the backend for phishing checks.
 * Sends URLs to the backend, parses the response, and returns a boolean
 * indicating if the URL is safe.
 *
 * @module api/api.js
 * @version 1.0.0
 * @since 2025-10-22
 */


/**
 * Sends the URL to backend server which handles Google Safe Browsing API checks.
 *
 * This function handles the HTTP request to the backend, checks for response
 * errors, parses the JSON response, and returns the `safe` status as a boolean.
 *
 * @async
 * @param {string} url - The URL to be scanned. Must be a valid http(s) URL.
 * @returns {Promise<boolean>} - Resolves to true if the URL is safe, false if flagged.
 * @throws {Error} - Throws if the backend request fails or returns a non-OK status.
 */

export async function checkUrlWithBackend(url) {
  try {
    // Send POST request to backend scan endpoint
    const response = await fetch('backend_endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      referrerPolicy: 'no-referrer'
    });

    // Throw an error if request fails or returns a non-OK status.
    if (!response.ok) {
      throw new Error(`Backend scan failed with status ${response.status}`);
    }

    // Parse JSON response and extract 'safe' flag
    const data = await response.json();
    return data.safe;
  } catch (error) {
    console.error("Error contacting backend API:", error);
    throw error;
  }
}

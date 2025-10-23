// ./popup/popup.js

/**
 * @fileoverview Popup UI logic for the PhishDetective Chrome extension.
 *
 * @description
 * Handles user interactions in the popup. Sends the active tab URL to the
 * background service worker for scanning, and updates the UI with the scan results.
 *
 * @module popup/popup.js
 * @version 1.0.0
 * @since 2025-10-22
 */

/**
 * Click listener for the "Scan" button.
 * Retrieves the active tab URL, sends it to the background script for scanning,
 * and updates the result display based on the response.
 */
document.getElementById("scanBtn").addEventListener("click", async () => {
  // Get the currently active tab in the current window
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Prepare the result box
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Scanning...";
  resultDiv.className = "result-box"; // Reset any previous status class

  // Send URL to background.js for scanning
  chrome.runtime.sendMessage({ action: "scan_url", url }, (response) => {
    // Catch background communication errors
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError.message);
      resultDiv.textContent = "Scan failed: internal error.";
      resultDiv.classList.add("result-unsafe");
      return;
    }

    // URL scheme unsupported
    if (!response.scannable) {
      resultDiv.textContent = "This type of page cannot be scanned. Only regular websites (http/https) are supported.";
      resultDiv.classList.add("result-warning")
      return;
    }

    // Fallback if no response received
    if (!response) {
      resultDiv.textContent = "Could not scan URL. Please try again.";
      resultDiv.classList.add("result-warning");
      return;
    }

    // Site unreachable
    if (!response.reachable) {
      if (response.safe) {
        resultDiv.textContent = "The website is not reachable, but it is not flagged as unsafe by Google Safe Browsing.";
        resultDiv.classList.add("result-warning");
      } else {
        resultDiv.innerHTML = `
          <strong>Warning:</strong> The website is unreachable and also flagged as potentially unsafe by Google Safe Browsing.
          <br><br><small>Tip: Always verify the website's domain name carefully. Do not enter any personal information or passwords unless you are certain the site is legitimate and trustworthy.</small>
        `;
        resultDiv.classList.add("result-unsafe");
      }
      return;
    }

    // URL reachable: update UI based on safety
    if (response.safe) {
      resultDiv.textContent = "This URL appears to be safe.";
      resultDiv.classList.add("result-safe");
    } else {
      resultDiv.innerHTML = `
        <strong>Warning:</strong> This website may be unsafe or potentially a phishing attempt.
        <br><br><small>Tip: Always verify the website's domain name carefully. Do not enter any personal information or passwords unless you are certain the site is legitimate and trustworthy.</small>
      `;
      resultDiv.classList.add("result-unsafe");
    }
  });
});



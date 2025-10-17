document.getElementById("scanBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Scanning...";
  resultDiv.className = "result-box"; // Reset any previous status class

  chrome.runtime.sendMessage({ action: "scan_url", url }, (response) => {
    // Catch background communication errors
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError.message);
      resultDiv.textContent = "Scan failed: internal error.";
      resultDiv.classList.add("result-unsafe");
      return;
    }

    if (!response || !response.success) {
      resultDiv.textContent = "Could not scan URL. Please try again.";
      resultDiv.classList.add("result-warning");
      return;
    }

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



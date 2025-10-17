chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scan_url") {
    const url = message.url;

    // Run your async code inside an IIFE
    (async () => {
      try {
        const safe = await checkUrlWithGoogleSafeBrowsing(url);
        sendResponse({ success: true, safe });
      } catch (error) {
        console.error("Scan error:", error);
        sendResponse({ success: false, error: error.message });
      }
    })();

    // Tell Chrome this is an async response
    return true;
  }
});

async function checkUrlWithGoogleSafeBrowsing(url) {
  const body = {
    client: {
      clientId: "phishing-scanner",
      clientVersion: "1.0.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  const response = await fetch(
    "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=API_KEY",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();
  return !data.matches; // returns true if safe, false if matched
}

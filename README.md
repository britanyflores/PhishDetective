# PhishDetective - Chrome Extension

PhishDetective helps you stay safe online by scanning the website you’re currently visiting for potential phishing or unsafe domains.
It uses the Google Safe Browsing API (via a secure backend hosted on GCP) to check if the page is known for phishing, malware, or other harmful activity — all in a single click.


## Features

One-click scan: Instantly analyze the active tab’s URL.

Smart safety checks: Uses Google’s Safe Browsing API for threat detection.

Reachability testing: Detects if a website is offline or suspiciously unreachable.

Real-time feedback: Displays clear visual indicators for safe, unsafe, or unreachable pages.

Privacy-first: No browsing data is stored or shared. URLs are only sent for scanning via your private backend.


## How It Works

Click the PhishDetective icon in your Chrome toolbar.

Press Scan to analyze the active tab’s URL.

The popup will show:

Safe: Site is reachable and not flagged by Google Safe Browsing.

Warning:  Site is unreachable or possibly unsafe.

Unsafe: Site is flagged as potentially malicious or phishing.


## Architecture Overview

User → Chrome Extension → Background Service Worker → GCP Backend → Google Safe Browsing API


Frontend (Extension): Built with Manifest V3, includes popup UI and background logic.

Backend (Node.js/Express): Hosted on Google Cloud Platform, proxies Safe Browsing API calls securely.

API Used: Google Safe Browsing v4


## Permissions

This extension requests only:

activeTab — To read the current tab’s URL for scanning.

No user data, browsing history, or other personal information is collected or stored.


## Tech Stack

Frontend: Chrome Extension (Manifest V3), JavaScript, HTML, CSS
Backend: Node.js, Express, Google Safe Browsing API
Hosting: Google Cloud Platform (GCP)


## Installation
From Chrome Web Store

Install PhishDetective from the Chrome Web Store

Link: https://chromewebstore.google.com/detail/bnlhjoffnkncjdoiackieemigjliomka?utm_source=item-share-cb 


## License 

Copyright 2025 Britany Flores

All rights reserved.

You may not copy, modify, reproduce, redistribute, sublicense, or use any part of this source code without the express written permission of the copyright holder.

This project is not open source and is not licensed for public use or reuse.

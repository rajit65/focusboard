# FocusBoard

A small, dependency-free task dashboard built with semantic HTML, modern CSS, and vanilla JavaScript.

## Features

- Add, complete, filter, and delete tasks
- Assign low, normal, or high priority
- Daily progress indicator
- Light and dark themes
- Browser persistence with `localStorage`
- Responsive and keyboard-friendly UI

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Install on iPhone

The site is configured as a Progressive Web App. Deploy it to any HTTPS static host,
open the deployed address in Safari, tap **Share**, then choose **Add to Home Screen**.
After the first successful load, the app shell works offline and task data remains on
the iPhone in browser storage.

## Project structure

```text
.
├── index.html    # Page structure
├── styles.css    # Layout, themes, and responsive styling
├── app.js        # Task state and interactions
├── manifest.webmanifest
├── service-worker.js
├── icons/         # App artwork
└── README.md     # Project notes
```

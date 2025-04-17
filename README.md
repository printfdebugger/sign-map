# Google Maps Coordinates Viewer

## Features
- Fetches a dynamic list of locations from a JSON file.
- Displays a list of places with clickable entries.
- On click, shows the place on Google Maps.
- Shows a short description and image (if available) for each location.

## Technical Details
- Pure HTML + JavaScript frontend (no backend required).
- Google Maps JavaScript API used for rendering the map.
- JSON file can be hosted publicly (e.g., Google Drive as raw file or local hosting).
- Image links are expected to be direct links (e.g., Google Drive shared using `uc?id=...` format).

## Assumptions
- The `locations.json` file will be updated manually by the user and must be publicly accessible.
- Images must also be publicly accessible via Google Drive or similar service.
- The site is static and can be hosted on GitHub Pages, Netlify, Vercel, or opened locally.

## Required Configuration
- Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` with your own Google Maps JavaScript API key.
- Replace `YOUR_IMAGE_FILE_ID_X` in `locations.json` with real Google Drive image file IDs.

## How to Use
1. Replace placeholder values in `locations.json` and `index.html`.
2. Host the files (or open `index.html` locally).
3. Ensure your API key has access to the Maps JavaScript API.

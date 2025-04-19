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

# Herceghalom Street Sign Map

A web application that displays street signs from Herceghalom on an interactive map using Leaflet.js and Netlify serverless functions.

## Features

- Interactive map of Herceghalom with location markers for street signs
- Pop-up windows with street names and images
- Responsive design for mobile and desktop
- Images stored in Netlify Blobs for efficient delivery
- Serverless function for image serving with caching

## Technology Stack

- HTML, CSS, JavaScript
- Leaflet.js for mapping
- Netlify for hosting
- Netlify Functions for serverless image serving
- Netlify Blobs for image storage

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up Netlify environment variables:
   - `NETLIFY_SITE_ID` - Your Netlify site ID
   - `NETLIFY_BLOBS_TOKEN` - A token with access to Blobs

## How It Works

- Street sign data is stored in `data.json` with coordinates and image references
- Images are stored in Netlify Blobs storage in a store called "images"
- The `/images/filename.jpeg` path is redirected to a serverless function
- The function retrieves the image from Netlify Blobs and serves it with caching headers
- The index.html file displays the map and fetches data from data.json

## Development

To run the site locally:

```
npm start
```

This will start a local development server using Netlify Dev.

## Image Management

Images can be uploaded to Netlify Blobs using the provided script:

```
node upload_images.js
```

The script will upload all images in the `/images` directory to Netlify Blobs.

## Deployment

This site is configured for automatic deployment on Netlify. Just push to your Git repository, and Netlify will handle the rest.

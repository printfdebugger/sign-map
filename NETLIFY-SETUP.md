# Netlify Serverless Setup for Street Sign Map

This project uses Netlify Blobs for image storage and Netlify Functions for serving images with proper caching.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Deploy this project to Netlify:

```bash
netlify deploy --prod
```

3. Set up environment variables in Netlify:
   - `NETLIFY_SITE_ID` - Your Netlify site ID
   - `NETLIFY_BLOBS_TOKEN` - A token with access to Blobs

## How it Works

- Images are stored in Netlify Blobs in a store called "images"
- The serverless function `/netlify/functions/get-image.js` serves these images
- All requests to `/images/filename.jpeg` are routed to the function
- The function handles caching (1-year cache) for optimal performance
- The data.json file references images using the path format: `/images/X.jpeg`
- Dependencies are installed via the top-level package.json
- The `@netlify/plugin-functions-install-core` plugin ensures functions have access to dependencies

## Uploading Images

Images can be uploaded to the Blobs store using the `upload_images.js` script:

```bash
node upload_images.js
```

## Development

To test locally:

```bash
npm start
```

This will serve the site and functions locally, allowing you to test before deployment. 
# Netlify Serverless Setup for Street Sign Map

This project uses Netlify Blobs for image storage and Netlify Functions for serving images with proper caching.

## Setup Instructions

1. Deploy this project to Netlify:

```bash
netlify deploy --prod
```

2. Set up environment variables in Netlify:
   - `NETLIFY_SITE_ID` - Your Netlify site ID
   - `NETLIFY_BLOBS_TOKEN` - A token with access to Blobs

3. Install dependencies for the serverless function:

```bash
cd netlify/functions
npm install
```

## How it Works

- Images are stored in Netlify Blobs in a store called "images"
- The serverless function `/netlify/functions/get-image.js` serves these images
- All requests to `/images/filename.jpeg` are routed to the function
- The function handles caching (1-year cache) for optimal performance
- The data.json file references images using the path format: `/images/X.jpeg`

## Uploading Images

Images can be uploaded to the Blobs store using the `upload_images.js` script:

```bash
node upload_images.js
```

## Development

To test locally:

```bash
netlify dev
```

This will serve the site and functions locally, allowing you to test before deployment. 
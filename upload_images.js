// upload-images.js
require('dotenv').config(); // Load .env
const { getStore } = require('@netlify/blobs');
const fs = require('fs/promises');
const path = require('path');

// Initialize the Blob store (named "images")
const store = getStore({
  name: 'images',
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_BLOBS_TOKEN,
});

async function uploadImages() {
  // Path to your local images folder
  const imagesDir = path.join(__dirname, 'images');
  const files = await fs.readdir(imagesDir);
  
  // Filter files to only include those that come after 2.jpeg
  const filteredFiles = files.filter(file => {
    return file > "22.jpeg";
  });

  console.log(`Found ${filteredFiles.length} files to upload (after 2.jpeg)`);

  for (const file of filteredFiles) {
    const filePath = path.join(imagesDir, file);
    const imageBuffer = await fs.readFile(filePath);

    // Upload to Netlify Blobs
    await store.set(file, imageBuffer);
    console.log(`Uploaded: ${file}`);
  }
}

uploadImages().catch(console.error);
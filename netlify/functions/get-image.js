const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Get the image filename from the path parameter
    console.log('Event path:', event.path);
    console.log('Event params:', event.pathParameters);
    console.log('Event queryParams:', event.queryStringParameters);
    
    // Extract image name correctly based on path structure
    let imageName;
    
    // For /images/filename.jpeg format (via redirects)
    if (event.path.startsWith('/images/')) {
      imageName = event.path.replace('/images/', '');
    }
    // For direct function calls to /.netlify/functions/get-image/filename.jpeg
    else if (event.path.includes('/get-image/')) {
      const parts = event.path.split('/get-image/');
      imageName = parts[1];
    }
    // Fallback to the last path component
    else {
      const pathParts = event.path.split('/');
      imageName = pathParts[pathParts.length - 1];
    }
    
    console.log(`Extracted image name: '${imageName}'`);
    
    if (!imageName || imageName === '') {
      console.log('No image name found in request');
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Image name is required',
          path: event.path 
        })
      };
    }

    // Initialize the Blob store with explicit credentials
    const store = getStore({
      name: 'images',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });

    console.log(`Looking for image '${imageName}' in 'images' store`);
    
    // Check if the image exists and get it as ArrayBuffer
    const imageData = await store.get(imageName, { type: 'arrayBuffer' });
    
    if (!imageData) {
      console.log(`Image not found: ${imageName}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Image not found',
          imageName: imageName,
          path: event.path 
        })
      };
    }

    console.log(`Found image: ${imageName}, size: ${imageData.byteLength} bytes`);

    // Determine content type based on file extension
    let contentType = 'image/jpeg'; // Default
    if (imageName.endsWith('.png')) contentType = 'image/png';
    if (imageName.endsWith('.gif')) contentType = 'image/gif';
    if (imageName.endsWith('.webp')) contentType = 'image/webp';

    // Set cache control headers to cache the image for a long time
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Netlify-CDN-Cache-Control': 'public, max-age=31536000, stale-while-revalidate=86400', 
        'Content-Length': imageData.byteLength.toString()
      },
      body: Buffer.from(imageData).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch image', 
        details: error.message,
        stack: error.stack
      })
    };
  }
} 
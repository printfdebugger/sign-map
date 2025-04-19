const { getStore } = require('@netlify/blobs');

// Function to generate a signed URL for direct CDN access
async function getSignedImageUrl(imageName) {
  const store = getStore({
    name: 'images',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN
  });
  
  // Generate a signed URL that's valid for 1 hour (3600 seconds)
  return store.getSignedUrl(imageName, { expiresIn: 3600 });
}

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
    
    // Check if the image exists
    const exists = await store.head(imageName);
    if (!exists) {
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

    // Get a signed URL for direct CDN access
    const signedUrl = await getSignedImageUrl(imageName);
    console.log(`Generated signed URL for ${imageName}`);
    
    // Redirect to the signed URL
    return {
      statusCode: 302,
      headers: {
        'Location': signedUrl,
        'Cache-Control': 'public, max-age=31536000'
      },
      body: ''
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
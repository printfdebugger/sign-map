const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Get the image filename from the path parameter
    const imageName = event.path.split('/').pop();
    
    if (!imageName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image name is required' })
      };
    }

    // Initialize the Blob store
    const store = getStore({
      name: 'images'
      // siteID and token are automatically set by Netlify Functions
    });

    // Get the image from blob storage
    const imageData = await store.get(imageName, { type: 'arrayBuffer' });
    
    if (!imageData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Image not found' })
      };
    }

    // Determine content type based on file extension
    let contentType = 'image/jpeg'; // Default
    if (imageName.endsWith('.png')) contentType = 'image/png';
    if (imageName.endsWith('.gif')) contentType = 'image/gif';
    if (imageName.endsWith('.webp')) contentType = 'image/webp';

    // Return the image with caching headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'ETag': context.functionID // Use function ID as a simple ETag
      },
      body: Buffer.from(imageData).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image', details: error.message })
    };
  }
} 
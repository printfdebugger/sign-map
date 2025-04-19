const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Extract image name from query parameter
    const imageName = event.queryStringParameters?.image || '0.jpeg';
    
    console.log(`Testing retrieval of image: ${imageName}`);
    
    // Initialize the Blob store with explicit credentials
    const store = getStore({
      name: 'images',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });
    
    // First list all blobs for diagnostics
    const { blobs } = await store.list();
    console.log(`Found ${blobs.length} total images in store`);
    
    // Check if the image exists in the listing
    const exists = blobs.some(blob => blob.key === imageName);
    console.log(`Image "${imageName}" exists in listing: ${exists}`);
    
    // Try to get the image
    const imageData = await store.get(imageName, { type: 'arrayBuffer' });
    
    if (!imageData) {
      console.log(`Image not found: ${imageName}`);
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Image not found',
          imageName: imageName,
          exists: exists, 
          available: blobs.map(b => b.key)
        })
      };
    }
    
    console.log(`Found image: ${imageName}, size: ${imageData.byteLength} bytes`);
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (imageName.endsWith('.png')) contentType = 'image/png';
    
    // Return the image
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType
      },
      body: Buffer.from(imageData).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error in test-image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to test image', 
        details: error.message,
        stack: error.stack
      })
    };
  }
} 
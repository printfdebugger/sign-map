const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    console.log('Creating store connection');
    const store = getStore({
      name: 'images',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });

    console.log('Listing blobs in the store');
    const { blobs } = await store.list();
    
    console.log(`Found ${blobs.length} images in the store`);
    
    const imageList = blobs.map(blob => ({
      key: blob.key,
      etag: blob.etag
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        count: blobs.length,
        images: imageList
      }, null, 2)
    };
  } catch (error) {
    console.error('Error listing images:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to list images', 
        details: error.message,
        stack: error.stack
      })
    };
  }
} 
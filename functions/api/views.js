// EdgeOne Pages Function to handle page view counting
// This function interacts with KV storage to track page views

export default async function onRequest(context) {
  const { request, env } = context;
  
  // Check if KV namespace is available
  // The KV namespace should be bound in EdgeOne Pages console with variable name 'BLOG_KV'
  const kv = env.BLOG_KV;
  
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV storage not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate slug format to prevent injection attacks
  // Allow alphanumeric, hyphens, underscores, and forward slashes (for nested paths)
  if (!/^[a-zA-Z0-9/_-]+$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'invalid slug format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const key = `views:${slug}`;

  // Handle GET request - retrieve view count
  if (request.method === 'GET') {
    try {
      const count = await kv.get(key);
      return new Response(JSON.stringify({ 
        slug,
        views: count ? parseInt(count, 10) : 0 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve views' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle POST request - increment view count with retry logic
  if (request.method === 'POST') {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const currentCount = await kv.get(key);
        const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1;
        
        // Attempt to store the new count
        await kv.put(key, String(newCount));
        
        // Verify the write was successful
        const verifyCount = await kv.get(key);
        const finalCount = verifyCount ? parseInt(verifyCount, 10) : newCount;
        
        return new Response(JSON.stringify({ 
          slug,
          views: finalCount
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          return new Response(JSON.stringify({ error: 'Failed to increment views after retries' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        // Wait briefly before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      }
    }
  }

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}

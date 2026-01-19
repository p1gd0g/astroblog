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

  // Handle POST request - increment view count
  if (request.method === 'POST') {
    try {
      const currentCount = await kv.get(key);
      const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1;
      await kv.put(key, String(newCount));
      
      return new Response(JSON.stringify({ 
        slug,
        views: newCount 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to increment views' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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

// The domain where your Tor client with HTTP server/reverse proxy is running
const TOR_CLIENT_ENDPOINT = 'http://your-tor-client-domain.com';

// The specific onion service you want to allow
const ALLOWED_ONION_SERVICE = 'myonionservice.onion';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Check if the request path starts with the allowed onion service
  if (!url.pathname.startsWith(`/${ALLOWED_ONION_SERVICE}/`)) {
    return new Response('Forbidden: This proxy only allows access to a specific onion service.', { status: 403 });
  }
  
  // Append the original request path to the TOR_CLIENT_ENDPOINT
  const proxiedURL = new URL(url.pathname, TOR_CLIENT_ENDPOINT);
  
  // Create a new request with the proxied URL
  const newRequest = new Request(proxiedURL, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  
  // Fetch the request from the Tor client
  const response = await fetch(newRequest);
  
  // Return the response to the client
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

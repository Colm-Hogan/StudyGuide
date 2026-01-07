export async function onRequest(context) {
  const { request, env } = context;

  // Check for basic auth header
  const auth = request.headers.get('Authorization');

  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorised();
  }

  // Decode credentials
  const encoded = auth.substring(6);
  const decoded = atob(encoded);
  const [username, password] = decoded.split(':');

  // Check against environment variables
  if (username !== env.AUTH_USERNAME || password !== env.AUTH_PASSWORD) {
    return unauthorised();
  }

  // Auth passed - continue to next handler
  return context.next();
}

function unauthorised() {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Login Required"'
    }
  });
}
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const env = import.meta.env;
    const adminPassword = env.ADMIN_PASSWORD || 'lusdaAdmin123'; // fallback for local testing if not set

    if (data.password === adminPassword) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid password' }), { status: 401 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: 'Bad request' }), { status: 400 });
  }
};

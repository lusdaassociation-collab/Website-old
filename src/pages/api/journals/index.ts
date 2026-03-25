import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = (locals as any).runtime;
    if (!runtime || !runtime.env || !runtime.env.DB) {
       // Mock data for local testing without wrangler
       if (import.meta.env.DEV) {
          return new Response(JSON.stringify({ 
            success: true, 
            journals: [
              { title: 'Dispatch No. 21', slug: 'dispatch-no-21', excerpt: 'The latest issue of the Diplomatic Digest...', published_at: new Date().toISOString() }
            ] 
          }), { status: 200 });
       }
       return new Response(JSON.stringify({ success: false, message: 'DB binding not available' }), { status: 500 });
    }

    const { DB } = runtime.env;
    const { results } = await DB.prepare(`SELECT * FROM journals ORDER BY published_at DESC LIMIT 50`).all();

    return new Response(JSON.stringify({ success: true, journals: results }), { status: 200 });
  } catch (error: any) {
    console.error('Fetch Journals Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

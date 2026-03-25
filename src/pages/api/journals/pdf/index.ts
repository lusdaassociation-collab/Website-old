import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals, url }) => {
  try {
    const fileKey = url.searchParams.get('key');
    if (!fileKey) {
      return new Response('Missing file key', { status: 400 });
    }

    const runtime = (locals as any).runtime;
    if (!runtime || !runtime.env || !runtime.env.JOURNAL_BUCKET) {
      if (import.meta.env.DEV) {
         return new Response('Mock PDF data for local dev', { status: 200, headers: {'Content-Type': 'application/pdf'} });
      }
      return new Response('Storage binding not available', { status: 500 });
    }

    const { JOURNAL_BUCKET } = runtime.env;
    const object = await JOURNAL_BUCKET.get(fileKey);

    if (object === null) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Content-Type', 'application/pdf');

    return new Response(object.body, {
      headers,
      status: 200
    });

  } catch (error: any) {
    console.error('Fetch PDF Error:', error);
    return new Response(error.message, { status: 500 });
  }
};

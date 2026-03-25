import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authenticate
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];
    const env = import.meta.env;
    const adminPassword = env.ADMIN_PASSWORD || 'lusdaAdmin123';

    if (token !== adminPassword) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const excerpt = formData.get('excerpt')?.toString() || '';
    const file = formData.get('pdfFile') as File;

    if (!title || !file) {
      return new Response(JSON.stringify({ success: false, message: 'Title and PDF file are required' }), { status: 400 });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fileKey = `journals/${slug}-${Date.now()}.pdf`;

    // 3. Upload to R2
    // Note: Astro docs suggest accessing Cloudflare bindings via locals in pages,
    // or context.locals.runtime.env depending on adapter version.
    // For Astro 5 / @astrojs/cloudflare, bindings are in locals.runtime.env
    const runtime = (locals as any).runtime;
    if (!runtime || !runtime.env || !runtime.env.JOURNAL_BUCKET || !runtime.env.DB) {
       console.warn("Cloudflare bindings not found in locals. Are you running wrangler dev?");
       // Mock success for local dev if bindings aren't active yet
       if (import.meta.env.DEV) {
          return new Response(JSON.stringify({ success: true, message: 'MOCK SUCCESS (DEV)' }), { status: 200 });
       }
       return new Response(JSON.stringify({ success: false, message: 'Server configuration error' }), { status: 500 });
    }

    const { JOURNAL_BUCKET, DB } = runtime.env;

    await JOURNAL_BUCKET.put(fileKey, file.stream(), {
      httpMetadata: { contentType: 'application/pdf' }
    });

    // 4. Save to D1
    const stmt = DB.prepare(
      `INSERT INTO journals (title, slug, excerpt, file_key) VALUES (?, ?, ?, ?)`
    ).bind(title, slug, excerpt, fileKey);

    await stmt.run();

    return new Response(JSON.stringify({ success: true, slug }), { status: 200 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};

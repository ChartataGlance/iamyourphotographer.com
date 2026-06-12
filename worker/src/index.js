const PUBLIC_PHOTOS_DOMAIN = "https://photos.iamyourphotographer.com";
const ROOT_PREFIX = "gallery/";
const ALLOWED_FOLDERS = ["weddings", "portraits", "events", "family", "brands"];
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return corsResponse(null);

    if (url.pathname === "/api/folders") {
      return corsResponse({ folders: ALLOWED_FOLDERS });
    }

    if (url.pathname === "/api/gallery") {
      const folder = url.searchParams.get("folder") || ALLOWED_FOLDERS[0];

      if (!ALLOWED_FOLDERS.includes(folder)) {
        return corsResponse({ error: "Invalid folder" }, 400);
      }

      const prefix = `${ROOT_PREFIX}${folder}/`;
      const listed = await env.GALLERY_BUCKET.list({ prefix, limit: 1000 });

      const images = listed.objects
        .filter(item => IMAGE_RE.test(item.key))
        .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))
        .map(item => ({
          key: item.key,
          url: `${PUBLIC_PHOTOS_DOMAIN}/${item.key}`,
          alt: `${folder} photography by I Am Your Photographer`,
          size: item.size,
          uploaded: item.uploaded
        }));

      return corsResponse({ folder, prefix, count: images.length, images });
    }

    return corsResponse({
      ok: true,
      routes: ["/api/folders", "/api/gallery?folder=weddings"]
    });
  }
};

function corsResponse(data, status = 200) {
  return new Response(data ? JSON.stringify(data, null, 2) : null, {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "https://iamyourphotographer.com",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "cache-control": "public, max-age=300"
    }
  });
}

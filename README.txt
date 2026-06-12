UPLOAD TO GITHUB PAGES:
- index.html
- assets/styles.css
- assets/script.js
- robots.txt
- sitemap.xml

CLOUDFLARE WORKER:
- worker/src/index.js
- worker/wrangler.toml

R2 FOLDER STRUCTURE:
gallery/weddings/
gallery/portraits/
gallery/events/
gallery/family/
gallery/brands/

IMPORTANT:
1. Replace YOUR_R2_BUCKET_NAME in worker/wrangler.toml.
2. Make sure photos.iamyourphotographer.com is connected to the same R2 bucket as a public custom domain.
3. Deploy Worker on gallery.iamyourphotographer.com.
4. In assets/script.js, WORKER_BASE_URL is already set to https://gallery.iamyourphotographer.com.

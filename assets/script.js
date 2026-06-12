document.getElementById('year').textContent = new Date().getFullYear();

// Optional future Worker gallery loader.
// Add your Worker URL below when ready, for example:
// const WORKER_URL = 'https://iamyourphotographer-gallery.yourname.workers.dev';
const WORKER_URL = '';

async function loadGalleryFromWorker(folder = '') {
  if (!WORKER_URL) return;

  try {
    const url = folder ? `${WORKER_URL}?folder=${encodeURIComponent(folder)}` : WORKER_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gallery worker failed');

    const data = await response.json();
    const gallery = document.getElementById('gallery');
    if (!gallery || !Array.isArray(data.images)) return;

    gallery.innerHTML = data.images.map((img) => `
      <figure>
        <img src="${img.url}" alt="Photography gallery image by I Am Your Photographer" loading="lazy">
        <figcaption>${cleanCaption(img.key || img.name || 'Gallery')}</figcaption>
      </figure>
    `).join('');
  } catch (error) {
    console.warn('Using static gallery because Worker gallery did not load.', error);
  }
}

function cleanCaption(value) {
  const first = String(value).split('/')[0] || 'Gallery';
  return first.charAt(0).toUpperCase() + first.slice(1).replaceAll('-', ' ');
}

// Disabled until WORKER_URL is added.
// loadGalleryFromWorker();

const WORKER_BASE_URL = "https://gallery.iamyourphotographer.com";
const FALLBACK_FOLDERS = ["weddings", "portraits", "events", "family", "brands"];
const FOLDER_LABELS = {
  weddings: "Weddings",
  portraits: "Portraits",
  events: "Events",
  family: "Family",
  brands: "Brands"
};

const gallery = document.getElementById("gallery");
const folderTabs = document.getElementById("folderTabs");
const statusBox = document.getElementById("galleryStatus");
document.getElementById("year").textContent = new Date().getFullYear();

async function api(path) {
  const res = await fetch(`${WORKER_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function loadFolders() {
  try {
    const data = await api("/api/folders");
    const folders = Array.isArray(data.folders) && data.folders.length ? data.folders : FALLBACK_FOLDERS;
    renderTabs(folders);
    await loadGallery(folders[0]);
  } catch (error) {
    console.warn(error);
    renderTabs(FALLBACK_FOLDERS);
    await loadGallery(FALLBACK_FOLDERS[0]);
  }
}

function renderTabs(folders) {
  folderTabs.innerHTML = folders.map((folder, index) => `
    <button type="button" class="${index === 0 ? "active" : ""}" data-folder="${folder}">
      ${FOLDER_LABELS[folder] || folder.replaceAll("-", " ")}
    </button>
  `).join("");

  folderTabs.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      folderTabs.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      loadGallery(button.dataset.folder);
    });
  });
}

async function loadGallery(folder) {
  statusBox.textContent = `Loading ${FOLDER_LABELS[folder] || folder} photos...`;
  gallery.innerHTML = "";

  try {
    const data = await api(`/api/gallery?folder=${encodeURIComponent(folder)}`);
    const images = data.images || [];

    if (!images.length) {
      statusBox.textContent = `No photos found in gallery/${folder}/ yet.`;
      return;
    }

    statusBox.textContent = `${images.length} photos in ${FOLDER_LABELS[folder] || folder}`;
    gallery.innerHTML = images.map((image, index) => `
      <figure>
        <img src="${image.url}" alt="${escapeHtml(image.alt || `${FOLDER_LABELS[folder] || folder} photography by I Am Your Photographer`)}" loading="${index === 0 ? "eager" : "lazy"}">
        <figcaption>${FOLDER_LABELS[folder] || folder}</figcaption>
      </figure>
    `).join("");
  } catch (error) {
    console.error(error);
    statusBox.textContent = "Gallery could not load. Check your Worker URL, R2 binding and CORS headers.";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;"
  }[char]));
}

loadFolders();

// Replace this URL if the GitHub Pages location changes.
const MOBILE_AR_URL = 'https://zikooo29.github.io/AR-S.H.I.E.L.D/ar.html';

// Open the back camera and place the S.H.I.E.L.D. panel over the live environment.
function initCameraAr() {
  const cameraRoot = document.getElementById('cameraAr');
  const video = document.getElementById('cameraFeed');
  const permissionPanel = document.getElementById('cameraPermission');
  const startButton = document.getElementById('startCameraButton');
  const scanStatus = document.getElementById('scanStatus');
  const searchInput = document.getElementById('heroSearch');
  const selectPanel = document.getElementById('selectPanel');
  const dossierLayer = document.getElementById('heroDossierLayer');
  const backButton = document.getElementById('backToSelect');
  const spidermanModelStage = document.getElementById('spidermanModelStage');
  const spidermanModel = document.getElementById('spidermanModel');
  const modelLoadStatus = document.getElementById('modelLoadStatus');
  if (!cameraRoot || !video) return;

  async function requestCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (scanStatus) scanStatus.textContent = 'Camera wordt niet ondersteund in deze browser.';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      activateCamera(stream);
    } catch (exactError) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        activateCamera(stream);
      } catch (error) {
        if (scanStatus) scanStatus.textContent = 'Camera toegang geweigerd. Probeer opnieuw.';
        permissionPanel?.classList.remove('is-hidden');
      }
    }
  }

  function activateCamera(stream) {
    video.srcObject = stream;
    cameraRoot.classList.add('is-camera-ready');
    permissionPanel?.classList.add('is-hidden');
    if (scanStatus) scanStatus.textContent = 'S.H.I.E.L.D. AR panel initialized';
  }

  function openEmptyDossier(heroKey) {
    selectPanel?.classList.add('is-hidden');
    dossierLayer?.classList.remove('is-hidden');
    spidermanModelStage?.classList.toggle('is-hidden', heroKey !== 'spiderman');
    if (heroKey === 'spiderman' && modelLoadStatus) {
      modelLoadStatus.textContent = 'Spider-Man model laden...';
    }
  }

  function closeEmptyDossier() {
    dossierLayer?.classList.add('is-hidden');
    selectPanel?.classList.remove('is-hidden');
    spidermanModelStage?.classList.add('is-hidden');
  }

  startButton?.addEventListener('click', requestCamera);
  backButton?.addEventListener('click', closeEmptyDossier);
  spidermanModel?.addEventListener('model-loaded', () => {
    if (modelLoadStatus) modelLoadStatus.textContent = 'Spider-Man model geladen';
  });
  spidermanModel?.addEventListener('model-error', () => {
    if (modelLoadStatus) modelLoadStatus.textContent = 'Model kon niet laden';
  });

  const heroButtons = document.querySelectorAll('.ar-hero-button');

  heroButtons.forEach((button) => {
    button.addEventListener('click', () => {
      heroButtons.forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      openEmptyDossier(button.dataset.hero);
    });
  });

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    heroButtons.forEach((button) => {
      const haystack = button.dataset.search || button.dataset.hero || '';
      const isVisible = !query || haystack.includes(query);
      button.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (scanStatus) {
      scanStatus.textContent = visibleCount
        ? `${visibleCount} dossier result${visibleCount === 1 ? '' : 's'} found`
        : 'No matching hero dossier found';
    }
  });

  requestCamera();
}

// QR modal on the existing website.
function initQrModal() {
  const openButton = document.querySelector('.ar-button');
  const modal = document.querySelector('[data-qr-modal]');
  if (!openButton || !modal) return;

  const closeButtons = modal.querySelectorAll('[data-close-qr]');
  const qrImage = modal.querySelector('[data-qr-image]');
  const arLink = modal.querySelector('[data-ar-link]');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(MOBILE_AR_URL)}`;

  if (qrImage) qrImage.src = qrUrl;
  if (arLink) arLink.href = 'ar.html';

  openButton.addEventListener('click', (event) => {
    event.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initQrModal();
  initCameraAr();
});

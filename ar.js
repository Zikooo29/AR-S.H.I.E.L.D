const MOBILE_AR_URL = 'https://zikooo29.github.io/AR-S.H.I.E.L.D/ar.html';
const CAMERA_SIZE = {
  width: { ideal: 1280 },
  height: { ideal: 720 }
};

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
  const heroModelStage = document.getElementById('heroModelStage');
  const heroScene = heroModelStage?.querySelector('a-scene');
  const modelLoadStatus = document.getElementById('modelLoadStatus');
  if (!cameraRoot || !video) return;

  const heroModels = {
    spiderman: {
      name: 'Spider-Man',
      element: document.getElementById('spidermanModel'),
      isReady: false,
      didFail: false
    },
    deadpool: {
      name: 'Deadpool',
      element: document.getElementById('deadpoolModel'),
      isReady: false,
      didFail: false
    },
    ironman: {
      name: 'Iron Man',
      element: document.getElementById('ironmanModel'),
      isReady: false,
      didFail: false
    }
  };

  async function requestCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (scanStatus) scanStatus.textContent = 'Camera wordt niet ondersteund in deze browser.';
      return;
    }

    try {
      const stream = await getCameraStream({ exact: 'environment' });
      activateCamera(stream);
    } catch (exactError) {
      try {
        const stream = await getCameraStream({ ideal: 'environment' });
        activateCamera(stream);
      } catch (error) {
        if (scanStatus) scanStatus.textContent = 'Camera toegang geweigerd. Probeer opnieuw.';
        permissionPanel?.classList.remove('is-hidden');
      }
    }
  }

  function getCameraStream(facingMode) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        ...CAMERA_SIZE
      },
      audio: false
    });
  }

  function activateCamera(stream) {
    video.srcObject = stream;
    cameraRoot.classList.add('is-camera-ready');
    permissionPanel?.classList.add('is-hidden');
    if (scanStatus) scanStatus.textContent = 'S.H.I.E.L.D. AR panel initialized';
  }

  function showDossier(isOpen, heroKey = '') {
    selectPanel?.classList.toggle('is-hidden', isOpen);
    dossierLayer?.classList.toggle('is-hidden', !isOpen);
    showHeroModel(isOpen ? heroKey : '');
  }

  function showHeroModel(heroKey) {
    const selectedModel = heroModels[heroKey];
    const isVisible = Boolean(selectedModel);

    Object.entries(heroModels).forEach(([key, model]) => {
      model.element?.setAttribute('visible', key === heroKey);
    });

    heroModelStage?.classList.toggle('is-hidden', !isVisible);
    heroModelStage?.setAttribute('aria-hidden', String(!isVisible));
    if (!isVisible || !selectedModel || !modelLoadStatus) return;

    modelLoadStatus.classList.remove('is-hidden');
    if (selectedModel.didFail) {
      modelLoadStatus.textContent = `${selectedModel.name} model kon niet laden`;
      return;
    }
    if (selectedModel.isReady) {
      showLoadedModelStatus(selectedModel.name);
    } else {
      modelLoadStatus.textContent = `${selectedModel.name} AR model laden...`;
    }
    refreshHeroScene();
  }

  function showLoadedModelStatus(heroName) {
    if (!modelLoadStatus) return;
    modelLoadStatus.textContent = `${heroName} AR model actief`;
    window.setTimeout(() => modelLoadStatus.classList.add('is-hidden'), 1200);
  }

  function refreshHeroScene() {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      heroScene?.resize?.();
      heroScene?.renderer?.setSize(window.innerWidth, window.innerHeight);
    });
  }

  startButton?.addEventListener('click', requestCamera);
  backButton?.addEventListener('click', () => showDossier(false));
  Object.values(heroModels).forEach((model) => {
    model.element?.addEventListener('model-loaded', () => {
      model.isReady = true;
      showLoadedModelStatus(model.name);
    });
    model.element?.addEventListener('model-error', () => {
      model.didFail = true;
      if (modelLoadStatus) modelLoadStatus.textContent = `${model.name} model kon niet laden`;
    });
  });

  const heroButtons = document.querySelectorAll('.ar-hero-button');

  heroButtons.forEach((button) => {
    button.addEventListener('click', () => {
      heroButtons.forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      showDossier(true, button.dataset.hero);
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

  function toggleModal(isOpen) {
    modal.classList.toggle('is-open', isOpen);
    modal.setAttribute('aria-hidden', String(!isOpen));
  }

  openButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleModal(true);
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => toggleModal(false));
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      toggleModal(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initQrModal();
  initCameraAr();
});

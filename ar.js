// Replace this placeholder with your final deployed GitHub Pages URL.
const MOBILE_AR_URL = 'https://jouwgithubnaam.github.io/jouwproject/ar.html';

const HERO_DATA = {
  spiderman: {
    name: 'Spider-Man',
    role: 'Friendly Neighborhood Asset',
    image: 'AR scherm 1 afbeeldingen/Spiderman.png',
    profile: 'AR scherm 1 afbeeldingen/PF Spiderman.png',
    status: 'Active',
    access: '07',
    power: '86',
    equipment: 'Web shooters',
    threat: 'Enhanced agility'
  },
  deadpool: {
    name: 'Deadpool',
    role: 'Unstable Regeneration Asset',
    image: 'AR scherm 1 afbeeldingen/Deadpool.png',
    profile: 'AR scherm 1 afbeeldingen/PF Deadpool.png',
    status: 'Active',
    access: '09',
    power: '91',
    equipment: 'Katanas',
    threat: 'Chaotic combatant'
  },
  ironwoman: {
    name: 'Iron Woman',
    role: 'Armored Tech Specialist',
    image: 'AR scherm 1 afbeeldingen/Iron Woman.png',
    profile: 'AR scherm 1 afbeeldingen/Iron Woman.png',
    status: 'Active',
    access: '08',
    power: '94',
    equipment: 'Arc armor',
    threat: 'High energy tech'
  }
};

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

// Hero selection and dossier state on ar.html.
function initHeroDossier() {
  const selectView = document.getElementById('heroSelectView');
  const dossierView = document.getElementById('dossierView');
  if (!selectView || !dossierView) return;

  const cards = document.querySelectorAll('.hero-card');
  const backButton = document.getElementById('backToSelect');
  const closeButton = document.getElementById('closeDossier');

  function showSelection() {
    dossierView.classList.remove('is-active');
    selectView.classList.add('is-active');
  }

  function openDossier(heroKey) {
    const hero = HERO_DATA[heroKey];
    if (!hero) return;

    document.getElementById('heroName').textContent = hero.name;
    document.getElementById('heroRole').textContent = hero.role;
    document.getElementById('heroImage').src = hero.image;
    document.getElementById('heroImage').alt = hero.name;
    document.getElementById('profileImage').src = hero.profile;
    document.getElementById('profileImage').alt = `${hero.name} profile`;
    document.getElementById('heroStatus').textContent = hero.status;
    document.getElementById('heroAccess').textContent = hero.access;
    document.getElementById('heroPower').textContent = hero.power;
    document.getElementById('heroEquipment').textContent = hero.equipment;
    document.getElementById('heroThreat').textContent = hero.threat;

    cards.forEach((card) => card.classList.toggle('is-selected', card.dataset.hero === heroKey));
    selectView.classList.remove('is-active');
    dossierView.classList.add('is-active');
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openDossier(card.dataset.hero));
  });

  backButton?.addEventListener('click', showSelection);
  closeButton?.addEventListener('click', showSelection);
}

document.addEventListener('DOMContentLoaded', () => {
  initQrModal();
  initHeroDossier();
});

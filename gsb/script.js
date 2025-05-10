document.addEventListener('DOMContentLoaded', function () {
  // Aktuálny rok
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Background slider + dynamický nadpis/podnadpis
  const sliderContainer = document.querySelector('.slider-images');
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');

  if (sliderContainer) {
    const backgroundImages = [
      'assets/slider/1.webp',
      'assets/slider/2.webp',
      'assets/slider/3.webp',
      'assets/slider/4.webp',
      'assets/slider/5.webp',
    ];

    const slides = [
      {
        title: 'GoldSkyBlock HARDCORE',
        subtitle: 'Není pro každého. Ale možná právě pro tebe.',
      },
      {
        title: 'Free 2 Play | Free 2 Win',
        subtitle: '100 % fair play | Všichni začínají stejně. | Všichni můžou být nejlepší.',
      },
      {
        title: 'Tvé dobrodružství začíná mezi ostrovy v nicotě.',
        subtitle: '10 různých ostrovů. Prozkoumej, splň úkoly, posuň se dál.',
      },
      {
        title: 'Je to komunita, co drží pohromadě už několik let.',
        // subtitle: '10 různých ostrovů. Prozkoumej, splň úkoly, posuň se dál.',
      },
      {
        title: 'GoldSkyBlock ORIGINAL',
        subtitle: 'Server, kde se píše historie. Začni tam, kde to začalo všechno.',
      },
    ];

    backgroundImages.forEach((image, index) => {
      const imgElement = document.createElement('img');
      imgElement.src = image;
      imgElement.alt = 'Minecraft background';
      imgElement.classList.add('slider-image');
      if (index === 0) imgElement.classList.add('active');
      sliderContainer.appendChild(imgElement);
    });

    let currentImageIndex = 0;
    setInterval(() => {
      const images = document.querySelectorAll('.slider-image');
      images[currentImageIndex].classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % images.length;
      images[currentImageIndex].classList.add('active');

      if (heroTitle && heroSubtitle) {
        const heroContent = document.querySelector('.hero-content');
        heroContent.classList.add('fade-out');

        setTimeout(() => {
          heroTitle.textContent = slides[currentImageIndex].title;
          heroSubtitle.textContent = slides[currentImageIndex].subtitle || '';

          heroContent.classList.remove('fade-out');
        }, 400);
      }
    }, 5000);

  }

  // Scroll animácia pre header
  const header = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero-section');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
      heroSection?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
      heroSection?.classList.remove('scrolled');
    }
  });

  // Mobile menu
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  menuButton?.addEventListener('click', () => {
    menuButton.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
  });

  // Auto-close mobile menu
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuButton?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    });
  });

  // Hover efekt na tlačidlá
  const buttons = document.querySelectorAll('.join-button, .discord-button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.95)';
    });
    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1.05)';
    });
  });

  // Copy IP
  const copyBtn = document.getElementById('copy-ip');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const originalText = copyBtn.textContent;
      const ip = 'mc.goldskyblock.cz';
      navigator.clipboard.writeText(ip).then(() => {
        copyBtn.textContent = 'ZKOPÍROVANO!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
  }

  // Načítanie hráčov
  function loadPlayers(type) {
    let apiUrl = '';
    let containerId = '';

    if (type === 'original') {
      apiUrl = 'https://query.fakaheda.eu/82.208.17.24:27443.feed';
      containerId = 'original-players';
    } else if (type === 'hc') {
      apiUrl = 'https://query.fakaheda.eu/82.208.17.35:27114.feed';
      containerId = 'hc-players';
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<p style="color: #999;">Načítavam hráčov...</p>';

    fetch(apiUrl)
      .then(resp => resp.json())
      .then(data => {
        let html = '<div class="count">Počet hráčů: ' + data.players + ' / ' + (data.slots || '?') + '</div>';
        data.players_list.forEach(player => {
          html += '<div class="player">';
          html += '<img src="https://minotar.net/avatar/' + player.name + '" alt="' + player.name + '">';
          html += '<span>' + player.name + '</span></div>';
        });
        container.innerHTML = html;
      })
      .catch(err => {
        container.innerHTML = '<p style="color:red;">Chyba pri načítaní dát.</p>';
        console.error(err);
      });
  }

  loadPlayers('original');
  loadPlayers('hc');

  // Logo animácia podľa viditeľnosti veľkého loga
  function handleLogoRotation() {
    const centerLogo = document.querySelector('.center-logo');
    const headerLogo = document.querySelector('.logo-small img');

    if (!centerLogo || !headerLogo) return;

    const rect = centerLogo.getBoundingClientRect();
    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    if (isVisible) {
      headerLogo.classList.remove('rotate-animation');
    } else {
      headerLogo.classList.add('rotate-animation');
    }
  }

  window.addEventListener('scroll', handleLogoRotation);
  window.addEventListener('resize', handleLogoRotation);
  handleLogoRotation(); // Spustí sa aj na začiatku
});

// Dynmap toggle
document.addEventListener('DOMContentLoaded', () => {
  const btnOriginal = document.getElementById('btn-original');
  const btnHC = document.getElementById('btn-hc');
  const mapOriginal = document.getElementById('map-original');
  const mapHC = document.getElementById('map-hc');

  if (btnOriginal && btnHC && mapOriginal && mapHC) {
    btnOriginal.addEventListener('click', () => {
      btnOriginal.classList.add('active');
      btnHC.classList.remove('active');
      mapOriginal.classList.add('active');
      mapHC.classList.remove('active');
    });

    btnHC.addEventListener('click', () => {
      btnHC.classList.add('active');
      btnOriginal.classList.remove('active');
      mapHC.classList.add('active');
      mapOriginal.classList.remove('active');
    });
  }

  const openMapBtn = document.getElementById("openMapBtn");

  if (openMapBtn && btnOriginal && btnHC) {
    btnOriginal.addEventListener("click", () => {
      openMapBtn.href = "http://82.208.17.24:29443/#bskyblock_world;flat;0,64,-4;0";
    });

    btnHC.addEventListener("click", () => {
      openMapBtn.href = "http://82.208.17.35:29114/#skyblock;flat;0,64,-4;0";
    });
  }
});

// Vote systém
const input = document.getElementById("nickInput");
const voteButtons = document.getElementById("vote-buttons");
const cards = voteButtons?.querySelectorAll(".vote-card") || [];

document.addEventListener('DOMContentLoaded', () => {
  const storedNick = localStorage.getItem("gsb_nick");
  if (storedNick && input) {
    input.value = storedNick;
    toggleVoteButtons();
  }
});

function toggleVoteButtons() {
  const nick = input?.value.trim();
  if (!nick) return;

  localStorage.setItem("gsb_nick", nick);

  cards.forEach(card => {
    if (nick.length > 0) {
      card.classList.remove("disabled");
    } else {
      card.classList.add("disabled");
    }
  });
}

function vote(id) {
  const nick = input?.value.trim();
  if (!nick) return;

  let url = "";
  switch (id) {
    case 1:
      url = `https://www.minecraft-list.cz/server/goldskyblock-y5hf/vote?name=${nick}`;
      break;
    case 2:
      url = `https://craftlist.org/goldskyblock?nickname=${nick}`;
      break;
    case 3:
      url = `https://minecraftservery.eu/server/goldskyblock-1171/vote/${nick}`;
      break;
  }

  window.open(url, "_blank");
}

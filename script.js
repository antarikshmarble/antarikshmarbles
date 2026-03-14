const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.hero-dot'));
const heroLines = Array.from(document.querySelectorAll('.hero-line'));
const productGrid = document.querySelector('#product-grid');
const modal = document.querySelector('#product-modal');
const modalImage = document.querySelector('#modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalCrumb = document.querySelector('#modal-crumb');
const modalSpecs = document.querySelector('#modal-specs');
const modalPrice = document.querySelector('#modal-price');
const whatsappLink = document.querySelector('#whatsapp-link');
const modalClose = document.querySelector('.modal-close');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const productsDropdown = document.querySelector('.nav-item-dropdown');
const productsToggle = document.querySelector('.nav-dropdown-toggle');

const amLots = [
  {
    name: 'Statuario For Flooring',
    short: '',
    image: './assets/statuario-flooring.jpeg'
  },
  {
    name: 'Statuario For Stairs',
    short: '',
    image: './assets/statuario-stairs.jpeg'
  },
  {
    name: 'Statuario For Counters',
    short: '',
    image: './assets/statuario-counters.jpeg'
  },
  {
    name: 'Statuario For Wall Claddings',
    short: '',
    image: './assets/statuario-wall-claddings.jpeg'
  },
  {
    name: 'Statuario For Kitchen',
    short: '',
    image: './assets/statuario-kitchen.jpeg'
  },
  {
    name: 'Statuario For Bathrooms',
    short: '',
    image: './assets/statuario-bathrooms.jpeg'
  }
];

let activeSlide = 0;

function renderCollection(grid, items, label) {
  const isStatuarioShowcase = label === 'Statuario Luxe';

  grid.innerHTML = items
    .map((item, index) => {
      if (isStatuarioShowcase) {
        return `
          <article class="product-card showcase-card show" data-index="${index}" data-collection="${label}">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            <div class="product-info showcase-info">
              <h3>${item.name}</h3>
            </div>
          </article>
        `;
      }

      const tags = [item.specs.Material, item.specs.Code, item.specs.Finish]
        .map((tag) => `<span>${tag}</span>`)
        .join('');

      return `
        <article class="product-card" data-index="${index}" data-collection="${label}" tabindex="0" role="button" aria-label="View details for ${item.name}">
          <p class="card-topline">${label}</p>
          <img src="${item.image}" alt="${item.name} marble slab" loading="lazy" />
          <div class="product-info">
            <h3>${item.name}</h3>
            <p>${item.short}</p>
            <div class="product-meta">${tags}</div>
          </div>
        </article>
      `;
    })
    .join('');

  if (!isStatuarioShowcase) {
    requestAnimationFrame(() => {
      grid.querySelectorAll('.product-card').forEach((card, index) => {
        setTimeout(() => card.classList.add('show'), index * 70);
      });
    });
  }
}

function getCollectionItem(collection, index) {
  return amLots[index];
}

function setSlide(index) {
  activeSlide = index;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === index);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === index);
  });
  const lineIndex = index % heroLines.length;
  heroLines.forEach((line, idx) => {
    line.classList.toggle('active', idx === lineIndex);
  });
}

function openModal(item, label) {
  modalImage.src = item.image;
  modalTitle.textContent = `${label} ${item.name}`;
  modalDescription.textContent = item.description;
  modalCrumb.textContent = `Home > ${label} > ${item.name}`;
  modalPrice.textContent = item.price;

  modalSpecs.innerHTML = Object.entries(item.specs)
    .map(([key, value]) => `
      <tr>
        <th>${key.replace('_', ' ')}</th>
        <td>${value}</td>
      </tr>
    `)
    .join('');

  const query = encodeURIComponent(`Hello Antariksh Marbles, I am interested in ${label} ${item.name}. Please share details.`);
  whatsappLink.href = `https://wa.me/919929597411?text=${query}`;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindGrid(grid) {
  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (!card) {
      return;
    }
    openModal(getCollectionItem(card.dataset.collection, Number(card.dataset.index)), card.dataset.collection);
  });

  grid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    const card = event.target.closest('.product-card');
    if (!card) {
      return;
    }
    event.preventDefault();
    openModal(getCollectionItem(card.dataset.collection, Number(card.dataset.index)), card.dataset.collection);
  });
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.fade-section').forEach((section) => observer.observe(section));

setInterval(() => {
  setSlide((activeSlide + 1) % heroSlides.length);
}, 4200);

renderCollection(productGrid, amLots, 'Statuario Luxe');
setSlide(0);



if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    if (!isOpen && productsDropdown) {
      productsDropdown.classList.remove('open');
      if (productsToggle) {
        productsToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (productsDropdown) {
        productsDropdown.classList.remove('open');
      }
      if (productsToggle) {
        productsToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

if (productsToggle && productsDropdown) {
  productsToggle.addEventListener('click', () => {
    if (window.innerWidth > 740) {
      return;
    }

    const isOpen = productsDropdown.classList.toggle('open');
    productsToggle.setAttribute('aria-expanded', String(isOpen));
  });
}







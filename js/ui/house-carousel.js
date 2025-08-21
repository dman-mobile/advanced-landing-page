/**
 * Creates the HTML for a single house card.
 * @param {object} house - The house data object.
 * @returns {string} The HTML string for the card.
 */
const createHouseCardHTML = house => {
  const iconMap = {
    popular: 'icon-popular',
    'new house': 'icon-house',
    'best deals': 'icon-wallet',
  };
  const labelMap = {
    popular: 'Popular',
    'new': 'New house',
    'deal': 'Best deals',
  };
  const icon = iconMap[house.label.toLowerCase()] || 'icon-house';
  const label = labelMap[house.label.toLowerCase()] || 'New House';
  const labelClass = house.label.toLowerCase().replace(' ', '-');

  return `
    <div class="house-card" data-type="${house.type}">
      <div class="house-card__image">
        <img alt="${house.name}" src="${house.image}" />
        <div class="label label--${labelClass}">
          <svg><use href="assets/icons/icons.svg#${icon}"></use></svg>
          ${label}
        </div>
      </div>
      <div class="house-card__legend">
        <h3 class="house-card__name">${house.name}</h3>
        <p class="house-card__price">$${house.price.toLocaleString('es-AR')}</p>
      </div>
      <div class="house-card__user">
        <div class="house-card__user-icon">
          <img alt="${house.user}" src="${house.avatar}" />
        </div>
        <div class="house-card__user-text">
          <p class="house-card__username">${house.user}</p>
          <p class="house-card__location">${house.location}</p>
        </div>
      </div>
    </div>
  `;
};

export default function initHouseCarousel() {
  // --- Element Selection ---
  const carousel = document.getElementById('houseCarousel');
  const filterButtons = document.querySelectorAll('.featured-house__nav__filters button');
  const scroller = document.querySelector('.featured-house__carousel-wrapper');
  const [btnPrev, btnNext] = document.querySelectorAll('.featured-house__nav__pagination .btn-round');

  let allData = [];
  let isDown = false, startX = 0, scrollLeft = 0;
  let activeFilter = '';

  const syncButtons = () => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    
    const canScrollPrev = scroller.scrollLeft > 1;
    const canScrollNext = scroller.scrollLeft < maxScroll - 1;

    btnPrev.disabled = !canScrollPrev;
    btnPrev.classList.toggle('btn--green', canScrollPrev);
    btnPrev.classList.toggle('btn--transparent', !canScrollPrev);

    btnNext.disabled = !canScrollNext;
    btnNext.classList.toggle('btn--green', canScrollNext);
    btnNext.classList.toggle('btn--transparent', !canScrollNext);
  };

  const renderHouses = (list) => {
    carousel.innerHTML = list.map(createHouseCardHTML).join('');
    // Use requestAnimationFrame to ensure the DOM has updated before syncing.
    requestAnimationFrame(syncButtons);
  };

  const setupFiltering = () => {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.textContent.trim().toLowerCase();
        
        // Deactivate filter if the active one is clicked again.
        activeFilter = (activeFilter === type) ? '' : type;

        filterButtons.forEach(b => {
          const isActive = b.textContent.trim().toLowerCase() === activeFilter;
          b.classList.toggle('btn--light-green', isActive);
          b.classList.toggle('btn--light-green--borderless', isActive);
          b.classList.toggle('btn--transparent', !isActive);
        });

        const listToRender = activeFilter ? allData.filter(h => h.type === activeFilter) : allData;
        renderHouses(listToRender);
      });
    });
  };

  const setupControls = () => {
    const getStepSize = () => {
      const card = carousel.querySelector(".house-card");
      if (!card) return scroller.clientWidth;
      const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
      return card.offsetWidth + gap;
    };
    const scrollStep = (dir) => scroller.scrollBy({ left: dir * getStepSize(), behavior: 'smooth' });
    btnPrev.addEventListener('click', () => scrollStep(-1));
    btnNext.addEventListener('click', () => scrollStep(1));

    // Drag-to-scroll
    scroller.addEventListener('mousedown', e => {
      isDown = true;
      scroller.classList.add('dragging');
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
      document.body.style.userSelect = 'none'; 
    });

    const stopDragging = () => {
      isDown = false;
      scroller.classList.remove('dragging');
      document.body.style.userSelect = ''; 
    };

    scroller.addEventListener('mouseup', stopDragging);
    scroller.addEventListener('mouseleave', stopDragging);

    scroller.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault(); 
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 1.5;
      scroller.scrollLeft = scrollLeft - walk;
    });

    // Sync buttons on scroll and resize
    scroller.addEventListener('scroll', syncButtons);
    window.addEventListener('resize', syncButtons);
  };

  const initialize = async () => {
    try {
      const res = await fetch('data/featured.json');
      if (!res.ok) throw new Error('Failed to load house data.');
      allData = await res.json();
      renderHouses(allData);
      setupFiltering();
      setupControls();
    } catch (err) {
      console.error(err);
      carousel.innerHTML = '<p class="error">Could not load featured houses.</p>';
    }
  };

  initialize();
}
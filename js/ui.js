const slides = document.querySelectorAll('.testimonials-slider__slide');
const dotsContainer = document.querySelector('.testimonials-slider__dots');
let currentSlide = 1;

const updateSlides = currentSlide => {
  const dots = document.querySelectorAll('.testimonials-slider__dots__dot');
  dots.forEach((dot, i) => {
    if (i === currentSlide) dot.style.background = '#575757ff';
    else dot.style.background = '#b9b9b9';
  });
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100 - currentSlide * 100}%)`;
  });
};

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${i * 100}%)`;

  dotsContainer.insertAdjacentHTML(
    'beforeend',
    `<button class="testimonials-slider__dots__dot" data-slide="${i}"></button>`
  );

  slide.addEventListener('click', () => {
    currentSlide = i;
    updateSlides(currentSlide);
  });
});

dotsContainer.addEventListener('click', function (e) {
  const dot = e.target.closest('.testimonials-slider__dots__dot');
  if (!dot) return;

  const slideIndex = +dot.dataset.slide;
  currentSlide = slideIndex;

  updateSlides(currentSlide);
});

updateSlides(1);

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("houseCarousel");
  const btnPrev = document.querySelector(".featured-house__nav__pagination .btn-round:first-child");
  const btnNext = document.querySelector(".featured-house__nav__pagination .btn-round:last-child");
  const filterButtons = document.querySelectorAll(".featured-house__nav__filters button");

  let currentIndex = 0;
  const cardsPerView = 2;
  let allData = [];
  let currentData = [];

  function updateButtons() {
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex >= Math.max(0, currentData.length - cardsPerView);
  }

function updateCarousel() {
  const cards = carousel.querySelectorAll(".house-card");
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth + 16; // 16 = gap
  const maxIndex = Math.max(0, cards.length - cardsPerView);

  // Clamp currentIndex
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  const offset = -(currentIndex * cardWidth);
  carousel.style.transform = `translateX(${offset}px)`;
  carousel.style.transition = "transform 0.3s ease";

  // Disable buttons if needed
  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === maxIndex;
}

  function renderHouses(list) {
    currentData = list;
    currentIndex = 0;
    carousel.innerHTML = "";

    list.forEach(house => {
      const card = document.createElement("div");
      card.className = "house-card";
      card.dataset.type = house.type;
      card.innerHTML = `
        <div class="house-card__image">
          <img alt="" src="${house.image}" />
          <div class="label label--${house.label.toLowerCase().replace(" ", "-")}">
            <svg>
              <use href="assets/icons/icons.svg#${
                house.label.includes("deal")
                  ? "icon-wallet"
                  : house.label.includes("Popular")
                  ? "icon-popular"
                  : "icon-house"
              }"></use>
            </svg>
            ${house.label === 'popular' ? 'Popular' : `${house.label === 'new' ? 'New house' : 'Best deals'}`}
          </div>
        </div>
        <div class="house-card__legend">
          <h3 class="house-card__name">${house.name}</h3>
          <p class="house-card__price">$${house.price.toLocaleString("es-AR")}</p>
        </div>
        <div class="house-card__user">
          <div class="house-card__user-icon">
            <img alt="" src="${house.avatar}" />
          </div>
          <div class="house-card__user-text">
            <p class="house-card__username">${house.user}</p>
            <p class="house-card__location">${house.location}</p>
          </div>
        </div>
      `;
      carousel.appendChild(card);
    });

    updateCarousel();
  }

  // Pagination
    btnNext.addEventListener("click", () => {
      const maxIndex = Math.max(0, currentData.length - cardsPerView);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    btnPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

  (async function init() {
    try {
      const res = await fetch("data/featured.json");
      if (!res.ok) throw new Error("Error cargando featured.json");
      allData = await res.json();
      let activeFilter = '';

      renderHouses(allData);

      // Filtering
      filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.textContent.trim().toLowerCase();

          // If the same active button is clicked again, reset the filter
          if (activeFilter === type) {
            activeFilter = ''; // Clear the active filter
            // Reset all buttons to their default style
            filterButtons.forEach(b => {
              b.classList.remove("btn--light-green", "btn--light-green--borderless");
              b.classList.add("btn--transparent");
            });
            renderHouses(allData); // Show all houses again
            return; // Exit the function
          }

          // --- Set the new active filter and update styles ---
          activeFilter = type;
          // First, reset all buttons
          filterButtons.forEach(b => {
            b.classList.remove("btn--light-green", "btn--light-green--borderless");
            b.classList.add("btn--transparent");
          });
          // Then, apply the active style to the clicked button
          btn.classList.remove("btn--transparent");
          btn.classList.add("btn--light-green", "btn--light-green--borderless");

          // --- Filter and render the data ---
          const filteredList = allData.filter(h => h.type === type);
          renderHouses(filteredList);
        });
      });


    } catch (err) {
      console.error(err);
    }
  })();
});

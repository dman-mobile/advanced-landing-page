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

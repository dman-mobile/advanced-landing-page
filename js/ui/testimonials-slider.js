export default function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonials-slider__slide');
  const dotsContainer = document.querySelector('.testimonials-slider__dots');

  if (!slides.length || !dotsContainer) {
    return;
  }

  let currentSlide = 1;

  /**
   * Updates the slides and dots to reflect the current active slide.
   * @param {number} activeSlide - The index of the slide to display.
   */
  const updateSlides = activeSlide => {
    const dots = document.querySelectorAll('.testimonials-slider__dots__dot');
    
    dots.forEach((dot, i) => {
      dot.style.background = i === activeSlide ? '#575757ff' : '#b9b9b9';
    });

    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - activeSlide) * 100}%)`;
    });
  };

  const setupSlider = () => {
    slides.forEach((slide, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="testimonials-slider__dots__dot" data-slide="${i}"></button>`
      );

      slide.addEventListener('click', () => {
        currentSlide = i;
        updateSlides(currentSlide);
      });
    });
  };

  dotsContainer.addEventListener('click', function (e) {
    const dot = e.target.closest('.testimonials-slider__dots__dot');
    if (!dot) return;

    currentSlide = +dot.dataset.slide;
    updateSlides(currentSlide);
  });

  setupSlider();
  updateSlides(currentSlide);
}
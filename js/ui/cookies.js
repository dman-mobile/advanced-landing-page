const closeBtn = document.getElementById('close-cookies-banner');
const cookiesBanner = document.querySelector('.cookies-banner');

export default function initCookieBanner() {
  if (localStorage.getItem('cookies-accepted') === 'true') {
    cookiesBanner.remove();
    return;
  }

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('cookies-accepted', 'true');
    cookiesBanner.remove();
  });
}
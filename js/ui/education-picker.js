export default function initEducationPicker() {
  const dropdown = document.querySelector(".dropdown--field");
  const select = dropdown.querySelector(".dropdown--field__select");
  const content = dropdown.querySelector(".dropdown--field__content");
  const options = dropdown.querySelectorAll(".dropdown--field__option");
  const selectedSpan = select.querySelector("span:first-child");
  select.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });
  
  options.forEach(option => {
    option.addEventListener("click", () => {
      selectedSpan.textContent = option.textContent;
      dropdown.classList.remove("open");
    });
  });
  
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
}
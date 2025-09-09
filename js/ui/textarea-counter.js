const textarea = document.getElementById('message');
const charCountSpan = document.getElementById('charCount');
const maxLength = textarea.getAttribute('maxlength');

export default function initTextareaMessage() {
  textarea.addEventListener('input', () => {
    charCountSpan.textContent = textarea.value.length;
  });
}
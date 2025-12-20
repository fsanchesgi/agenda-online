document.addEventListener("DOMContentLoaded", () => {
  // Formulário de contato
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    form.reset();
  });

  // Carrossel funcionalidades
  const track = document.querySelector('.carousel-track');
  const items = Array.from(track.children);
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
  });

  // Auto slide a cada 5s
  setInterval(() => {
    nextButton.click();
  }, 5000);
});

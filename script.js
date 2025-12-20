document.addEventListener("DOMContentLoaded", () => {
  // Formulário de contato
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    form.reset();
  });

  // Carrossel
  const track = document.querySelector('.carousel-track');
  const items = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  let currentIndex = 0;

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth + 30; // item + margin
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
    updateCarousel();
  });

  // Auto slide
  setInterval(() => {
    nextBtn.click();
  }, 5000);

  updateCarousel(); // inicializa
});

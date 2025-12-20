document.addEventListener("DOMContentLoaded", () => {
  // Formulário de contato
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    form.reset();
  });

  /* Carrossel Funcionalidades (3D, cards menores nas laterais) */
.carousel {
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  perspective: 1000px; /* perspectiva 3D */
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform-style: preserve-3d;
}

.carousel-item {
  min-width: 300px;
  margin: 0 10px;
  background-color: #1e1e1e;
  border-radius: 15px;
  text-align: center;
  padding: 20px;
  flex-shrink: 0;
  transition: transform 0.5s, opacity 0.5s;
  opacity: 0.5;
  transform: scale(0.8) rotateY(15deg);
}

.carousel-item.active {
  opacity: 1;
  transform: scale(1) rotateY(0deg);
}

.carousel-item.prev,
.carousel-item.next {
  opacity: 0.7;
  transform: scale(0.9) rotateY(-15deg);
}

.carousel-item img {
  width: 100px;
  margin-bottom: 15px;
}

.carousel-item h3 {
  color: #39FF14;
  margin-bottom: 10px;
}

.carousel-item p {
  color: #cfcfcf;
  font-size: 0.95rem;
}

/* Botões do carrossel */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(57,255,20,0.7);
  border: none;
  font-size: 1.8rem;
  padding: 8px 12px;
  cursor: pointer;
  color: #000;
  border-radius: 50%;
  z-index: 10;
}

.carousel-btn.prev { left: 5px; }
.carousel-btn.next { right: 5px; }


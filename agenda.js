document.addEventListener("DOMContentLoaded", () => {
  const states = {
    "SP": ["São Paulo", "Campinas"],
    "RJ": ["Rio de Janeiro", "Niterói"]
  };

  const regions = {
    "São Paulo": ["Zona Sul", "Zona Norte"],
    "Campinas": ["Centro", "Barão Geraldo"],
    "Rio de Janeiro": ["Copacabana", "Ipanema"],
    "Niterói": ["Centro", "Itaipu"]
  };

  const establishments = {
    "Zona Sul": ["Barbearia Lux", "Estética Bela"],
    "Zona Norte": ["Barbearia Top", "Estética Glam"],
    "Centro": ["Clínica Central"],
    "Barão Geraldo": ["Spa BG"],
    "Copacabana": ["Barbearia Praia"],
    "Ipanema": ["Estética Sol"]
  };

  const professionals = {
    "Barbearia Lux": ["João", "Carlos"],
    "Estética Bela": ["Mariana"],
    "Barbearia Top": ["Lucas"],
    "Estética Glam": ["Fernanda"],
    "Clínica Central": ["Ana"],
    "Spa BG": ["Paula"],
    "Barbearia Praia": ["Rafael"],
    "Estética Sol": ["Camila"]
  };

  const agendas = {
    "João": ["10:00", "11:00", "14:00", "15:30"],
    "Carlos": ["09:00", "12:00", "16:00"],
    "Mariana": ["10:30", "13:00", "15:00"],
    "Lucas": ["09:30", "11:30", "14:30"],
    "Fernanda": ["10:00", "12:30", "16:00"],
    "Ana": ["09:00", "11:00", "13:30", "15:00"],
    "Paula": ["10:00", "12:00", "14:00"],
    "Rafael": ["09:30", "11:00", "13:00", "15:30"],
    "Camila": ["10:00", "12:00", "14:00"]
  };

  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
  const regionSelect = document.getElementById("region");
  const establishmentSelect = document.getElementById("establishment");
  const professionalSelect = document.getElementById("professional");
  const professionalInfo = document.getElementById("professional-info");

  // Popula estados
  for (let state in states) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  }

  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
    regionSelect.innerHTML = '<option value="">Selecione a região</option>';
    establishmentSelect.innerHTML = '<option value="">Selecione o estabelecimento</option>';
    professionalSelect.innerHTML = '<option value="">Selecione o profissional</option>';
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver a agenda.</p>";

    const selectedState = stateSelect.value;
    if (!selectedState) return;
    states[selectedState].forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  });

  citySelect.addEventListener("change", () => {
    regionSelect.innerHTML = '<option value="">Selecione a região</option>';
    establishmentSelect.innerHTML = '<option value="">Selecione o estabelecimento</option>';
    professionalSelect.innerHTML = '<option value="">Selecione o profissional</option>';
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver a agenda.</p>";

    const selectedCity = citySelect.value;
    if (!selectedCity) return;
    regions[selectedCity].forEach(region => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region;
      regionSelect.appendChild(option);
    });
  });

  regionSelect.addEventListener("change", () => {
    establishmentSelect.innerHTML = '<option value="">Selecione o estabelecimento</option>';
    professionalSelect.innerHTML = '<option value="">Selecione o profissional</option>';
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver a agenda.</p>";

    const selectedRegion = regionSelect.value;
    if (!selectedRegion) return;
    establishments[selectedRegion].forEach(est => {
      const option = document.createElement("option");
      option.value = est;
      option.textContent = est;
      establishmentSelect.appendChild(option);
    });
  });

  establishmentSelect.addEventListener("change", () => {
    professionalSelect.innerHTML = '<option value="">Selecione o profissional</option>';
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver a agenda.</p>";

    const selectedEst = establishmentSelect.value;
    if (!selectedEst) return;
    professionals[selectedEst].forEach(pro => {
      const option = document.createElement("option");
      option.value = pro;
      option.textContent = pro;
      professionalSelect.appendChild(option);
    });
  });

  professionalSelect.addEventListener("change", () => {
    const selectedPro = professionalSelect.value;
    if (!selectedPro) {
      professionalInfo.innerHTML = "<p>Selecione um profissional para ver a agenda.</p>";
      return;
    }

    const availableTimes = agendas[selectedPro] || [];
    if (availableTimes.length === 0) {
      professionalInfo.innerHTML = "<p>Sem horários disponíveis no momento.</p>";
      return;
    }

    professionalInfo.innerHTML = `
      <h4>${selectedPro} - Agenda</h4>
      <p>Horários disponíveis:</p>
      <div class="time-slots">
        ${availableTimes.map(time => `<button class="btn cta-btn time-btn">${time}</button>`).join('')}
      </div>
    `;

    // Adiciona clique nos horários
    document.querySelectorAll(".time-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        alert(`Você selecionou o horário ${btn.textContent} com ${selectedPro}.`);
      });
    });
  });
});

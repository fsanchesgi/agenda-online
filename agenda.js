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

  const serviceSelect = document.getElementById("service");
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
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver os detalhes.</p>";

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
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver os detalhes.</p>";

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
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver os detalhes.</p>";

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
    professionalInfo.innerHTML = "<p>Selecione um profissional para ver os detalhes.</p>";

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
      professionalInfo.innerHTML = "<p>Selecione um profissional para ver os detalhes.</p>";
      return;
    }
    professionalInfo.innerHTML = `
      <h4>${selectedPro}</h4>
      <p>Detalhes do profissional selecionado e disponibilidade serão exibidos aqui.</p>
    `;
  });
});

const supabaseUrl = "SUA_PROJECT_URL";
const supabaseKey = "SUA_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const profissionalSelect = document.getElementById('profissional');
const servicoSelect = document.getElementById('servico');
const horarioSelect = document.getElementById('horario');
const dataInput = document.getElementById('data');

async function carregarProfissionais() {
  const { data } = await supabase.from('profissionais').select('*');
  data.forEach(p => {
    profissionalSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
  });
}

async function carregarServicos() {
  const { data } = await supabase.from('servicos').select('*');
  data.forEach(s => {
    servicoSelect.innerHTML += `<option value="${s.id}" data-duracao="${s.duracao_minutos}">
      ${s.nome}
    </option>`;
  });
}

async function carregarHorarios() {
  horarioSelect.innerHTML = '';

  const profissionalId = profissionalSelect.value;
  const data = dataInput.value;
  const duracao = servicoSelect.selectedOptions[0].dataset.duracao;

  if (!profissionalId || !data) return;

  const { data: horarios } = await supabase.rpc('horarios_disponiveis', {
    p_profissional_id: profissionalId,
    p_data: data,
    p_duracao_minutos: parseInt(duracao)
  });

  horarios.forEach(h => {
    horarioSelect.innerHTML += `<option value="${h.horario}">${h.horario}</option>`;
  });
}

async function agendar() {
  const profissionalId = profissionalSelect.value;
  const servicoId = servicoSelect.value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  const dataHora = `${data} ${horario}`;

  const { error } = await supabase.from('agendamentos').insert([
    {
      profissional_id: profissionalId,
      servico_id: servicoId,
      cliente_nome: "Cliente Teste",
      data_hora: dataHora
    }
  ]);

  if (error) {
    alert(error.message);
  } else {
    alert("Agendamento confirmado!");
    carregarHorarios();
  }
}

profissionalSelect.addEventListener('change', carregarHorarios);
servicoSelect.addEventListener('change', carregarHorarios);
dataInput.addEventListener('change', carregarHorarios);

carregarProfissionais();
carregarServicos();

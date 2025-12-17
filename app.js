const SUPABASE_URL = https://uqwbduinwugaqexsvkxc.supabase.co;
const SUPABASE_ANON_KEY = https://uqwbduinwugaqexsvkxc.supabase.co;

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// 🎯 ELEMENTOS
const profissionalSelect = document.getElementById('profissional');
const servicoSelect = document.getElementById('servico');
const horarioSelect = document.getElementById('horario');
const dataInput = document.getElementById('data');

// 📥 PROFISSIONAIS
async function carregarProfissionais() {
  const { data, error } = await supabase
    .from('profissionais')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  profissionalSelect.innerHTML = '<option value="">Selecione</option>';
  data.forEach(p => {
    profissionalSelect.innerHTML +=
      `<option value="${p.id}">${p.nome}</option>`;
  });
}

// 📥 SERVIÇOS
async function carregarServicos() {
  const { data, error } = await supabase
    .from('servicos')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }

  servicoSelect.innerHTML = '<option value="">Selecione</option>';
  data.forEach(s => {
    servicoSelect.innerHTML +=
      `<option value="${s.id}" data-duracao="${s.duracao_minutos}">
        ${s.nome}
      </option>`;
  });
}

// ⏰ HORÁRIOS
async function carregarHorarios() {
  horarioSelect.innerHTML = '<option value="">Selecione</option>';

  const profissionalId = profissionalSelect.value;
  const data = dataInput.value;
  const servico = servicoSelect.selectedOptions[0];
  if (!profissionalId || !data || !servico) return;

  const duracao = servico.dataset.duracao;

  const { data: horarios, error } = await supabase.rpc(
    'horarios_disponiveis',
    {
      p_profissional_id: profissionalId,
      p_data: data,
      p_duracao_minutos: parseInt(duracao)
    }
  );

  if (error) {
    console.error(error);
    return;
  }

  horarios.forEach(h => {
    horarioSelect.innerHTML +=
      `<option value="${h.horario}">${h.horario}</option>`;
  });
}

// 📅 AGENDAR
async function agendar() {
  const profissionalId = profissionalSelect.value;
  const servicoId = servicoSelect.value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  if (!profissionalId || !servicoId || !data || !horario) {
    alert('Preencha todos os campos');
    return;
  }

  const dataHora = `${data} ${horario}`;

  const { error } = await supabase
    .from('agendamentos')
    .insert([{
      profissional_id: profissionalId,
      servico_id: servicoId,
      cliente_nome: 'Cliente Teste',
      data_hora: dataHora
    }]);

  if (error) {
    alert(error.message);
  } else {
    alert('Agendamento confirmado!');
    carregarHorarios();
  }
}

// 🔁 EVENTOS
profissionalSelect.addEventListener('change', carregarHorarios);
servicoSelect.addEventListener('change', carregarHorarios);
dataInput.addEventListener('change', carregarHorarios);

// 🚀 INIT
carregarProfissionais();
carregarServicos();

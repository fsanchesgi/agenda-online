const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const profissionalSelect = document.getElementById("profissional");
const servicoSelect = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horarioSelect = document.getElementById("horario");

async function carregarProfissionais() {
  const { data } = await supabaseClient.from("profissionais").select("*");
  profissionalSelect.innerHTML = '<option value="">Selecione</option>';
  data.forEach(p => {
    profissionalSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
  });
}

async function carregarServicos() {
  const { data } = await supabaseClient.from("servicos").select("*");
  servicoSelect.innerHTML = '<option value="">Selecione</option>';
  data.forEach(s => {
    servicoSelect.innerHTML +=
      `<option value="${s.id}" data-duracao="${s.duracao_minutos}">${s.nome}</option>`;
  });
}

async function carregarHorarios() {
  horarioSelect.innerHTML = '<option value="">Selecione</option>';

  const profissionalId = profissionalSelect.value;
  const data = dataInput.value;
  const servico = servicoSelect.selectedOptions[0];

  if (!profissionalId || !data || !servico) return;

  const duracao = servico.dataset.duracao;

  const { data: horarios } = await supabaseClient.rpc(
    "horarios_disponiveis",
    {
      p_profissional_id: profissionalId,
      p_data: data,
      p_duracao_minutos: parseInt(duracao)
    }
  );

  horarios.forEach(h => {
    horarioSelect.innerHTML += `<option value="${h.horario}">${h.horario}</option>`;
  });
}

async function agendar() {
  const { error } = await supabaseClient.from("agendamentos").insert([{
    profissional_id: profissionalSelect.value,
    servico_id: servicoSelect.value,
    cliente_nome: "Cliente Online",
    data_hora: `${dataInput.value} ${horarioSelect.value}`
  }]);

  if (error) alert(error.message);
  else alert("Agendamento confirmado!");
}

profissionalSelect.onchange = carregarHorarios;
servicoSelect.onchange = carregarHorarios;
dataInput.onchange = carregarHorarios;

carregarProfissionais();
carregarServicos();

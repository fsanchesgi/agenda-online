const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const clienteNomeInput = document.getElementById("cliente_nome");
const profissionalSelect = document.getElementById("profissional");
const servicoSelect = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horarioSelect = document.getElementById("horario");

/* ===========================
   PROFISSIONAIS
=========================== */
async function carregarProfissionais() {
  const { data, error } = await supabaseClient
    .from("profissionais")
    .select("id, nome")
    .eq("ativo", true);

  if (error) {
    console.error(error);
    return;
  }

  profissionalSelect.innerHTML =
    '<option value="">Selecione</option>';

  data.forEach(p => {
    profissionalSelect.innerHTML +=
      `<option value="${p.id}">${p.nome}</option>`;
  });
}

/* ===========================
   SERVIÇOS
=========================== */
async function carregarServicos() {
  const { data, error } = await supabaseClient
    .from("servicos")
    .select("id, nome, duracao_minutos");

  if (error) {
    console.error(error);
    return;
  }

  servicoSelect.innerHTML =
    '<option value="">Selecione</option>';

  data.forEach(s => {
    servicoSelect.innerHTML +=
      `<option value="${s.id}" data-duracao="${s.duracao_minutos}">
        ${s.nome}
      </option>`;
  });
}

/* ===========================
   HORÁRIOS
=========================== */
async function carregarHorarios() {
  horarioSelect.innerHTML =
    '<option value="">Selecione</option>';

  const profissionalId = profissionalSelect.value;
  const dataSelecionada = dataInput.value;
  const servicoOption = servicoSelect.selectedOptions[0];

  if (!profissionalId || !dataSelecionada || !servicoOption) {
    return;
  }

  const duracao = parseInt(servicoOption.dataset.duracao);

  const { data, error } = await supabaseClient.rpc(
    "horarios_disponiveis",
    {
      p_profissional_id: profissionalId,
      p_data: dataSelecionada,
      p_duracao_minutos: duracao
    }
  );

  if (error || !data) {
    console.error(error);
    return;
  }

  data.forEach(item => {
    horarioSelect.innerHTML +=
      `<option value="${item.horario}">
        ${item.horario}
      </option>`;
  });
}

/* ===========================
   AGENDAR
=========================== */
async function agendar() {
  const clienteNome = clienteNomeInput.value.trim();

  if (!clienteNome) {
    alert("Informe seu nome");
    return;
  }

  const dataHora =
    `${dataInput.value} ${horarioSelect.value}`;

  const { error } = await supabaseClient
    .from("agendamentos")
    .insert([{
      profissional_id: profissionalSelect.value,
      servico_id: servicoSelect.value,
      cliente_nome: clienteNome,
      data_hora: dataHora,
      status: "agendado"
    }]);

  if (error) {
    alert(error.message);
  } else {
    alert("Agendamento confirmado!");
    clienteNomeInput.value = "";
    carregarHorarios();
  }
}

/* ===========================
   EVENTOS
=========================== */
profissionalSelect.addEventListener("change", carregarHorarios);
servicoSelect.addEventListener("change", carregarHorarios);
dataInput.addEventListener("change", carregarHorarios);

/* ===========================
   INIT
=========================== */
carregarProfissionais();
carregarServicos();

const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LOGIN
async function login(){
  const email = document.getElementById("email")?.value;
  const senha = document.getElementById("senha")?.value;
  if(!email||!senha){ alert("Preencha email e senha"); return; }
  const { data, error } = await supabase.auth.signInWithPassword({email, password:senha});
  if(error){ alert(error.message); return; }
  window.location.href="/dashboard.html";
}

// LOGOUT
async function logout(){ await supabase.auth.signOut(); window.location.href="/login.html"; }

// CHECAR SESSÃO DASHBOARD
if(window.location.pathname.includes("dashboard.html")){
  supabase.auth.getSession().then(({data})=>{
    if(!data.session) window.location.href="/login.html";
    else carregarAgendamentos();
  });
}

// AGENDAMENTO
const clienteNomeInput = document.getElementById("cliente_nome");
const profissionalSelect = document.getElementById("profissional");
const servicoSelect = document.getElementById("servico");
const dataInput = document.getElementById("data");
const horarioSelect = document.getElementById("horario");

async function carregarProfissionais(){
  if(!profissionalSelect) return;
  const { data, error } = await supabase.from("profissionais").select("id,nome").eq("ativo",true);
  if(error){ console.error(error); return; }
  profissionalSelect.innerHTML='<option value="">Selecione</option>';
  data.forEach(p=>profissionalSelect.innerHTML+=`<option value="${p.id}">${p.nome}</option>`);
}

async function carregarServicos(){
  if(!servicoSelect) return;
  const { data, error } = await supabase.from("servicos").select("id,nome,duracao_minutos");
  if(error){ console.error(error); return; }
  servicoSelect.innerHTML='<option value="">Selecione</option>';
  data.forEach(s=>servicoSelect.innerHTML+=`<option value="${s.id}" data-duracao="${s.duracao_minutos}">${s.nome}</option>`);
}

async function carregarHorarios(){
  if(!horarioSelect||!profissionalSelect||!dataInput||!servicoSelect) return;
  horarioSelect.innerHTML='<option value="">Selecione</option>';
  if(!profissionalSelect.value||!servicoSelect.value||!dataInput.value) return;
  const duracao=parseInt(servicoSelect.selectedOptions[0].dataset.duracao);
  const { data, error } = await supabase.rpc("horarios_disponiveis",{p_profissional_id:profissionalSelect.value,p_data:dataInput.value,p_duracao_minutos:duracao});
  if(error){ console.error(error); return; }
  data.forEach(h=>horarioSelect.innerHTML+=`<option value="${h.horario}">${h.horario}</option>`);
}

async function agendar(){
  if(!clienteNomeInput||!profissionalSelect||!servicoSelect||!dataInput||!horarioSelect) return;
  const clienteNome=clienteNomeInput.value.trim();
  if(!clienteNome){ alert("Informe seu nome"); return; }
  const dataHora=`${dataInput.value} ${horarioSelect.value}`;
  const { error } = await supabase.from("agendamentos").insert([{profissional_id:profissionalSelect.value,servico_id:servicoSelect.value,cliente_nome:clienteNome,data_hora:dataHora,status:"agendado"}]);
  if(error) alert(error.message); else { alert("Agendamento confirmado!"); clienteNomeInput.value=""; carregarHorarios(); }
}

// Preenchimento selects
carregarProfissionais();
carregarServicos();
if(profissionalSelect) profissionalSelect.addEventListener("change",carregarHorarios);
if(servicoSelect) servicoSelect.addEventListener("change",carregarHorarios);
if(dataInput) dataInput.addEventListener("change",carregarHorarios);

// CHECKOUT MERCADO PAGO
async function gerarCheckout(planoNome, preco, perfilId){
  try{
    const res=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({planoNome,preco,perfilId})});
    const data=await res.json();
    if(data.init_point) window.location.href=data.init_point;
    else{ console.error(data); alert("Erro ao gerar checkout"); }
  }catch(e){ console.error(e); alert("Erro no pagamento"); }
}

// DASHBOARD: carregar agendamentos
async function carregarAgendamentos(){
  const { data, error } = await supabase.from("agend

const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function carregarProfissionais(){
  const {data,error} = await supabase.from("profissionais").select("*").eq("ativo",true);
  if(error){ console.error(error); return; }
  const select = document.getElementById("profissional");
  select.innerHTML="";
  data.forEach(p=>{
    select.innerHTML += `<option value="${p.id}">${p.nome} - ${p.especialidade}</option>`;
  });
}

async function carregarServicos(){
  const {data,error} = await supabase.from("services").select("*");
  if(error){ console.error(error); return; }
  const select = document.getElementById("servico");
  select.innerHTML="";
  data.forEach(s=>{
    select.innerHTML += `<option value="${s.id}">${s.nome}</option>`;
  });
}

document.getElementById("formAgendamento")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const agendamento={
    profissional_id:document.getElementById("profissional").value,
    servico_id:document.getElementById("servico").value,
    data_hora:document.getElementById("data").value+"T09:00:00",
    cliente_nome:document.getElementById("cliente_nome").value,
    status:"agendado"
  };
  const {error}=await supabase.from("agendamentos").insert([agendamento]);
  if(error){ alert(error.message); return; }
  alert("Agendamento realizado!");
});

document.getElementById("formLogin")?.addEventListener("submit",async e=>{
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if(error){ alert(error.message); return; }
  window.location.href="dashboard.html";
});

async function carregarAgendamentos(){
  const {data,error}=await supabase.from("agendamentos").select("*").order("data_hora",{ascending:true});
  if(error){ console.error(error); return; }
  const container=document.getElementById("agendamentos");
  container.innerHTML="";
  data.forEach(a=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`<h3>${a.cliente_nome}</h3><p>${a.data_hora}</p><p>Status: ${a.status}</p>`;
    container.appendChild(card);
  });
}

document.getElementById("logoutBtn")?.addEventListener("click",async()=>{
  await supabase.auth.signOut();
  window.location.href="login.html";
});

async function gerarCheckout(plano, preco){
  const user = await supabase.auth.getUser();
  const r=await fetch("/api/checkout.js",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({planoNome:plano, preco, perfilId:user.data.user.id})
  });
  const data = await r.json();
  window.location.href = data.init_point;
}

// Inicialização
carregarProfissionais();
carregarServicos();
if(window.location.pathname.includes("dashboard.html")){
  supabase.auth.getSession().then(({data})=>{
    if(!data.session) window.location.href="login.html";
    else carregarAgendamentos();
  });
}

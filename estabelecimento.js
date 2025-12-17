<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Estabelecimento | TimelyPro</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Agende serviços no TimelyPro" />
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>

<h1 id="nome-estabelecimento"></h1>
<p id="descricao-estabelecimento"></p>
<p id="localizacao-estabelecimento"></p>

<h2>Profissionais</h2>
<ul id="lista-profissionais"></ul>

<h2>Agende seu horário</h2>
<select id="profissional"></select>
<input id="nome" placeholder="Seu nome" />
<input id="whatsapp" placeholder="WhatsApp" />
<input type="datetime-local" id="datahora" />
<button onclick="agendar()">Agendar</button>

<script>
const supabaseClient = supabase.createClient(
  "https://uqwbduinwugaqexsvkxc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE"
);

// Captura o slug da URL
const slug = new URLSearchParams(window.location.search).get("slug");

let estabelecimentoId;

async function carregarEstabelecimento() {
  const { data } = await supabaseClient
    .from("estabelecimentos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    alert("Estabelecimento não encontrado!");
    return;
  }

  estabelecimentoId = data.id;
  document.getElementById("nome-estabelecimento").textContent = data.nome;
  document.getElementById("descricao-estabelecimento").textContent = data.descricao;
  document.getElementById("localizacao-estabelecimento").textContent = `${data.cidade} - ${data.estado}`;

  // Carregar profissionais
  const { data: profs } = await supabaseClient
    .from("profissionais")
    .select("*")
    .eq("estabelecimento_id", estabelecimentoId)
    .eq("ativo", true);

  const ul = document.getElementById("lista-profissionais");
  const select = document.getElementById("profissional");
  ul.innerHTML = "";
  select.innerHTML = "";

  profs.forEach(p => {
    ul.innerHTML += `<li>${p.nome} - ${p.especialidade || ''}</li>`;
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nome;
    select.appendChild(opt);
  });
}

async function agendar() {
  const profissional_id = document.getElementById("profissional").value;
  const cliente_nome = document.getElementById("nome").value;
  const cliente_whatsapp = document.getElementById("whatsapp").value;
  const data_hora = document.getElementById("datahora").value;

  // Bloqueio de conflito
  const { data: conflitos } = await supabaseClient
    .from("agendamentos")
    .select("*")
    .eq("profissional_id", profissional_id)
    .eq("data_hora", data_hora);

  if (conflitos.length > 0) {
    alert("Horário já reservado, escolha outro.")

const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function carregarAgenda() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const { data: profissional } = await supabaseClient
    .from('profissionais')
    .select('id, nome')
    .eq('user_id', user.id)
    .single();

  const { data: agendamentos } = await supabaseClient
    .from('agendamentos')
    .select(`
      data_hora,
      cliente_nome,
      servicos ( nome )
    `)
    .eq('profissional_id', profissional.id)
    .order('data_hora');

  const ul = document.getElementById('agenda');
  ul.innerHTML = '';

  agendamentos.forEach(a => {
    ul.innerHTML += `
      <li>
        <strong>${new Date(a.data_hora).toLocaleString()}</strong><br>
        ${a.cliente_nome}
        <span class="badge">${a.servicos.nome}</span>
      </li>
    `;
  });
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "/login.html";
}

carregarAgenda();

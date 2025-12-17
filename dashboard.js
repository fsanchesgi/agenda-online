const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "SUA_ANON_KEY_AQUI";

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

  // pega o profissional vinculado ao user
  const { data: profissional } = await supabaseClient
    .from('profissionais')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data: agendamentos } = await supabaseClient
    .from('agendamentos')
    .select('*')
    .eq('profissional_id', profissional.id)
    .order('data_hora');

  const ul = document.getElementById('agenda');
  ul.innerHTML = '';

  agendamentos.forEach(a => {
    ul.innerHTML += `
      <li>
        ${a.data_hora} — ${a.cliente_nome}
      </li>
    `;
  });
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "/login.html";
}

carregarAgenda();

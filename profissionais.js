const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function criarProfissional(estabelecimentoId) {
  const nome = document.getElementById("nome-prof").value;
  const especialidade = document.getElementById("especialidade").value;

  const session = await supabaseClient.auth.getSession();
  const userId = session.data.session.user.id;

  const { data: assinatura } = await supabaseClient
    .from("assinaturas")
    .select(`plans ( name )`)
    .eq("perfil_id", userId)
    .single();

  const plano = assinatura.plans.name;

  const { count } = await supabaseClient
    .from("profissionais")
    .select("*", { count: "exact", head: true })
    .eq("estabelecimento_id", estabelecimentoId);

  if (plano === "free" && count >= 1) {
    alert("Plano Free permite apenas 1 profissional.");
    return;
  }

  if (plano === "pro" && count >= 3) {
    alert("Plano Pro permite até 3 profissionais.");
    return;
  }

  const { error } = await supabaseClient
    .from("profissionais")
    .insert({
      estabelecimento_id: estabelecimentoId,
      nome,
      especialidade
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profissional cadastrado!");
  location.reload();
}

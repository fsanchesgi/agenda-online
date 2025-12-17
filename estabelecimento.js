const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function criarEstabelecimento() {
  const session = await supabaseClient.auth.getSession();
  const userId = session.data.session.user.id;

  const nome = document.getElementById("nome").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const descricao = document.getElementById("descricao").value;

  const { data: assinatura } = await supabaseClient
    .from("assinaturas")
    .select(`
      plans ( name )
    `)
    .eq("perfil_id", userId)
    .single();

  const plano = assinatura.plans.name;

  const { count } = await supabaseClient
    .from("estabelecimentos")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  if (plano === "free" && count >= 1) {
    alert("Plano Free permite apenas 1 estabelecimento.");
    return;
  }

  if (plano === "pro" && count >= 2) {
    alert("Plano Pro permite até 2 estabelecimentos.");
    return;
  }

  const { error } = await supabaseClient
    .from("estabelecimentos")
    .insert({
      owner_id: userId,
      nome,
      cidade,
      estado,
      descricao
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Estabelecimento criado com sucesso!");
  location.reload();
}

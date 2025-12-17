const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  if (!sessionData.session) return;

  const userId = sessionData.session.user.id;

  // 🔎 Verifica se já existe assinatura
  const { data: assinatura } = await supabaseClient
    .from("assinaturas")
    .select("id")
    .eq("perfil_id", userId)
    .maybeSingle();

  if (!assinatura) {
    // 🔎 Busca plano FREE
    const { data: planoFree } = await supabaseClient
      .from("plans")
      .select("id")
      .eq("name", "free")
      .single();

    // 🟢 Cria assinatura FREE
    await supabaseClient.from("assinaturas").insert({
      perfil_id: userId,
      plano_id: planoFree.id,
      status: "ativa",
      inicio: new Date().toISOString()
    });
  }

  window.location.href = "/dashboard.html";
}

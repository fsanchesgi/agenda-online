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

  const userId = sessionData.session.user.id;

  /* ================= PERFIL ================= */
  const { data: perfil } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!perfil) {
    await supabaseClient.from("profiles").insert({
      id: userId
    });
  }

  /* ================= ASSINATURA ================= */
  const { data: assinatura } = await supabaseClient
    .from("assinaturas")
    .select("id")
    .eq("perfil_id", userId)
    .maybeSingle();

  if (!assinatura) {
    const { data: planoFree } = await supabaseClient
      .from("plans")
      .select("id")
      .eq("name", "free")
      .single();

    await supabaseClient.from("assinaturas").insert({
      perfil_id: userId,
      plano_id: planoFree.id,
      status: "ativa",
      inicio: new Date().toISOString()
    });
  }

  window.location.href = "/dashboard.html";
}

/*************************************************
 * TimelyPro - app.js
 * Cliente Supabase + lógica global
 *************************************************/

// ================================
// SUPABASE CONFIG (NÃO ALTERAR)
// ================================
const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

// ================================
// CRIAÇÃO ÚNICA DO CLIENTE
// ================================
if (!window.supabase) {
  window.supabase = window.supabaseJs.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    }
  );
}

// Referência global
const supabase = window.supabase;

// ================================
// DEBUG (REMOVER SE QUISER)
// ================================
supabase.auth.onAuthStateChange((event, session) => {
  console.log("[Supabase]", event, session);
});

// ================================
// PROTEÇÃO GLOBAL DE DASHBOARD
// ================================
(async () => {
  const protectedPages = ["dashboard.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage)) {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = "login.html";
    }
  }
})();

// ================================
// LOGOUT (SE EXISTIR BOTÃO)
// ================================
window.logout = async function () {
  await supabase.auth.signOut();
  window.location.href = "login.html";
};

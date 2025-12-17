const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "SUA_ANON_KEY_AQUI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "/dashboard.html";
}

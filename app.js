const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LOGIN
if(document.getElementById("loginForm")){
  document.getElementById("loginForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({email,password});
    if(!error) window.location="dashboard.html";
    else alert("Login inválido");
  });
}

// LOGOUT
async function logout(){
  await supabase.auth.signOut();
  window.location="login.html";
}

// CHECKOUT
function checkout(plano){
  fetch("/api/checkout",{method:"POST",body:JSON.stringify({plano})});
}

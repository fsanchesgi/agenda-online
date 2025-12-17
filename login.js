<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Login | TimelyPro</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="icon" href="images/timelypro-favicon.png" />
  <link rel="stylesheet" href="style.css" />

  <!-- Supabase v2 -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>

<body class="auth-page">

  <header class="auth-header">
    <img src="images/timelypro-logo.png" class="logo logo-auth" />
  </header>

  <main class="auth-container">
    <h1>Acessar conta</h1>

    <form id="loginForm" class="auth-form">
      <input
        type="email"
        id="email"
        placeholder="Digite seu e-mail"
        required
      />

      <input
        type="password"
        id="password"
        placeholder="Digite sua senha"
        required
      />

      <button type="submit" class="btn-primary">
        Entrar
      </button>
    </form>

    <a href="index.html" class="link-back">
      ← Voltar para página inicial
    </a>
  </main>

  <script>
    // =========================
    // SUPABASE CLIENT
    // =========================
    const SUPABASE_URL = "https://uqwbduinwugaqexsvkxc.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2JkdWlud3VnYXFleHN2a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTk5MjMsImV4cCI6MjA4MTI5NTkyM30._GzXlkNAvqbevYjmi-crhvSKGQQfX3yjzTWT5PTvIxE";

    const supabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    // =========================
    // LOGIN
    // =========================
    document
      .getElementById("loginForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert("Erro ao fazer login: " + error.message);
          return;
        }

        // 🔥 LOGIN OK → REDIRECIONA
        window.location.href = "dashboard.html";
      });
  </script>

</body>
</html>

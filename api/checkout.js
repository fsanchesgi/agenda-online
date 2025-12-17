async function assinar(plano) {
  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "/login.html";
    return;
  }

  const response = await fetch("/api/criar-preferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plano,
      perfil_id: session.user.id
    })
  });

  const data = await response.json();
  window.location.href = data.url;
}

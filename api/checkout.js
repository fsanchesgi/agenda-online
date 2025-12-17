async function assinar(plano) {
  const response = await fetch("/api/criar-preferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plano })
  });

  const data = await response.json();
  window.location.href = data.url;
}

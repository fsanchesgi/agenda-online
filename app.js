async function carregarProfissionais() {
  const { data, error } = await supabase.from('profissionais').select('*');

  console.log('profissionais:', data, error);

  if (error) {
    alert(error.message);
    return;
  }

  data.forEach(p => {
    profissionalSelect.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
  });
}

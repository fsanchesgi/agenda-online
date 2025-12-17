export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { user_id, plano_nome, status } = req.body;
  // Chama RPC no Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey);
  await supabase.rpc("atualizar_plano_pagamento", { p_user_id: user_id, p_plano_nome: plano_nome, p_status: status });
  res.status(200).end();
}

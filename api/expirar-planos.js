import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  await supabase
    .from("assinaturas")
    .update({ status: "expirada" })
    .lt("fim", new Date().toISOString());

  res.status(200).json({ ok: true });
}

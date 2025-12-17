import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const paymentId = req.body.data?.id;
    if (!paymentId) return res.status(200).end();

    const payment = await mercadopago.payment.findById(paymentId);
    const status = payment.body.status;

    if (status !== "approved") {
      return res.status(200).end();
    }

    const { plano, perfil_id } = payment.body.metadata;

    // 🔎 Busca plano no Supabase
    const { data: planoDb } = await supabase
      .from("plans")
      .select("id")
      .eq("name", plano)
      .single();

    // 📆 Datas
    const inicio = new Date();
    const fim = new Date();
    fim.setMonth(fim.getMonth() + 1);

    // 🔄 Atualiza assinatura
    await supabase
      .from("assinaturas")
      .update({
        plano_id: planoDb.id,
        status: "ativa",
        inicio: inicio.toISOString(),
        fim: fim.toISOString()
      })
      .eq("perfil_id", perfil_id);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook erro:", error);
    res.status(500).json({ error: "Webhook error" });
  }
}

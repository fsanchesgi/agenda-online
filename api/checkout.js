import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { planoNome, preco, perfilId } = req.body;

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Token não configurado" });
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: [
        {
          title: `Plano ${planoNome}`,
          quantity: 1,
          unit_price: preco,
          currency_id: "BRL"
        }
      ],
      back_urls: {
        success: `${req.headers.origin}/planos.html?success=true`,
        failure: `${req.headers.origin}/planos.html?success=false`
      },
      auto_return: "approved"
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}

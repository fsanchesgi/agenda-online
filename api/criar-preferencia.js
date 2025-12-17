import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  const { plano } = req.body;

  const valores = {
    pro: 39,
    premium: 79
  };

  const preference = {
    items: [
      {
        title: `Plano ${plano}`,
        quantity: 1,
        unit_price: valores[plano]
      }
    ],
    back_urls: {
      success: "https://seusite.vercel.app/dashboard.html",
      failure: "https://seusite.vercel.app/planos.html"
    },
    auto_return: "approved"
  };

  const response = await mercadopago.preferences.create(preference);
  res.json({ url: response.body.init_point });
}

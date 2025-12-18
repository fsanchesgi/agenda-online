import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';


const app = express();
app.use(express.json());


const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;


const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);


app.post('/api/create-checkout', async (req, res) => {
const { plano, valor } = req.body;
const preference = {
items: [{ title: `Plano ${plano}`, quantity: 1, unit_price: valor }],
back_urls: {
success: 'https://seusite.com/dashboard.html',
failure: 'https://seusite.com/planos.html'
},
notification_url: 'https://seusite.com/api/webhook'
};


const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
method: 'POST',
headers: {
Authorization: `Bearer ${MP_TOKEN}`,
'Content-Type': 'application/json'
},
body: JSON.stringify(preference)
});


const mpData = await mpRes.json();
res.json({ init_point: mpData.init_point });
});


app.post('/api/webhook', async (req, res) => {
const paymentId = req.body?.data?.id;
if (!paymentId) return res.sendStatus(200);


const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
headers: { Authorization: `Bearer ${MP_TOKEN}` }
});
const payment = await payRes.json();


if (payment.status === 'approved') {
await supabase.from('assinaturas').insert({
user_id: payment.external_reference,
plano: payment.description.includes('premium') ? 'premium' : 'pro',
status: 'ativa',
mp_payment_id: paymentId
});
}


res.sendStatus(200);
});


app.listen(3000, () => console.log('Server ON'));

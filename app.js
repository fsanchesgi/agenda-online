import fetch from "node-fetch";

export default async function handler(req,res){
  if(req.method!=="POST"){ res.status(405).end(); return; }
  const { planoNome, preco, perfilId } = req.body;
  const token="SEU_ACCESS_TOKEN_MERCADO_PAGO";
  try{
    const r=await fetch("https://api.mercadopago.com/checkout/preferences",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        items:[{title:planoNome,quantity:1,unit_price:preco}],
        back_urls:{success:"/planos.html",failure:"/planos.html",pending:"/planos.html"},
        auto_return:"approved"
      })
    });
    const data=await r.json();
    res.status(200).json(data);
  }catch(e){ res.status(500).json({error:e.message}); }
}

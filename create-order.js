// pages/api/create-order.js
import Razorpay from 'razorpay';

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const { amount, bookId, title } = req.body;
  if(!amount) return res.status(400).json({message:'Amount required'});

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try{
    const options = {
      amount: amount, // in paise
      currency: "INR",
      receipt: `rcpt_${bookId}_${Date.now()}`,
      payment_capture: 1
    };
    const order = await rzp.orders.create(options);
    return res.status(200).json({order});
  }catch(err){
    console.error(err);
    return res.status(500).json({message:'Razorpay order create failed', error:err.message});
  }
}

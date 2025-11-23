// pages/api/verify-payment.js
import crypto from 'crypto';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId } = req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const generated_signature = crypto.createHmac('sha256', key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if(generated_signature === razorpay_signature){
    // success: store payment record in Firestore (orders collection)
    try{
      await addDoc(collection(db,'orders'), {
        razorpay_order_id, razorpay_payment_id, bookId, createdAt: new Date()
      });
      // TODO: generate signed download link and email user. For demo we just respond ok
      return res.status(200).json({status:'ok'});
    }catch(err){
      console.error(err);
      return res.status(500).json({message:'db error'});
    }
  }else{
    return res.status(400).json({message:'Invalid signature'});
  }
}

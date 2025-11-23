// pages/book/[id].js
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import PDFPreview from '../../components/PDFPreview';
import axios from 'axios';

export default function BookPage({initialData}){
  const router = useRouter();
  const id = router.query.id;
  const book = initialData; // for simplicity we used serverless props pattern: later can fetch client-side too

  if(!book) return <div className="container">Loading...</div>;

  const buyNow = async ()=>{
    try{
      // create order on server (Next.js API route)
      const res = await axios.post('/api/create-order', {
        bookId: id,
        amount: Math.round((book.price || 0) * 100), // in paise
        title: book.title
      });
      const { order } = res.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '<RAZORPAY_KEY_ID>',
        amount: order.amount,
        currency: order.currency,
        name: 'eBook Hub',
        description: book.title,
        order_id: order.id,
        handler: async function (response){
          // verify payment on server
          await axios.post('/api/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookId: id
          });
          alert('Payment successful! Download link sent to your email (demo).');
        },
        prefill: { name: '', email: '' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }catch(e){
      console.error(e); alert('Error creating order');
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex',gap:20,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{flex:'0 0 320px'}}>
          {book.pdfUrl ? <PDFPreview pdfUrl={book.pdfUrl} width={320}/> : <img src={book.cover||'/placeholder.png'} style={{width:320}}/>}
        </div>
        <div style={{flex:1}}>
          <h2>{book.title}</h2>
          <div className="small">By {book.author}</div>
          <p>{book.description || 'No description available.'}</p>
          <div style={{marginTop:12}}>
            {book.price ? <button className="btn" onClick={buyNow}>Buy Now — ₹{book.price}</button> : <a className="btn" href={book.pdfUrl} download>Download Free</a>}
          </div>
        </div>
      </div>
    </div>
  )
}

// For simplicity: try fetching server-side data (fallback to client fetch if needed)
export async function getServerSideProps(context){
  const { id } = context.params;
  try{
    // This server-side environment can't use client firebase config by default.
    // So for now return null and let the client load. You can implement
    // a secure server-side Firestore fetch with service account for production.
    return { props: { initialData: null } }
  }catch(e){
    return { props: { initialData: null } }
  }
            }

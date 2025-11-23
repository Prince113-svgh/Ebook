// components/BookCard.js
import Link from 'next/link';

export default function BookCard({book}){
  return (
    <div className="card">
      <img src={book.cover || '/placeholder.png'} alt={book.title}/>
      <h3 style={{margin:'0'}}>{book.title}</h3>
      <div className="small">By {book.author || 'Unknown'}</div>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <Link href={`/book/${book.id}`}><a className="btn" style={{textDecoration:'none'}}>View</a></Link>
        {book.price ? <div className="small">₹{book.price}</div> : <div className="small">Free</div>}
      </div>
    </div>
  )
  }

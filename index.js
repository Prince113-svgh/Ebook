// pages/index.js
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

export default function Home(){
  const [books, setBooks] = useState([]);

  useEffect(()=>{
    // Fetch books from Firestore collection "books"
    async function load(){
      try{
        const q = query(collection(db, 'books'));
        const snaps = await getDocs(q);
        const arr = snaps.docs.map(d=>({id:d.id, ...d.data()}));
        setBooks(arr);
      }catch(e){
        console.error(e);
        // fallback demo
        setBooks([
          {id:'demo1',title:'Physics for JEE',author:'R. Singh',cover:'',price:0},
          {id:'demo2',title:'NEET Biology',author:'S. Kumar',cover:'',price:199}
        ]);
      }
    }
    load();
  },[]);

  return (
    <div className="container">
      <h2>Featured Books</h2>
      <div className="grid">
        {books.map(b=> <BookCard key={b.id} book={b} />)}
      </div>
    </div>
  )
}

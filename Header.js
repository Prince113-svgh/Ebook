// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { useEffect, useState } from 'react';

export default function Header(){
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(u=>{
      setUser(u);
    });
    return ()=>unsubscribe();
  },[]);

  return (
    <header className="header container">
      <div className="site-title">
        <img src="/logo192.png" alt="logo" style={{width:40,height:40}}/>
        <div>
          <h1>eBook Hub</h1>
          <div className="small">JEE · NEET · Classes · Competitive</div>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div className="search">
          <input placeholder="Search books, subjects or exams..." />
        </div>
        <Link href="/"><a className="small">Home</a></Link>
        {user ? (
          <>
            <button className="btn" onClick={()=>router.push('/admin')}>Admin</button>
            <button className="btn" onClick={()=>{ signOut(auth); router.push('/login'); }}>Logout</button>
          </>
        ) : (
          <Link href="/login"><a className="btn">Login</a></Link>
        )}
      </div>
    </header>
  )
    }

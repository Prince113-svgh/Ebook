// pages/admin/index.js
import { useEffect, useState } from 'react';
import { auth } from '../../firebase.config';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Admin(){
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(u=>{
      if(!u) router.push('/login');
      else setUser(u);
    });
    return ()=>unsub();
  },[]);

  if(!user) return <div className="container">Checking auth...</div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <div style={{display:'flex',gap:8}}>
        <Link href="/admin/upload"><a className="btn">Upload Book</a></Link>
      </div>
    </div>
  )
    }

// pages/login.js
import { useState } from 'react';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Login(){
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const router = useRouter();

  const login = async (e)=>{
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/');
    }catch(err){
      alert(err.message);
    }
  }

  const signup = async (e)=>{
    e.preventDefault();
    try{
      await createUserWithEmailAndPassword(auth, email, pass);
      router.push('/');
    }catch(err){ alert(err.message) }
  }

  return (
    <div className="container">
      <h2>Login / Register</h2>
      <form onSubmit={login} style={{maxWidth:420}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} type="password" />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Login</button>
          <button className="btn" onClick={signup} type="button">Sign up</button>
        </div>
      </form>
    </div>
  )
                                                                        }

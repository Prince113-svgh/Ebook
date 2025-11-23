// pages/admin/upload.js
import { useState } from 'react';
import { storage, db } from '../../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

export default function Upload(){
  const [title,setTitle]=useState('');
  const [author,setAuthor]=useState('');
  const [price,setPrice]=useState(0);
  const [pdfFile,setPdfFile]=useState(null);
  const [coverFile,setCoverFile]=useState(null);
  const [loading,setLoading]=useState(false);
  const router = useRouter();

  const upload = async (e)=>{
    e.preventDefault();
    if(!title || !pdfFile) return alert('Title and PDF required');
    setLoading(true);
    try{
      const pdfPath = `books/${uuidv4()}_${pdfFile.name}`;
      const pdfRef = ref(storage, pdfPath);
      const pdfSnap = await uploadBytesResumable(pdfRef, pdfFile);
      const pdfUrl = await getDownloadURL(pdfRef);

      let coverUrl = '';
      if(coverFile){
        const coverPath = `covers/${uuidv4()}_${coverFile.name}`;
        const coverRef = ref(storage, coverPath);
        await uploadBytesResumable(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverRef);
      }

      const doc = await addDoc(collection(db,'books'),{
        title, author, price: Number(price), pdfUrl, cover: coverUrl, createdAt: serverTimestamp()
      });

      alert('Uploaded');
      router.push('/');
    }catch(err){ console.error(err); alert('Upload failed'); }
    setLoading(false);
  }

  return (
    <div className="container">
      <h2>Upload Book</h2>
      <form onSubmit={upload} style={{maxWidth:520}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
        <input placeholder="Price (0 for free)" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
        <label>PDF File</label>
        <input type="file" accept="application/pdf" onChange={e=>setPdfFile(e.target.files[0])} required />
        <label>Cover Image (optional)</label>
        <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files[0])} />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  )
    }

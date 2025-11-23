// pages/_app.js
import '../styles/globals.css'
import Header from '../components/Header';

export default function MyApp({Component, pageProps}){
  return (
    <>
      <Header />
      <main style={{paddingTop:20}}>
        <Component {...pageProps} />
      </main>
      <footer className="footer">© {new Date().getFullYear()} eBook Hub</footer>
    </>
  )
}

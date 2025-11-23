// components/PDFPreview.js
import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// pdfjs worker (NOTE: version can vary)
// leave pdfjsLib.GlobalWorkerOptions.workerSrc blank when using modern bundler
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch(e){}

export default function PDFPreview({pdfUrl, width=300}){
  const canvasRef = useRef();

  useEffect(()=>{
    if(!pdfUrl) return;
    let canceled = false;
    (async()=>{
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({scale:1.2});
      const canvas = canvasRef.current;
      canvas.height = viewport.height; canvas.width = viewport.width;
      const ctx = canvas.getContext('2d');
      const renderContext = { canvasContext: ctx, viewport };
      await page.render(renderContext).promise;
    })().catch(console.error);
    return ()=> canceled = true;
  },[pdfUrl]);

  return <canvas ref={canvasRef} style={{maxWidth:width, borderRadius:8}} />;
}

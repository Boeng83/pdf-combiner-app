import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';


const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleMerge = async () => {
    setLoading(true);
    try {
      const pdfDocs = [];
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pdfDocs.push(pdfDoc);
      }
      const mergedPdf = await PDFDocument.create();
      for (const pdfDoc of pdfDocs) {
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      setMergedPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert('Failed to merge PDFs.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h1>PDF Combiner App</h1>
      <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleMerge} disabled={files.length < 2 || loading} style={{ marginLeft: 10 }}>
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>
      {mergedPdfUrl && (
        <div style={{ marginTop: 20 }}>
          <h2>Merged PDF Preview</h2>
          <iframe src={mergedPdfUrl} title="Merged PDF" width="100%" height="500px" />
          <a href={mergedPdfUrl} download="merged.pdf" style={{ display: 'block', marginTop: 10 }}>
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
export {};

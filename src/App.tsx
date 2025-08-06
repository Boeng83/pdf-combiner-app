import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';


const App: React.FC = () => {
  const [listText, setListText] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [titleFiles, setTitleFiles] = useState<{ [title: string]: File | null }>({});
  const [convertedFiles, setConvertedFiles] = useState<{ [title: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Parse pasted list into titles
  const handleListPaste = () => {
    const lines = listText.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    setTitles(lines);
    // Reset files for new titles
    const filesObj: { [title: string]: File | null } = {};
    lines.forEach(title => { filesObj[title] = null; });
    setTitleFiles(filesObj);
    setConvertedFiles({});
  };

  // Handle file drop for a specific title
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, title: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setLoading(true);
    try {
      let pdfUrl = '';
      if (file.type === 'application/pdf') {
        // Already a PDF
        pdfUrl = URL.createObjectURL(file);
      } else {
        // Convert to PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        page.drawText('File: ' + file.name); // Placeholder, real conversion needs more logic
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        pdfUrl = URL.createObjectURL(blob);
      }
      setTitleFiles(prev => ({ ...prev, [title]: file }));
      setConvertedFiles(prev => ({ ...prev, [title]: pdfUrl }));
    } catch {
      alert('Failed to convert file to PDF.');
    }
    setLoading(false);
  };

  // Prevent default drag behavior
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h1>PDF Combiner App</h1>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="listPaste"><b>Paste your list from Excel (one title per line):</b></label>
        <textarea
          id="listPaste"
          rows={6}
          style={{ width: '100%', marginTop: 8 }}
          value={listText}
          onChange={e => setListText(e.target.value)}
        />
        <button onClick={handleListPaste} style={{ marginTop: 8 }}>Create List</button>
      </div>
      {titles.length > 0 && (
        <div>
          <h2>Drop files for each title below:</h2>
          {titles.map(title => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <div style={{ width: 200, fontWeight: 'bold' }}>{title}</div>
              <div
                onDrop={e => handleDrop(e, title)}
                onDragOver={handleDragOver}
                style={{ flex: 1, minHeight: 60, border: '2px dashed #aaa', borderRadius: 6, textAlign: 'center', lineHeight: '60px', marginLeft: 12, background: '#fafafa', cursor: 'pointer' }}
              >
                {titleFiles[title] ? `File: ${titleFiles[title]?.name}` : 'Drop file here'}
              </div>
              {convertedFiles[title] && (
                <a href={convertedFiles[title]} download={title + '.pdf'} style={{ marginLeft: 12 }}>Download PDF</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
export {};

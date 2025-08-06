import React from 'react';

interface PdfPreviewProps {
    pdfUrls: string[];
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrls }) => {
    return (
        <div>
            <h2>PDF Preview</h2>
            {pdfUrls.length === 0 ? (
                <p>No PDFs uploaded yet.</p>
            ) : (
                <div>
                    {pdfUrls.map((url, index) => (
                        <iframe
                            key={index}
                            src={url}
                            title={`PDF Preview ${index + 1}`}
                            style={{ width: '100%', height: '500px', border: 'none' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PdfPreview;
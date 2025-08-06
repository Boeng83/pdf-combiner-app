import { PDFDocument } from 'pdf-lib';

export const convertToPdf = async (files: File[]): Promise<Uint8Array[]> => {
    const pdfs: Uint8Array[] = [];

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pdfBytes = await pdfDoc.save();
        pdfs.push(pdfBytes);
    }

    return pdfs;
};
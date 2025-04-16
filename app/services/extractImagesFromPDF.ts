import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

export const extractImagesFromPDF = async (pdfPath: string) => {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));

  const docForm = pdfDoc.getForm();
  console.log('PDF DOC index >>>>', docForm);
  const fields = docForm.getFields();
 

  console.log('fields >>>>', fields);
  return pdfDoc;
 
}
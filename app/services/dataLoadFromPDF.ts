import fs from "fs";
import PDFParser from "pdf2json"; 
import path from 'path';

interface PDFResult {
  text: string;
  error?: string;
  filePath?: string;
}

const ensureDirectoryExists = (filePath: string) => {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

export const loadDataFromPDFWithPDF2JSON = async (filePath: string = 'public/pdf/test.pdf'): Promise<PDFResult> => {
  const resolvedPath = path.resolve(filePath);
  try {
    console.log('Processing PDF file:', resolvedPath);

    if (!fs.existsSync(resolvedPath)) {
      return { text: '', error: `PDF file not found at path: ${resolvedPath}`, filePath: resolvedPath };
    }

    const pdfBytes = fs.readFileSync(resolvedPath);
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      let fullText = '';

      pdfParser.on('pdfParser_dataError', (errData) => {
        reject({ text: '', error: errData.parserError, filePath: resolvedPath });
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          const pages = pdfData.Pages;

          pages.forEach(page => {
            const texts = page.Texts;
            texts.forEach(textObj => {
              fullText += decodeURIComponent(textObj.R[0].T);
            });
          });

          const outputPath = "public/text/test1.txt";
          ensureDirectoryExists(outputPath);

          fs.writeFile(
            outputPath,
            fullText,
            (error) => {
              if (error) {
                console.error('Error saving file:', error);
              }
            }
          );

          resolve({ text: fullText, filePath: resolvedPath });
        } catch (error) {
          reject({ 
            text: '', 
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            filePath: resolvedPath 
          });
        }
      });

      pdfParser.parseBuffer(pdfBytes);
    });
  } catch (error) {
    return { 
      text: '', 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      filePath: resolvedPath 
    };
  }
};
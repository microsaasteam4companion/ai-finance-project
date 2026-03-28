import { PDFParse } from 'pdf-parse';
import path from 'path';
import { pathToFileURL } from 'url';

// Set worker source for pdfjs-dist (required in some Node.js environments)
try {
  const workerPath = path.resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  // On Windows, ESM loader requires file:// URLs for absolute paths
  const workerUrl = pathToFileURL(workerPath).href;
  PDFParse.setWorker(workerUrl);
} catch (e) {
  console.error('Failed to set PDF worker:', e);
}

/**
 * PDF Service for server-side text extraction.
 * Uses PDFParse from pdf-parse to extract raw text from PDF buffers.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let parser: PDFParse | null = null;
  try {
    // Passing buffer directly as the constructor handles Uint8Array conversion
    parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return textResult.text;
  } catch (err: any) {
    console.error('Detailed PDF Parsing Error:', err);
    
    // Better object to string conversion for errors
    let errorString = '';
    if (err instanceof Error) {
      errorString = `${err.name}: ${err.message}\n${err.stack}`;
    } else if (typeof err === 'object') {
      try {
        errorString = JSON.stringify(err);
      } catch (e) {
        errorString = '[Circular or Non-Stringifiable Object]';
      }
    } else {
      errorString = String(err);
    }
    
    throw new Error(`Failed to parse PDF document: ${errorString}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

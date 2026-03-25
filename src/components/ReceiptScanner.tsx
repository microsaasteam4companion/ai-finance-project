'use client';

import { useState, useRef } from 'react';
import { Scan, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function ReceiptScanner({ onScanComplete }: { onScanComplete: (data: any) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(0);

    try {
      // 1. Run local OCR via Tesseract.js (runs securely in the browser)
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 50)); // Takes up the first 50% of the progress bar
          }
        }
      });
      const ocrText = result.data.text;
      setProgress(60);

      // 2. Send messy OCR text to our Next.js API route to be formatted into JSON by Groq
      const response = await fetch('/api/ocr', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ocrText }),
      });
      
      setProgress(90);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setProgress(100);
      onScanComplete(data); // Returns { amount, date, vendor, category }
      
    } catch (err: any) {
      alert("Failed to read receipt: " + err.message);
    } finally {
      setIsScanning(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isScanning}
        className="w-full relative z-10 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-xl font-bold md:w-auto shadow-sm transition-all shrink-0 flex justify-center items-center gap-2 border border-indigo-200 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
        {isScanning ? `Scanning (${Math.round(progress)}%)` : 'Scan Receipt'}
      </button>
    </div>
  );
}

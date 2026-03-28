'use client';

import { useState, useRef } from 'react';
import { Scan, Loader2 } from 'lucide-react';

export default function ReceiptScanner({ onScanComplete }: { onScanComplete: (data: any) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(10);

    try {
      // 1. Convert image to base64 for vision processing
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      setProgress(40);

      // 2. Send image directly to our Vision AI API
      const response = await fetch('/api/ocr', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ imageData: base64 }),
      });
      
      setProgress(80);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to scan receipt');
      
      setProgress(100);
      onScanComplete(data); // Returns { amount, date, vendor, category, summary }
      
    } catch (err: any) {
      console.error(err);
      alert("AI Scanning failed: " + err.message);
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
        className="w-full relative z-10 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-none font-bold md:w-auto shadow-sm transition-all shrink-0 flex justify-center items-center gap-2 border border-indigo-200 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
        {isScanning ? `AI Scanning...` : 'Scan Receipt'}
      </button>
    </div>
  );
}

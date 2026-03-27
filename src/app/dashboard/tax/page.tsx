'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, Loader2, IndianRupee, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Tesseract from 'tesseract.js';
import DashboardHeader from '@/components/DashboardHeader';

export default function TaxWizardPage() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taxData, setTaxData] = useState<any>(null);

  if (authLoading || !user) {
    return (
       <div className="flex w-full items-center justify-center min-h-[400px]">
          <div className="animate-pulse w-12 h-12 bg-indigo-200 rounded-full" />
       </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsScanning(true);
      setTaxData(null);
      
      let text = '';
      
      if (file.type === 'application/pdf') {
        setIsScanning(false);
        setIsAnalyzing(true);
        toast.loading('AI analyzing Tax regimes from PDF...', { id: 'tax' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.uid);

        const analysisRes = await fetch('/api/tax', {
          method: 'POST',
          body: formData
        });
        
        const data = await analysisRes.json();
        if (data.error) throw new Error(data.error);

        setTaxData(data);
        toast.success('PDF Analysis Complete!', { id: 'tax' });
      } else {
        const imageUrl = URL.createObjectURL(file);
        const result = await Tesseract.recognize(imageUrl, 'eng');
        text = result.data.text;
        
        setIsScanning(false);
        setIsAnalyzing(true);
        toast.loading('AI analyzing Tax regimes...', { id: 'tax' });

        const analysisRes = await fetch('/api/tax', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, userId: user.uid })
        });
        
        const data = await analysisRes.json();
        if (data.error) throw new Error(data.error);

        setTaxData(data);
        toast.success('Form 16 Analysis Complete!', { id: 'tax' });
      }

    } catch (err: any) {
      toast.error('Analysis failed: ' + err.message, { id: 'tax' });
    } finally {
      setIsScanning(false);
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualIncomeUpdate = async (manualIncome: number) => {
    if (!user) return;
    try {
      setIsAnalyzing(true);
      toast.loading('AI re-calculating Tax regimes...', { id: 'tax' });

      const analysisRes = await fetch('/api/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualIncome, userId: user.uid })
      });
      
      const data = await analysisRes.json();
      if (data.error) throw new Error(data.error);

      setTaxData(data);
      toast.success('Tax Analysis Updated!', { id: 'tax' });

    } catch (err: any) {
      toast.error('Update failed: ' + err.message, { id: 'tax' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto w-full font-sans relative">
      <DashboardHeader 
        title="CA Tax Wizard" 
        subtitle="India-focused regime comparison & 80C deductions."
      />

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20 relative">

        {tier !== 'premium' && (
           <div className="absolute inset-x-0 top-0 z-50 rounded-3xl backdrop-blur-md bg-white/60 flex flex-col items-center justify-center border border-slate-200 mt-8 mb-20 shadow-xl overflow-hidden mx-8 h-[600px]">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-100">
                 <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium Feature</h2>
                 <p className="text-slate-500 mb-8 font-medium">The CA Tax Wizard is an advanced intelligence tool. Upgrade to FinGenius Premium to unlock this feature.</p>
                 <button onClick={() => router.push('/dashboard/billing')} className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition w-full shadow-lg shadow-purple-600/30">Unlock Premium (₹199)</button>
              </div>
           </div>
        )}

        <div className={tier !== 'premium' ? 'opacity-30 pointer-events-none blur-sm select-none space-y-8' : 'space-y-8'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-3xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden transition-colors hover:bg-purple-50">
                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
                
                {isScanning || isAnalyzing ? (
                   <div className="flex flex-col items-center gap-4 text-purple-600">
                      <Loader2 className="w-10 h-10 animate-spin" />
                      <div className="font-bold">{isScanning ? 'Extracting text...' : 'AI Analyzing...'}</div>
                   </div>
                ) : (
                   <>
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                         <UploadCloud className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Form 16</h3>
                      <p className="text-slate-500 text-sm mb-6 font-medium">Auto-extract all data via AI scan.</p>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-colors text-sm">
                         Select File
                      </button>
                   </>
                )}
             </div>

             <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-indigo-600"/> Manual Salary Structure</h3>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Basic Salary (Yearly)</label>
                         <input id="manual-basic" type="number" placeholder="₹5,00,000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">HRA Received</label>
                         <input id="manual-hra" type="number" placeholder="₹2,00,000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Other Allowances (LTA, Special, etc.)</label>
                      <input id="manual-others" type="number" placeholder="₹3,00,000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                   </div>
                   <button 
                     onClick={() => {
                        const basic = Number((document.getElementById('manual-basic') as HTMLInputElement).value) || 0;
                        const hra = Number((document.getElementById('manual-hra') as HTMLInputElement).value) || 0;
                        const others = Number((document.getElementById('manual-others') as HTMLInputElement).value) || 0;
                        handleManualIncomeUpdate(basic + hra + others);
                     }}
                     className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 text-sm"
                   >
                     Calculate Optimization
                   </button>
                </div>
             </div>
          </div>

          {taxData && (
             <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-slate-800 text-white rounded-3xl p-6 shadow-lg border border-slate-700 relative group">
                      <div className="text-slate-400 text-sm font-medium mb-1 flex items-center justify-between">
                         <span className="flex items-center gap-1.5"><FileText className="w-4 h-4"/> Detected Gross Income</span>
                         <button 
                           onClick={() => {
                               const newVal = prompt("Enter Gross Annual Income:", taxData.estimatedIncome);
                               if (newVal !== null) {
                                   const income = parseInt(newVal.replace(/,/g, ''));
                                   handleManualIncomeUpdate(income);
                               }
                           }}
                           className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors"
                         >
                           Edit
                         </button>
                      </div>
                      <div className="text-4xl font-extrabold tracking-tight mt-2 flex items-center">
                         <IndianRupee className="w-7 h-7 mr-1 opacity-50"/>
                         {taxData.estimatedIncome?.toLocaleString()}
                      </div>
                      {taxData.isAnnualized && <div className="text-[10px] text-emerald-400 font-bold mt-1">Found monthly, multiplied by 12</div>}
                   </div>
                   <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                      <div className="text-slate-500 text-sm font-medium mb-1">Old Regime Tax</div>
                      <div className="text-3xl font-bold text-slate-800 tracking-tight mt-2 flex items-center">
                         <IndianRupee className="w-6 h-6 mr-1 text-slate-400"/>
                         {taxData.oldRegimeTax?.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 font-medium">Assuming max standard deductions.</div>
                   </div>
                   <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="text-slate-500 text-sm font-medium mb-1">New Regime Tax</div>
                      <div className="text-3xl font-bold text-emerald-600 tracking-tight mt-2 flex items-center">
                         <IndianRupee className="w-6 h-6 mr-1 text-emerald-400"/>
                         {taxData.newRegimeTax?.toLocaleString()}
                      </div>
                      <div className="text-xs text-emerald-500 mt-2 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded">Default for FY24-25</div>
                   </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><CheckCircle2 className="w-6 h-6"/></div>
                       <h3 className="text-xl font-bold text-slate-800 mb-2">CA Recommendation</h3>
                       <p className="text-slate-600 font-medium leading-relaxed mb-6">{taxData.recommendedRegime}</p>
                       
                       {taxData.regimeBreakdown && (
                          <div className="space-y-4 pt-4 border-t border-slate-100">
                             <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Standard Deduction</span>
                                <div className="flex gap-4">
                                   <span className="text-slate-400">Old: ₹{taxData.regimeBreakdown.old.stdDeduction.toLocaleString()}</span>
                                   <span className="text-emerald-600">New: ₹{taxData.regimeBreakdown.new.stdDeduction.toLocaleString()}</span>
                                </div>
                             </div>
                             <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">80C/80D Allowed?</span>
                                <div className="flex gap-4">
                                   <span className="text-indigo-600">Old: YES</span>
                                   <span className="text-slate-400">New: NO</span>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                    
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:bg-purple-500/20"></div>
                       <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10"><ShieldAlert className="w-5 h-5 text-purple-400"/> AI Investment Ranking</h3>
                       <div className="space-y-4 relative z-10">
                          {taxData.investmentRanking?.map((inv: any, i: number) => (
                             <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl transition-all hover:bg-slate-800 hover:scale-[1.02]">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="font-bold text-slate-100">{inv.name}</span>
                                   <div className="flex gap-2 text-[10px] font-black uppercase">
                                      <span className={`px-2 py-0.5 rounded ${inv.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-400' : inv.risk === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-rose-500/20 text-rose-400'}`}>Risk: {inv.risk}</span>
                                      <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">Liquidity: {inv.liquidity}</span>
                                   </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{inv.suitability}</p>
                             </div>
                          ))}
                          {!taxData.investmentRanking && (
                             <ul className="space-y-4">
                                {taxData.suggestions?.map((s: string, i: number) => (
                                   <li key={i} className="flex items-start gap-3">
                                      <div className="w-6 h-6 shrink-0 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center mt-0.5">{i+1}</div>
                                      <span className="text-slate-300 font-medium text-sm leading-relaxed">{s}</span>
                                   </li>
                                ))}
                             </ul>
                          )}
                       </div>
                    </div>
                 </div>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Sparkles, Activity, Rocket, UploadCloud, FileText, Crosshair, TrendingUp, Loader2, IndianRupee, Lock, PieChart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Tesseract from 'tesseract.js';
import DashboardHeader from '@/components/DashboardHeader';

export default function PortfolioXrayPage() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);

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
      setPortfolioData(null);
      
      let text = '';
      
      if (file.type === 'application/pdf') {
        setIsScanning(false);
        setIsAnalyzing(true);
        toast.loading('Running deep X-Ray Analysis from PDF...', { id: 'xray' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.uid);

        const analysisRes = await fetch('/api/portfolio', {
          method: 'POST',
          body: formData
        });
        
        const data = await analysisRes.json();
        if (data.error) throw new Error(data.error);

        setPortfolioData(data);
        toast.success('PDF X-Ray Scan Complete!', { id: 'xray' });
      } else {
        const imageUrl = URL.createObjectURL(file);
        const result = await Tesseract.recognize(imageUrl, 'eng');
        text = result.data.text;
        
        setIsScanning(false);
        setIsAnalyzing(true);
        toast.loading('Running deep X-Ray Analysis...', { id: 'xray' });

        const analysisRes = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, userId: user.uid })
        });
        
        const data = await analysisRes.json();
        if (data.error) throw new Error(data.error);

        setPortfolioData(data);
        toast.success('X-Ray Scan Complete!', { id: 'xray' });
      }

    } catch (err: any) {
      toast.error('Scan failed: ' + err.message, { id: 'xray' });
    } finally {
      setIsScanning(false);
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto w-full font-sans relative">
      <DashboardHeader 
        title="MF Portfolio X-Ray" 
        subtitle="Scan statements for overlap & expense analysis."
      />

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20 relative">

        {tier !== 'premium' && (
           <div className="absolute inset-x-0 top-0 z-50 rounded-3xl backdrop-blur-md bg-white/60 flex flex-col items-center justify-center border border-slate-200 mt-8 mb-20 shadow-xl overflow-hidden mx-8 h-[600px]">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-100">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium Feature</h2>
                 <p className="text-slate-500 mb-8 font-medium">Mutual Fund X-Ray is an advanced AI intelligence tool calculating live exposures. Upgrade to Premium to unlock it.</p>
                 <button onClick={() => router.push('/dashboard/billing')} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition w-full shadow-lg shadow-blue-600/30">Unlock Premium ($25)</button>
              </div>
           </div>
        )}

        <div className={tier !== 'premium' ? 'opacity-30 pointer-events-none blur-sm select-none space-y-8' : 'space-y-8'}>
          <div className="bg-white border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-3xl p-10 text-center flex flex-col items-center justify-center relative overflow-hidden transition-colors hover:bg-blue-50/80">
             <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
             
             {isScanning || isAnalyzing ? (
                <div className="flex flex-col items-center gap-4 text-blue-600">
                   <Loader2 className="w-12 h-12 animate-spin" />
                   <div className="font-bold text-lg">{isScanning ? 'Extracting text via Tesseract OCR...' : 'AI scanning for Fund Overlaps...'}</div>
                   <p className="text-sm text-blue-500 max-w-md">Our SEBI-level AI logic is cross-checking mutual fund constituent databases to calculate true exposure safely in your browser.</p>
                </div>
             ) : (
                <>
                   <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <Crosshair className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload CAMS / KFintech Statement</h2>
                   <p className="text-slate-500 max-w-lg mx-auto mb-8 font-medium">Upload a screenshot of your Mutual Fund statement holding summary. We instantly calculate Equity vs Debt, parse fund names, and flag toxic Expense Ratios or Overlaps.</p>
                   <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                      Scan Statement (PDF or Image)
                   </button>
                </>
             )}
          </div>

          {portfolioData && (
              <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>
                       <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">Total Portfolio</div>
                       <div className="text-3xl font-black tracking-tight mt-2 flex items-center relative z-10">
                          <IndianRupee className="w-6 h-6 mr-1 opacity-50"/>
                          {portfolioData.totalValue?.toLocaleString()}
                       </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative group overflow-hidden">
                       <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Estimated XIRR</div>
                       <div className="text-3xl font-black text-emerald-600 tracking-tight mt-2 flex items-center">
                          {portfolioData.estimatedXirr}%
                          <TrendingUp className="w-5 h-5 ml-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                       <div className="text-[10px] text-slate-400 mt-2 font-bold bg-slate-50 w-fit px-2 py-0.5 rounded">Benchmark: {portfolioData.benchmarkReturn}%</div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                       <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Equity Exposure</div>
                       <div className="text-3xl font-black text-slate-800 tracking-tight mt-2">{portfolioData.equityPercent}%</div>
                       <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${portfolioData.equityPercent}%` }}></div>
                       </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                       <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Debt Exposure</div>
                       <div className="text-3xl font-black text-slate-800 tracking-tight mt-2">{portfolioData.debtPercent}%</div>
                       <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${portfolioData.debtPercent}%` }}></div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><PieChart className="w-5 h-5 text-indigo-600"/> Top Fund Allocations</h3>
                       <div className="space-y-4">
                          {portfolioData.topFunds?.map((fund: string, i: number) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-default">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{i+1}</div>
                                   <span className="text-sm font-bold text-slate-700">{fund}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:bg-indigo-500/20"></div>
                       <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 relative z-10"><Rocket className="w-5 h-5 text-indigo-400"/> AI Rebalancing Plan</h3>
                       <div className="space-y-4 relative z-10">
                          {portfolioData.rebalancingPlan?.map((item: any, i: number) => (
                             <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl group/item hover:bg-slate-800 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                   <div>
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mr-2 ${item.action === 'Sell' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{item.action}</span>
                                      <span className="font-bold text-slate-100">{item.fund}</span>
                                   </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.reason}</p>
                             </div>
                          ))}
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

'use client';

import { useState, useEffect } from 'react';
import { getProfile, getPartner } from '@/lib/db';
import { Users, TrendingUp, ShieldCheck, ArrowRight, IndianRupee, PieChart, Info, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface JointStrategy {
  jointNetWorth: number;
  hraStrategy: string;
  npsStrategy: string;
  sipSplit: string;
  insuranceStrategy: string;
  topInsight: string;
}

export default function JointOptimizer({ householdId, currentUserId }: { householdId: string, currentUserId: string }) {
  const [partner, setPartner] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [strategy, setStrategy] = useState<JointStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (householdId) fetchData();
  }, [householdId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const partnerData = await getPartner(householdId, currentUserId);
      const userData = await getProfile(currentUserId);

      if (partnerData) setPartner(partnerData);
      if (userData) setCurrentUser(userData);
    } catch (error) {
      console.error('Error fetching joint data:', error);
    }
    
    setLoading(false);
  };

  const handleOptimize = async () => {
    if (!partner || !currentUser) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/joint-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, partnerId: partner.id })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStrategy(data);
      toast.success('Household strategy optimized!');
    } catch (err: any) {
      toast.error('Optimization failed: ' + err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Analyzing Household Data...</div>;
  if (!partner) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <PieChart className="w-8 h-8 text-emerald-600" />
                  Joint Wealth Optimization
               </h3>
               <p className="text-slate-500 font-medium mt-1">AI-driven household efficiency for tax & growth.</p>
            </div>
            {!strategy && !isOptimizing && (
               <button 
                  onClick={handleOptimize}
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2 group"
               >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  SYNC & OPTIMIZE
               </button>
            )}
            {isOptimizing && (
               <div className="flex items-center gap-3 text-emerald-600 font-bold animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI CALIBRATING...
               </div>
            )}
            {strategy && (
               <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Analyzed
               </div>
            )}
         </div>

         {/* Joint Stats Summary */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 relative z-10">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Household Assets</div>
               <div className="text-3xl font-black text-slate-900 flex items-center">
                  <IndianRupee className="w-6 h-6 opacity-30" />
                  {((partner.assets || 0) + (currentUser?.assets || 0)).toLocaleString()}
               </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Household Debt</div>
               <div className="text-3xl font-black text-rose-600 flex items-center">
                  <IndianRupee className="w-6 h-6 opacity-30" />
                  {((partner.debt || 0) + (currentUser?.debt || 0)).toLocaleString()}
               </div>
            </div>
            <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-600/20">
               <div className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Joint Net Worth</div>
               <div className="text-3xl font-black flex items-center">
                  <IndianRupee className="w-6 h-6 opacity-50" />
                  {strategy?.jointNetWorth?.toLocaleString() || (((partner.assets || 0) + (currentUser?.assets || 0)) - ((partner.debt || 0) + (currentUser?.debt || 0))).toLocaleString()}
               </div>
            </div>
         </div>

         {strategy ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                         <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-800">Tax Optimization Results</h4>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                         <div className="text-[10px] font-black text-indigo-600 uppercase mb-1">HRA Strategy</div>
                         <p className="text-sm font-bold text-indigo-900 leading-relaxed">{strategy.hraStrategy}</p>
                      </div>
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                         <div className="text-[10px] font-black text-indigo-600 uppercase mb-1">NPS Matching</div>
                         <p className="text-sm font-bold text-indigo-900 leading-relaxed">{strategy.npsStrategy}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-800">Asset & Risk Strategy</h4>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                         <div className="text-[10px] font-black text-emerald-600 uppercase mb-1">SIP Splitting</div>
                         <p className="text-sm font-bold text-emerald-900 leading-relaxed">{strategy.sipSplit}</p>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                         <div className="text-[10px] font-black text-emerald-600 uppercase mb-1">Insurance Advisory</div>
                         <p className="text-sm font-bold text-emerald-900 leading-relaxed">{strategy.insuranceStrategy}</p>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group/insight">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover/insight:bg-emerald-500/20 transition-all"></div>
                   <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Master Insight</h5>
                   <p className="text-xl font-bold leading-relaxed italic">"{strategy.topInsight}"</p>
                </div>
             </div>
         ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center relative z-10 group cursor-pointer" onClick={handleOptimize}>
               <Users className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
               <h4 className="text-lg font-bold text-slate-800 mb-2">Household Data Synced</h4>
               <p className="text-slate-500 max-w-sm mx-auto font-medium">Click "SYNC & OPTIMIZE" above to run our AI joint planner across both accounts.</p>
            </div>
         )}
      </div>
    </div>
  );
}

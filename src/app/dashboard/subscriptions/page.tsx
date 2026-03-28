'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTransactions, updateTransaction } from '@/lib/db';
import { Activity, HandCoins, CalendarClock, Bot, Plus, Lock } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

export default function SubscriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [detectedSubs, setDetectedSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allTransactions = await getTransactions(user.uid);
      
      const activeSubs = allTransactions
        .filter(t => t.is_recurring === true)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
      const allExpenses = allTransactions.filter(t => t.type === 'expense');

      setSubscriptions(activeSubs);

      if (allExpenses && activeSubs) {
         const flaggedIds = new Set(activeSubs.map((s: any) => s.id));
         const uncheckedExpenses = allExpenses.filter((e: any) => !flaggedIds.has(e.id));

         const groups: any = {};
         uncheckedExpenses.forEach((t: any) => {
            const key = `${t.category?.toLowerCase()}-${t.amount}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
         });

         const detected: any[] = [];
         Object.values(groups).forEach((group: any) => {
            if (group.length >= 2) {
               group.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
               const latest = group[0];
               const previous = group[1];
               
               const daysDiff = Math.abs(new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24);
               
               if (daysDiff >= 20 && daysDiff <= 40) {
                   const nextDate = new Date(latest.date);
                   nextDate.setDate(nextDate.getDate() + 30);
                   
                   detected.push({
                      ...latest,
                      occurrence_count: group.length,
                      next_payment_predicted: nextDate.toISOString().split('T')[0]
                   });
               }
            }
         });
         setDetectedSubs(detected);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
    
    setLoading(false);
  };

  const handleConfirmDetection = async (sub: any) => {
     if (!user) return;
     await updateTransaction(user.uid, sub.id, { is_recurring: true });
     fetchSubscriptions();
  };

  if (authLoading || (!user && !loading)) {
    return (
       <div className="flex w-full items-center justify-center min-h-[400px]">
          <div className="animate-pulse w-12 h-12 bg-indigo-200 rounded-full" />
       </div>
    );
  }

  const uniqueSubs = new Set(subscriptions.map(s => s.category.toLowerCase()));
  const totalMonthlyStated = subscriptions.reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <main className="flex-1 overflow-y-auto font-sans relative">
      <DashboardHeader 
        title="Smart Subscriptions" 
      />

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Active Subscriptions</div>
                <div className="text-4xl font-bold text-slate-900">{uniqueSubs.size}</div>
             </div>
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Activity className="w-8 h-8" /></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Total Fixed Outflow</div>
                <div className="text-4xl font-bold text-slate-900">₹{totalMonthlyStated.toLocaleString()}</div>
             </div>
             <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><HandCoins className="w-8 h-8" /></div>
          </div>
        </div>

        {tier !== 'premium' ? (
           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group mb-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner border border-indigo-100/50">
                 <Lock className="w-10 h-10" />
              </div>
              <h3 className="font-black text-2xl text-slate-800 mb-3 tracking-tight">AI Subscription Detection</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-md">Automatically scan your transaction history to find hidden recurring charges and predict your next payments before they happen.</p>
              <button onClick={() => router.push('/dashboard/billing')} className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 text-lg w-full max-w-xs flex items-center justify-center gap-2">
                 Unlock Premium <Bot className="w-5 h-5"/>
              </button>
           </div>
        ) : detectedSubs.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 border border-indigo-400 p-6 rounded-3xl flex flex-col md:flex-row gap-6 shadow-xl animate-in slide-in-from-bottom-4 text-white">
            <div className="bg-white/20 p-4 rounded-full self-start shrink-0"><Bot className="w-8 h-8" /></div>
            <div className="w-full">
               <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2">AI Auto-Detection</h3>
               <p className="text-indigo-100 text-sm mb-6">FinGenius analyzed your history and found {detectedSubs.length} recurring charges you haven't tracked yet! Is this a subscription?</p>
               
               <div className="space-y-3">
                  {detectedSubs.map((sub, i) => (
                     <div key={'d'+i} className="bg-indigo-900/40 border border-indigo-400/30 p-4 rounded-xl flex items-center justify-between">
                        <div>
                           <div className="font-bold flex items-center gap-2">
                              <span className="capitalize">{sub.category}</span>
                              <span className="bg-indigo-400 text-white px-2 py-0.5 rounded-md text-xs">Seen {sub.occurrence_count}x</span>
                           </div>
                           <div className="text-indigo-200 text-xs mt-1">Next predicted charge: {new Date(sub.next_payment_predicted).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="font-bold text-lg">₹{Number(sub.amount).toLocaleString()}</div>
                           <button onClick={() => handleConfirmDetection(sub)} className="bg-white text-indigo-600 p-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm" title="Confirm it's a subscription">
                              <Plus className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Upcoming Timeline</h3>
              <CalendarClock className="w-5 h-5 text-slate-400" />
           </div>
           
           <div className="divide-y divide-slate-100">
              {subscriptions.length === 0 && !loading && <div className="p-8 text-center text-slate-500">No recurring transactions found.</div>}
              {subscriptions.map((sub, i) => {
                 const nextDate = new Date(sub.date);
                 nextDate.setDate(nextDate.getDate() + 30); 
                 let daysLeft = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                 
                 if (daysLeft < 0) daysLeft = daysLeft % 30 + 30;

                 return (
                   <div key={sub.id || i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold uppercase select-none">
                            {sub.category.substring(0, 2)}
                         </div>
                         <div>
                            <div className="font-bold text-slate-900 capitalize flex gap-2 items-center">
                               {sub.category}
                               {daysLeft <= 5 && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Due Soon</span>}
                            </div>
                            <div className="text-sm text-slate-500">Predicted {nextDate.toLocaleDateString()}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-slate-900 text-lg">₹{Number(sub.amount).toLocaleString()}</div>
                         <div className="text-xs text-slate-400 font-medium mt-1">Runs in {daysLeft} days</div>
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>
      </div>
    </main>
  );
}

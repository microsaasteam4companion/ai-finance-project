'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, Home, PieChart, Activity, User as UserIcon, Sparkles, BrainCircuit, Loader2, CreditCard, Lock, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function CoachPage() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTransactions();
    }
  }, [user, authLoading, router]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(20);

    if (data) {
      setTransactions(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const generateAdvice = async (event?: string) => {
    if (transactions.length === 0 && !event) {
      alert("Add some transactions first so I can analyze your spending!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactions: transactions.map(t => ({ amount: t.amount, category: t.category, date: t.date, type: t.type })),
          user_name: user?.email?.split('@')[0],
          userId: user?.id,
          event
        }),
      });

      const data = await response.json();
      if (data.advice) {
        setAdvice(data.advice);
        // Optionally save to DB
        await supabase.from('ai_advice').insert([{
           user_id: user?.id,
           type: event || 'insight',
           content: data.advice
        }]);
      } else {
        toast.error("Could not generate advice: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to the AI Coach.");
    }
    setIsGenerating(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">AI Savings Coach</h1>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
            <UserIcon className="w-5 h-5" />
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20 relative">
          {tier !== 'premium' && (
             <div className="absolute inset-0 z-50 rounded-3xl backdrop-blur-md bg-white/60 flex flex-col items-center justify-center border border-slate-200 mt-8 mb-20 shadow-xl overflow-hidden mx-8">
                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-100">
                   <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                      <Lock className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium AI Coach</h2>
                   <p className="text-slate-500 mb-8 font-medium">The AI Savings Coach calculates advanced spending optimizations based on your behavior. Upgrade to unlock this mentor.</p>
                   <button onClick={() => router.push('/dashboard/billing')} className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition w-full shadow-lg shadow-indigo-600/30">Unlock Premium (₹199)</button>
                </div>
             </div>
          )}

          <div className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden ${tier !== 'premium' ? 'opacity-30 pointer-events-none blur-sm select-none' : ''}`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner cursor-pointer" onClick={() => generateAdvice()}>
                   {isGenerating ? <Loader2 className="w-10 h-10 animate-spin" /> : <BrainCircuit className="w-10 h-10 animate-bounce" />}
                </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Tap the brain to get a personalized insight</h2>
                 <p className="text-slate-500 mb-8 max-w-md">Our AI analyzes your recent transactions and suggests exactly where you can cut back or optimize to grow your wealth.</p>
                                  <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-3">
                       {[
                          { id: 'bonus', label: 'Just got a Bonus', icon: <IndianRupee className="w-3 h-3"/>, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                          { id: 'marriage', label: 'Planning Marriage', icon: <Sparkles className="w-3 h-3"/>, color: 'text-rose-600 bg-rose-50 border-rose-100' },
                          { id: 'baby', label: 'New Baby', icon: <Activity className="w-3 h-3"/>, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                          { id: 'inheritance', label: 'Received Inheritance', icon: <BrainCircuit className="w-3 h-3"/>, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                       ].map(event => (
                          <button 
                             key={event.id}
                             onClick={() => generateAdvice(event.id)}
                             disabled={isGenerating}
                             className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${event.color} disabled:opacity-50`}
                          >
                             {event.icon}
                             {event.label}
                          </button>
                       ))}
                    </div>

                    <button 
                      onClick={() => generateAdvice()} 
                      disabled={isGenerating}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-black shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
                    >
                      <Sparkles className={`w-6 h-6 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}/> 
                      {isGenerating ? 'Analyzing...' : 'Universal Advice'}
                    </button>

                    {transactions.length === 0 && (
                       <p className="text-amber-600 font-bold text-sm bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 flex items-center gap-2 animate-pulse">
                          ⚠️ Add transactions in the Dashboard first to get AI insights!
                       </p>
                    )}
                  </div>
             </div>
          </div>

          {advice && (
             <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-3 mb-4">
                   <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                      <Sparkles className="w-6 h-6 text-indigo-300" />
                   </div>
                   <h3 className="text-xl font-bold tracking-tight">FinGenius Insights</h3>
                </div>
                <p className="text-indigo-50 text-lg leading-relaxed whitespace-pre-wrap">{advice}</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

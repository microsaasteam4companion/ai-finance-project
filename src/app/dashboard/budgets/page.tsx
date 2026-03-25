'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, Home, PieChart, Activity, User as UserIcon, Plus, Target, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function BudgetsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [currentSpend, setCurrentSpend] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch budgets
    const { data: bData } = await supabase.from('budgets').select('*');
    if (bData) setBudgets(bData);

    // Fetch this month's transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { data: tData } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', 'expense')
      .gte('date', startOfMonth.toISOString().split('T')[0]);

    if (tData) {
      const spend = tData.reduce((acc: any, t) => {
        const cat = t.category.toLowerCase();
        acc[cat] = (acc[cat] || 0) + Number(t.amount);
        return acc;
      }, {});
      setCurrentSpend(spend);
    }
    setLoading(false);
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from('budgets').insert([{ user_id: user.id, category, limit_amount: parseFloat(limit) }]);
    setShowAdd(false);
    setCategory('');
    setLimit('');
    fetchData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading || (!user && !loading)) {
    return <div className="flex h-screen bg-slate-50 items-center justify-center"><div className="w-12 h-12 bg-indigo-200 rounded-full animate-pulse" /></div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Budget Planning</h1>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
            <UserIcon className="w-5 h-5" />
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Monthly Budgets</h2>
            <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
              <Plus className="w-4 h-4"/> New Budget
            </button>
          </div>

          {showAdd && (
            <form onSubmit={handleAddBudget} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 flex flex-col md:flex-row gap-4 items-end mb-8">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Food" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Limit (₹)</label>
                <input required type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="w-full md:w-auto">
                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium">Save</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map(b => {
              const spend = currentSpend[b.category.toLowerCase()] || 0;
              const limit = Number(b.limit_amount);
              const percentage = Math.min(100, Math.round((spend / limit) * 100));
              
              let color = "bg-emerald-500";
              if (percentage >= 80 && percentage < 100) color = "bg-amber-400";
              if (percentage >= 100) color = "bg-red-500";

              return (
                <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-lg">{b.category}</div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">₹{spend.toLocaleString()}</span>
                      <span className="text-slate-400 text-sm"> / ₹{limit.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div className={`${color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">{percentage}% used</span>
                    {percentage >= 100 && <span className="text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Over limit by ₹{(spend - limit).toLocaleString()}</span>}
                  </div>
                </div>
              );
            })}
             {budgets.length === 0 && !loading && (
              <div className="col-span-2 text-center py-12 text-slate-400">You haven't set any budgets yet.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBudgets, setBudget, getTransactions } from '@/lib/db';
import { Plus, AlertCircle } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

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
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bData = await getBudgets(user.uid);
      if (bData) setBudgets(bData);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0,0,0,0);
      
      const tData = await getTransactions(user.uid);
      const filtered = tData.filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth);

      if (filtered) {
        const spend = filtered.reduce((acc: any, t) => {
          const cat = t.category.toLowerCase();
          acc[cat] = (acc[cat] || 0) + Number(t.amount);
          return acc;
        }, {});
        setCurrentSpend(spend);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
    setLoading(false);
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setBudget(user.uid, category.toLowerCase(), parseFloat(limit));
      setShowAdd(false);
      setCategory('');
      setLimit('');
      fetchData();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  if (authLoading || (!user && !loading)) {
    return (
       <div className="flex w-full items-center justify-center min-h-[400px]">
          <div className="animate-pulse w-12 h-12 bg-indigo-200 rounded-full" />
       </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto font-sans relative">
      <DashboardHeader 
        title="Budget Planner" 
      />

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Monthly Budgets</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4"/> New Budget
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddBudget} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 flex flex-col md:flex-row gap-4 items-end mb-8 text-slate-900 font-sans relative">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Food" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Limit (₹)</label>
              <input required type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="w-full md:w-auto">
              <button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md font-medium">Save</button>
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
              <div key={b.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
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
  );
}

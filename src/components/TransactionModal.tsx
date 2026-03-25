'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function TransactionModal({ isOpen, onClose, onSuccess, initialData }: any) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setAmount(initialData.amount || '');
        setCategory(initialData.category || initialData.vendor || '');
        if (initialData.date) setDate(initialData.date);
        setType(initialData.type || 'expense');
        setPaymentMethod(initialData.payment_method || 'credit_card');
        setIsRecurring(initialData.is_recurring || false);
        setEditingId(initialData.id || null); // IF id exists, it's an EDIT!
      } else {
        setAmount('');
        setCategory('');
        setPaymentMethod('credit_card');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
        setIsRecurring(false);
        setEditingId(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    const payload = {
      user_id: user.id,
      amount: parseFloat(amount),
      type,
      category,
      payment_method: paymentMethod,
      date,
      is_recurring: isRecurring
    };

    let error;
    if (editingId) {
       const res = await supabase.from('transactions').update(payload).eq('id', editingId);
       error = res.error;
    } else {
       const res = await supabase.from('transactions').insert([payload]);
       error = res.error;
    }

    setLoading(false);
    if (!error) {
       toast.success('Transaction saved successfully!');
       
       if (type === 'expense') {
          // Budget threshold check (case-insensitive)
          const { data: bData } = await supabase.from('budgets').select('*').ilike('category', category).eq('user_id', user.id).single();
          if (bData) {
             const startOfMonth = new Date(); startOfMonth.setDate(1);
             const { data: tData } = await supabase.from('transactions').select('amount, category').eq('type', 'expense').ilike('category', category).gte('date', startOfMonth.toISOString().split('T')[0]);
             if (tData) {
                const total = tData.reduce((sum, t) => sum + Number(t.amount), 0);
                if (total > bData.limit_amount) {
                   toast.error(`Warning: You have exceeded your ${category} budget of ₹${bData.limit_amount}!`, { duration: 5000 });
                } else if (total > bData.limit_amount * 0.8) {
                   toast.error(`Heads up: You've used over 80% of your ${category} budget!`, { duration: 5000, icon: '⚠️' });
                }
             }
          }
       }

       setAmount('');
       setCategory('');
       onSuccess();
       onClose();
    } else {
       toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
           <h3 className="font-bold text-lg text-slate-900">Add Transaction</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5"/>
           </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
              <div className="grid grid-cols-2 gap-3">
                 <button type="button" onClick={() => setType('expense')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${type === 'expense' ? 'bg-red-50 text-red-600 border-red-200 border' : 'bg-slate-50 text-slate-600 border border-transparent'}`}>Expense</button>
                 <button type="button" onClick={() => setType('income')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 border' : 'bg-slate-50 text-slate-600 border border-transparent'}`}>Income</button>
              </div>
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
              <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="E.g., Food, Salary, Rent" />
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                 <option value="credit_card">Credit Card</option>
                 <option value="debit_card">Debit Card</option>
                 <option value="upi">UPI / Digital</option>
                 <option value="cash">Cash</option>
              </select>
           </div>

           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
           </div>

           <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Mark as recurring subscription/bill</span>
           </label>

           <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? 'Update Transaction' : 'Save Transaction'}
           </button>
        </form>
      </div>
    </div>
  );
}

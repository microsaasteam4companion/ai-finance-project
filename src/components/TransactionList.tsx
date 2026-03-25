'use client';

import { Utensils, Home, Car, ShoppingBag, Coffee, ArrowUpCircle, HelpCircle, Edit2, Trash2, CreditCard, Banknote } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const categoryIcons: any = {
  'food': <Utensils className="w-5 h-5" />,
  'rent': <Home className="w-5 h-5" />,
  'transport': <Car className="w-5 h-5" />,
  'shopping': <ShoppingBag className="w-5 h-5" />,
  'coffee': <Coffee className="w-5 h-5" />,
  'salary': <ArrowUpCircle className="w-5 h-5" />,
  'default': <HelpCircle className="w-5 h-5" />
};

export default function TransactionList({ transactions, onEdit, onRefresh }: { transactions: any[], onEdit: (t: any) => void, onRefresh: () => void }) {
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete: ' + error.message);
    } else {
      toast.success('Transaction deleted');
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative z-20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
        <button className="text-indigo-600 font-medium text-sm hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No transactions yet. Click Add to get started!</div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                  {t.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : (categoryIcons[t.category.toLowerCase()] || categoryIcons['default'])}
                </div>
                <div>
                  <div className="font-bold text-slate-900 capitalize flex items-center gap-2">
                    {t.category} 
                    {t.payment_method && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase font-medium">
                        {t.payment_method === 'cash' ? <Banknote className="w-3 h-3"/> : <CreditCard className="w-3 h-3"/>}
                        {t.payment_method}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(t)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { Utensils, Home, Car, ShoppingBag, Coffee, ArrowUpCircle, HelpCircle, Edit2, Trash2, CreditCard, Banknote } from 'lucide-react';
import { deleteTransaction } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(user.uid, id);
      toast.success('Transaction deleted');
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 bg-card rounded-xl border border-dashed border-border">
          No transactions yet. Click Add to get started!
        </div>
      ) : (
        transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 md:p-4 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all group gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-md flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                {t.type === 'income' ? <ArrowUpCircle className="w-6 h-6" /> : (categoryIcons[t.category.toLowerCase()] || categoryIcons['default'])}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-foreground capitalize flex items-center gap-2 truncate text-sm md:text-base">
                  {t.category} 
                  {t.payment_method && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md uppercase font-medium">
                      {t.payment_method === 'cash' ? <Banknote className="w-3 h-3"/> : <CreditCard className="w-3 h-3"/>}
                      {t.payment_method}
                    </span>
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground font-medium">{new Date(t.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className={`font-black text-sm md:text-lg whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </div>
              <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(t)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

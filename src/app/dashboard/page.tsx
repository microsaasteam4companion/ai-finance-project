'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, Home, PieChart, Activity, User as UserIcon, Plus, Sparkles, TrendingDown, TrendingUp , CreditCard, HeartPulse, ShieldCheck, Zap, Target, Scale, CheckCircle2, Menu } from 'lucide-react';
import TransactionModal from '@/components/TransactionModal';
import DashboardCharts from '@/components/DashboardCharts';
import TransactionList from '@/components/TransactionList';
import ReceiptScanner from '@/components/ReceiptScanner';
import Sidebar from '@/components/Sidebar';
import HealthScoreWizard from '@/components/HealthScoreWizard';
import DashboardHeader from '@/components/DashboardHeader';

function DashboardContent() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calculatingHealth, setCalculatingHealth] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTransactions();
    }
  }, [user, authLoading, router]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
      // Trigger a short "AI Analyzing" state
      setCalculatingHealth(true);
      setTimeout(() => setCalculatingHealth(false), 800);
    }
    
    // Fetch profile for proprietary health score
    if (user) {
       const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
       if (pData) setProfile(pData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading || (!user && !loading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
        </div>
      </div>
    );
  }

  // Calculate stats for CURRENT MONTH
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  
  let healthScore: number | string = 'N/A';
  let dimensions = [
    { name: 'Emergency', score: 0, icon: ShieldCheck, color: 'text-red-500' },
    { name: 'Insurance', score: 0, icon: HeartPulse, color: 'text-indigo-500' },
    { name: 'Investments', score: 0, icon: TrendingUp, color: 'text-emerald-500' },
    { name: 'Debt Health', score: 0, icon: Scale, color: 'text-foreground' },
    { name: 'Tax Efficiency', score: 0, icon: Zap, color: 'text-purple-500' },
    { name: 'Retirement', score: 0, icon: Target, color: 'text-orange-500' },
  ];

  if (totalIncome > 0 || profile) {
     // 1. Savings Rate (New Priority Dimension - Max 25)
     const monthlySavings = Math.max(0, totalIncome - totalExpense);
     const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0;
     const savingsScore = Math.min(25, (savingsRate / 50) * 25); // 50% savings rate = 25 pts
     
     // 2. Emergency Fund (Max 15)
     const ninetyDaysAgo = new Date();
     ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
     const expensesLast90Days = transactions
       .filter(t => t.type === 'expense' && new Date(t.date) >= ninetyDaysAgo)
       .reduce((sum, t) => sum + Number(t.amount), 0);
     const monthlyAvg = Math.max(1, expensesLast90Days / 3);

     const emergencyMonths = (profile?.emergency_fund || 0) / monthlyAvg;
     const emergencyScore = Math.min(15, (emergencyMonths / 6) * 15);
     
     // 3. Insurance (Max 15)
     const insuranceScore = profile?.assets > 0 ? 15 : 5; 

     // 4. Investments (Max 15)
     const investmentScore = profile?.risk_profile === 'aggressive' || profile?.risk_profile === 'moderate' ? 15 : 8;

     // 5. Debt Health (Max 15)
     let debtScore = 15;
     if (profile?.assets && profile.assets > 0) {
        const debtRatio = profile.debt / profile.assets;
        debtScore = Math.max(0, 15 - (debtRatio * 15));
     } else if (profile?.debt > 0) {
        debtScore = 0;
     }

     // 6. Tax & Retirement (Max 15 combined)
     const taxScore = 8;
     const retirementScore = 7;

     dimensions = [
       { name: 'Savings Rate', score: Math.round(savingsScore), icon: TrendingUp, color: 'text-emerald-500' },
       { name: 'Emergency', score: Math.round(emergencyScore), icon: ShieldCheck, color: 'text-red-500' },
       { name: 'Investments', score: investmentScore, icon: Zap, color: 'text-purple-500' },
       { name: 'Debt Health', score: Math.round(debtScore), icon: Scale, color: 'text-slate-500' },
       { name: 'Insurance', score: insuranceScore, icon: HeartPulse, color: 'text-indigo-500' },
       { name: 'Retirement', score: retirementScore, icon: Target, color: 'text-orange-500' },
     ];

     healthScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground relative">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 overflow-y-auto font-sans relative">
        <DashboardHeader 
          title="Overview" 
          onOpenSidebar={() => setSidebarOpen(true)} 
        />

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20 relative">
          {/* Welcome Panel */}
          <div className="bg-gradient-to-r from-primary to-indigo-800 rounded-xl p-8 md:p-12 text-white shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 group min-h-[220px]">
            <div className="absolute -top-24 -right-10 opacity-10 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <Activity className="w-96 h-96" />
            </div>
            <div className="relative z-10 flex-1 min-w-0 text-center md:text-left">
              <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-3 tracking-tight">Welcome back, {user?.user_metadata?.username || user?.email?.split('@')[0]}!</h2>
              <p className="text-indigo-100 max-w-xl text-sm md:text-lg font-medium opacity-90 leading-relaxed mx-auto md:mx-0">Your AI mentor is ready. Track expenses, analyze your spending, and reach financial freedom.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative z-10 w-full md:w-auto shrink-0 mt-2 md:mt-0 items-center">
              <ReceiptScanner onScanComplete={(data) => {
                 setScanData(data);
                 setIsModalOpen(true);
              }} />
              <button 
                onClick={() => { setScanData(null); setIsModalOpen(true); }} 
                className="w-full sm:w-auto inline-flex relative z-10 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 px-6 py-3 rounded-md font-bold transition-all shadow-sm justify-center items-center gap-2 group whitespace-nowrap"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Add Manual
              </button>
            </div>
          </div>


          {showWizard && (
             <HealthScoreWizard 
                userId={user?.id || ''} 
                onClose={() => setShowWizard(false)} 
                onComplete={() => {
                   setShowWizard(false);
                   fetchTransactions(); // This also fetches profile
                }} 
             />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Monthly Expenses
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-md"><TrendingDown className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-4xl font-black text-foreground tracking-tight">₹{totalExpense.toLocaleString()}</div>
                <div className="text-sm font-bold text-muted-foreground mt-2">Spent this month</div>
              </div>
            </div>
            
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Monthly Income
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-md"><TrendingUp className="w-5 h-5" /></div>
              </div>
              <div>
                <div className="text-4xl font-black text-foreground tracking-tight">₹{totalIncome.toLocaleString()}</div>
                <div className="text-sm font-bold text-muted-foreground mt-2">Earned this month</div>
              </div>
            </div>

            <div className={`bg-card rounded-lg p-8 border border-border shadow-sm flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer ${calculatingHealth ? 'opacity-70 scale-[0.99]' : ''}`} onClick={() => setShowWizard(true)}>
              <div className="absolute top-0 left-0 w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500 h-full"></div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">AI Health Score</div>
                <div className={`bg-purple-500/10 text-purple-500 p-2.5 rounded-md ${calculatingHealth ? 'animate-spin' : 'group-hover:animate-bounce'} transition-all`}>
                  {calculatingHealth ? <Zap className="w-5 h-5 fill-purple-500" /> : <Sparkles className="w-5 h-5" />}
                </div>
              </div>
              <div className="mt-1">
                {calculatingHealth ? (
                   <div className="text-sm font-bold text-purple-500 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      Analyzing data...
                   </div>
                ) : (
                   <div className="flex flex-col">
                      <div className="text-4xl font-black text-foreground tracking-tight">{healthScore} <span className="text-lg text-muted-foreground font-bold">{healthScore !== 'N/A' && '/ 100'}</span></div>
                      {typeof healthScore === 'number' && healthScore < 70 && (
                         <div className="mt-2 text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full inline-block w-fit">
                            Coach Prompt: Set Emergency Fund in Wizard (+15 pts)
                         </div>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <DashboardCharts transactions={transactions} />
          </div>

          <div className="bg-card border border-border rounded-xl p-4 md:p-8 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-2xl text-foreground tracking-tight">Recent Transactions</h3>
                <button className="text-primary font-bold text-sm hover:underline">View All Activity</button>
             </div>
             <div className="flex-1 overflow-y-auto pr-2">
                <TransactionList 
                  transactions={transactions} 
                  onRefresh={fetchTransactions}
                  onEdit={(t) => { setScanData(t); setIsModalOpen(true); }}
                />
             </div>
          </div>
        </div>
      </main>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTransactions} initialData={scanData} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

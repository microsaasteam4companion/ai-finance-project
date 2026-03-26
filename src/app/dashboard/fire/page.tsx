'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LogOut, Home, PieChart, Sparkles, User as UserIcon, Activity, Rocket, TrendingUp, Target, Calculator, Lock, CreditCard, CheckCircle2, ShieldCheck, ArrowRight, ArrowDownRight, Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';

export default function FirePlannerPage() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();

  // FIRE Inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(50);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentCorpus, setCurrentCorpus] = useState<number>(500000); // 5L baseline default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const fireData = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    
    // 1. Calculate future monthly expenses at retirement (adjusted for inflation)
    const futureMonthlyExpense = monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetire);
    
    // 2. Calculate Required Corpus (Standard 4% rule)
    const safeWithdrawalRate = 0.04;
    const requiredCorpus = (futureMonthlyExpense * 12) / safeWithdrawalRate;

    // 3. Calculate Monthly SIP Required
    const monthlyRate = expectedReturn / 100 / 12;
    const nMonths = yearsToRetire * 12;
    const fvCurrent = currentCorpus * Math.pow(1 + expectedReturn/100, yearsToRetire);
    const deficitToTarget = Math.max(0, requiredCorpus - fvCurrent);
    
    let requiredSip = 0;
    if (monthlyRate > 0 && nMonths > 0) {
       requiredSip = deficitToTarget / ((Math.pow(1 + monthlyRate, nMonths) - 1) / monthlyRate * (1 + monthlyRate));
    }

    // 4. Generate Detailed Roadmap Milestones
    const roadmap = [];
    let runningCorpus = currentCorpus;
    const annualSip = requiredSip * 12;

    const thresholds = [0.25, 0.5, 0.75, 1];
    let nextThresholdIndex = 0;

    for (let i = 0; i <= yearsToRetire; i++) {
       const age = currentAge + i;
       if (i > 0) {
          runningCorpus = runningCorpus * (1 + expectedReturn/100) + annualSip;
       }

       if (nextThresholdIndex < thresholds.length && runningCorpus >= requiredCorpus * thresholds[nextThresholdIndex]) {
          roadmap.push({
             type: 'milestone',
             label: `${thresholds[nextThresholdIndex] * 100}% Milestone`,
             age: age,
             corpus: runningCorpus,
             icon: CheckCircle2,
             color: 'text-emerald-500'
          });
          nextThresholdIndex++;
       }

       if (i === Math.floor(yearsToRetire / 2)) {
          roadmap.push({
             type: 'insurance',
             label: 'Term Plan Portfolio Review',
             age: age,
             desc: 'Ensure coverage is 15x current liability.',
             icon: ShieldCheck,
             color: 'text-indigo-500'
          });
       }
    }

    // Chart Data (Yearly)
    const chartData = [];
    let chartCorpus = currentCorpus;
    for (let i = 0; i <= yearsToRetire; i++) {
       if (i > 0) chartCorpus = chartCorpus * (1 + expectedReturn/100) + annualSip;
       chartData.push({ age: `Age ${currentAge + i}`, corpus: Math.round(chartCorpus) });
    }

    return {
      futureExpense: Math.round(futureMonthlyExpense),
      targetCorpus: Math.round(requiredCorpus),
      requiredSip: Math.round(requiredSip),
      chartData,
      roadmap,
      currentAllocation: { equity: 80, debt: 20 },
      finalAllocation: { equity: 40, debt: 60 }
    };
  }, [currentAge, retirementAge, monthlyExpenses, inflationRate, expectedReturn, currentCorpus]);

  if (authLoading || (!user)) {
    return <div className="flex h-screen bg-slate-50 items-center justify-center"><div className="w-12 h-12 bg-indigo-200 rounded-full animate-pulse" /></div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 relative">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 overflow-y-auto w-full font-sans relative">
        <DashboardHeader 
          title="FIRE Planner" 
          subtitle="Financial Independence, Retire Early."
          badge="Early Access"
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 relative">

          {tier !== 'premium' && (
             <div className="absolute inset-x-0 top-0 z-50 rounded-3xl backdrop-blur-md bg-white/60 flex flex-col items-center justify-center border border-slate-200 mt-8 mb-20 shadow-xl overflow-hidden mx-8 h-[600px]">
                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-100">
                   <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                      <Lock className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium Feature</h2>
                   <p className="text-slate-500 mb-8 font-medium">The FIRE Planning Engine mathematically simulates multi-decade asset compounding. Upgrade to Premium to map your retirement.</p>
                   <button onClick={() => router.push('/dashboard/billing')} className="bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-700 transition w-full shadow-lg shadow-orange-600/30">Unlock Premium (₹199)</button>
                </div>
             </div>
          )}

          <div className={`${tier !== 'premium' ? 'opacity-30 pointer-events-none blur-sm select-none' : ''} space-y-8`}>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs Panel */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
                   <div className="flex items-center gap-2 mb-6 text-slate-800">
                      <Calculator className="w-5 h-5 text-orange-500" />
                      <h3 className="font-bold text-lg">Your Variables</h3>
                   </div>

                   <div className="space-y-5">
                      <div>
                         <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Current Age</span> <span className="text-orange-600 font-bold">{currentAge}</span>
                         </label>
                         <input type="range" min="20" max="60" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} className="w-full accent-orange-500" />
                      </div>
                      <div>
                         <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                            <span>Retirement Age</span> <span className="text-orange-600 font-bold">{retirementAge}</span>
                         </label>
                         <input type="range" min={currentAge+1} max="75" value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} className="w-full accent-orange-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Monthly Expenses (₹)</label>
                         <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1.5">Existing Corpus (₹)</label>
                         <input type="number" value={currentCorpus} onChange={e => setCurrentCorpus(Number(e.target.value))} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Return Rate (%)</label>
                         <input type="number" value={expectedReturn} onChange={e => setExpectedReturn(Number(e.target.value))} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1.5">Inflation Rate (%)</label>
                         <input type="number" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                   </div>
                </div>

                {/* Outputs Panel */}
                <div className="lg:col-span-8 space-y-8">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20">
                         <div className="text-orange-100 text-sm font-medium mb-1">Target FIRE Corpus</div>
                         <div className="text-3xl font-bold tracking-tight">₹{(fireData.targetCorpus / 10000000).toFixed(2)} Cr</div>
                         <div className="text-orange-200 text-xs mt-2 bg-orange-900/20 w-fit px-2 py-1 rounded-md">Adjusted for {inflationRate}% inflation</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                         <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5"><Target className="w-4 h-4"/> Target Monthly SIP</div>
                         <div className="text-3xl font-bold text-slate-900 tracking-tight">₹{fireData.requiredSip.toLocaleString()}</div>
                         <div className="text-slate-400 text-xs mt-2 font-medium">To retire at {retirementAge} securely.</div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                         <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Daily Expense at {retirementAge}</div>
                         <div className="text-3xl font-bold text-slate-900 tracking-tight">₹{Math.round(fireData.futureExpense / 30).toLocaleString()}</div>
                         <div className="text-slate-400 text-xs mt-2 font-medium">Will cost ₹{fireData.futureExpense.toLocaleString()}/mo!</div>
                      </div>
                   </div>

                   <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">Corpus Growth Trajectory</h3>
                      <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={fireData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                             <defs>
                               <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <XAxis dataKey="age" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/10000000).toFixed(1)}Cr`} width={80} />
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <Tooltip 
                               formatter={(value: any) => `₹${(Number(value) / 10000000).toFixed(2)} Cr`}
                               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                             />
                             <Area type="monotone" dataKey="corpus" name="Projected Corpus" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCorpus)" />
                           </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Roadmap Section */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                   <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-8">AI Freedom Roadmap</h3>
                   <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-100">
                      {fireData.roadmap.map((item, i) => (
                         <div key={i} className="relative flex items-start gap-6 group">
                            <div className={`shrink-0 w-11 h-11 rounded-2xl border-4 border-white shadow-md flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 ${item.type === 'milestone' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                               <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="font-black text-lg text-slate-800 tracking-tight">{item.label}</span>
                                  <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg uppercase tracking-widest">Age {item.age}</span>
                               </div>
                               {item.desc && <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>}
                               {item.corpus && <p className="text-sm text-emerald-600 font-black mt-1">Target: ₹{(item.corpus / 10000000).toFixed(2)} Cr</p>}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Asset Allocation Section */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                   <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-2">AI Glide Path Strategy</h3>
                   <p className="text-slate-500 font-medium mb-10">Shifting from growth to stability as you approach retirement.</p>
                   
                   <div className="space-y-12">
                      <div>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Initial Strategy (Age {currentAge})</div>
                         <div className="w-full h-14 bg-slate-50 rounded-[1.25rem] overflow-hidden flex p-1.5 gap-1.5 shadow-inner border border-slate-100">
                            <div className="h-full bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm" style={{ width: `${fireData.currentAllocation.equity}%` }}>EQUITY {fireData.currentAllocation.equity}%</div>
                            <div className="h-full bg-orange-500 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm" style={{ width: `${fireData.currentAllocation.debt}%` }}>DEBT {fireData.currentAllocation.debt}%</div>
                         </div>
                      </div>

                      <div className="flex justify-center relative">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-slate-100"></div>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-lg relative z-10 animate-bounce">
                            <ArrowDownRight className="w-6 h-6 text-slate-400" />
                         </div>
                      </div>

                      <div>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Retirement Strategy (Age {retirementAge})</div>
                         <div className="w-full h-14 bg-slate-50 rounded-[1.25rem] overflow-hidden flex p-1.5 gap-1.5 shadow-inner border border-slate-100">
                            <div className="h-full bg-indigo-600 filter saturate-[0.5] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm" style={{ width: `${fireData.finalAllocation.equity}%` }}>EQUITY {fireData.finalAllocation.equity}%</div>
                            <div className="h-full bg-orange-500 filter saturate-[0.5] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm" style={{ width: `${fireData.finalAllocation.debt}%` }}>DEBT {fireData.finalAllocation.debt}%</div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-12 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                         <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                         </div>
                         <span className="font-black text-indigo-900 tracking-tight">AI STRATEGY INSIGHT</span>
                      </div>
                      <p className="text-sm text-indigo-800/80 font-bold leading-relaxed relative z-10">Reducing equity exposure to 40% ensures your corpus is protected from sequence-of-return risk during early withdrawal years. This "Glide Path" maintains wealth while ensuring liquid cashflow.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

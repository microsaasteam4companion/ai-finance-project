'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, Shield, Zap, Sparkles, AlertTriangle, ArrowRight, Loader2, CreditCard, User, LogOut, Home, PieChart, Activity, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import Script from 'next/script';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Suspense } from 'react';

function BillingContent() {
  const { user, loading: authLoading, tier, refreshTier } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) router.push('/login');
    
    // Handle Dodo Payment Success
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');

    if (status === 'succeeded' && paymentId) {
       const toastId = 'payment-success-toast';
       toast.success('Payment detected! Finalizing your upgrade...', { id: toastId, duration: 2000 });
       
       const verifyAndRefresh = async () => {
          try {
             // Direct verification call
             const res = await fetch('/api/dodo/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, userId: user?.id })
             });
             const data = await res.json();
             
             if (data.success) {
                await refreshTier();
                toast.success('Welcome to FinGenius Premium! 🎉', { id: toastId });
                router.replace('/dashboard/billing');
                return true;
             }
          } catch (err) {
             console.error('Verification failed, falling back to polling:', err);
          }
          return false;
       };

       // Initial attempt
       verifyAndRefresh().then(success => {
          if (!success) {
             // Polling fallback
             const interval = setInterval(async () => {
                const updated = await refreshTier();
                if (updated === 'premium') {
                   toast.success('Welcome to FinGenius Premium! 🎉', { id: toastId });
                   clearInterval(interval);
                   router.replace('/dashboard/billing');
                }
             }, 3000);
             setTimeout(() => clearInterval(interval), 30000);
          }
       });
    }
  }, [user, authLoading, searchParams, refreshTier, router]);

  const isPremium = tier === 'premium';

  const handleUpgrade = async () => {
    if (!user || isPremium) return;
    setIsProcessing(true);
    const toastId = toast.loading('Initiating secure checkout...');

    try {
      const response = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      window.location.href = data.checkout_url;
    } catch(err: any) {
      toast.error(err.message, { id: toastId });
      setIsProcessing(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading || !user || !mounted) {
    return <div className="flex h-screen bg-slate-50 items-center justify-center"><div className="w-12 h-12 bg-indigo-200 rounded-full animate-pulse" /></div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 relative">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 overflow-y-auto font-sans relative">
        <DashboardHeader 
          title="Account Billing" 
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col items-center pb-20 relative">

      <div className="w-full max-w-5xl mx-auto mb-10 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <User className="w-8 h-8" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-800">{user.email}</h2>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-slate-500">Current Plan:</span>
                  {isPremium ? (
                     <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs flex items-center gap-1"><Check className="w-3 h-3"/> Premium Wealth</span>
                  ) : (
                     <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-xs">Free Tier</span>
                  )}
               </div>
            </div>
         </div>
         {isPremium && (
            <div className="mt-4 md:mt-0 flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
               <Shield className="w-5 h-5" /> Your account is fully unlocked.
            </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
         
         {/* Free Tier Card */}
         <div className={`bg-white rounded-[2rem] p-10 border ${!isPremium ? 'border-slate-300 shadow-xl shadow-slate-200/50' : 'border-slate-200 shadow-sm opacity-70'} flex flex-col relative transition-all`}>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-1 mb-8">
               <span className="text-5xl font-extrabold text-slate-900">₹0</span>
               <span className="text-slate-500 font-medium">/forever</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-center gap-3 text-slate-600 font-medium"><Check className="w-5 h-5 text-indigo-500 shrink-0"/> Expense tracking & Receipt OCR</li>
               <li className="flex items-center gap-3 text-slate-600 font-medium"><Check className="w-5 h-5 text-indigo-500 shrink-0"/> Basic AI Insights</li>
            </ul>
            <button disabled className="w-full py-4 rounded-xl bg-slate-50 text-slate-400 font-bold border border-slate-200 cursor-not-allowed">
               {isPremium ? 'Included' : 'Currently Active'}
            </button>
         </div>

         {/* Premium Tier Card */}
         <div className={`rounded-[2rem] p-10 flex flex-col relative transition-all z-10 ${isPremium ? 'bg-white border border-slate-200 shadow-sm' : 'bg-gradient-to-b from-indigo-900 to-indigo-950 border border-indigo-700 shadow-2xl shadow-indigo-900/30'}`}>
            {isPremium && <div className="absolute inset-0 bg-white/40 z-20 pointer-events-none rounded-[2rem] backdrop-blur-[1px]"></div>}
            
            <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${isPremium ? 'text-slate-800' : 'text-white'}`}><Sparkles className={`w-6 h-6 ${isPremium ? 'text-indigo-400' : 'text-orange-400'}`}/> Premium Tier</h3>
            <div className="flex items-baseline gap-1 mb-8">
               <span className={`text-5xl font-extrabold ${isPremium ? 'text-slate-900' : 'text-white'}`}>₹199</span>
               <span className={`font-medium ${isPremium ? 'text-slate-500' : 'text-indigo-300'}`}>/month</span>
            </div>
            
            <ul className={`space-y-3 mb-10 flex-1 relative ${isPremium ? 'text-slate-600' : 'text-indigo-100 z-10'}`}>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={isPremium ? 'text-slate-700' : 'text-indigo-100'}>Basic AI Insights & Dashboard</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={isPremium ? 'text-slate-700' : 'text-indigo-100'}>Advanced Budgeting</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={`font-bold ${isPremium ? 'text-slate-800' : 'text-white'}`}>FIRE Planner</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={`font-bold ${isPremium ? 'text-slate-800' : 'text-white'}`}>Tax Wizard</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={`font-bold ${isPremium ? 'text-slate-800' : 'text-white'}`}>Portfolio X-Ray</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={`font-bold ${isPremium ? 'text-slate-800' : 'text-white'}`}>Couple's Planner</span></li>
               <li className="flex items-center gap-3 font-medium"><Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-emerald-500' : 'text-emerald-400'}`}/> <span className={`font-bold ${isPremium ? 'text-slate-800' : 'text-white'}`}>Priority Support</span></li>
            </ul>
            
            <button 
              onClick={handleUpgrade} 
              disabled={isProcessing || isPremium}
              className={`w-full relative z-30 py-4 rounded-xl font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${isPremium ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-900 shadow-emerald-500/25 hover:scale-[1.02]'}`}
            >
               {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isPremium ? 'Active Subscription' : 'Upgrade Now'} {!isPremium && <ArrowRight className="w-5 h-5"/>}</>}
            </button>
         </div>

           </div>

        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-slate-50 items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></div>}>
       <BillingContent />
    </Suspense>
  );
}

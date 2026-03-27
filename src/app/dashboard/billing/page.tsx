'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Check, Shield, Zap, Sparkles, AlertTriangle, ArrowRight, Loader2, CreditCard, User } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardHeader from '@/components/DashboardHeader';

function BillingContent() {
  const { user, loading: authLoading, tier, refreshTier } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    
    // Handle Dodo Payment Success
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');

    if (status === 'succeeded' && paymentId && user) {
       setShowSuccess(true);
       const toastId = 'payment-success-toast';
       toast.success('Payment detected! Finalizing your upgrade...', { id: toastId, duration: 2000 });
       
       const verifyAndRefresh = async () => {
          try {
             const res = await fetch('/api/dodo/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, userId: user.uid })
             });
             const data = await res.json();
             
             if (data.success) {
                await refreshTier();
                toast.success('Welcome to FinGenius Premium! 🎉', { id: toastId });
                // We keep showSuccess as true to show the UI
                return true;
             }
          } catch (err) {
             console.error('Verification failed, falling back to polling:', err);
          }
          return false;
       };

       verifyAndRefresh().then(success => {
          if (!success) {
             const interval = setInterval(async () => {
                const updated = await refreshTier();
                if (updated === 'premium') {
                   toast.success('Welcome to FinGenius Premium! 🎉', { id: toastId });
                   clearInterval(interval);
                }
             }, 3000);
             setTimeout(() => clearInterval(interval), 30000);
          }
       });
    }
  }, [user, searchParams, refreshTier]);

  const isPremium = tier === 'premium';

  const handleUpgrade = async () => {
    if (!user || isPremium) return;
    setIsProcessing(true);
    const toastId = toast.loading('Initiating secure checkout...');

    try {
      const response = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      window.location.href = data.checkout_url;
    } catch(err: any) {
      toast.error(err.message, { id: toastId });
      setIsProcessing(false);
    }
  };

  if (authLoading || !user || !mounted) {
    return (
       <div className="flex w-full items-center justify-center min-h-[400px]">
          <div className="animate-pulse w-12 h-12 bg-indigo-200 rounded-full" />
       </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto font-sans relative">
      <DashboardHeader title="Account Billing" />

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

        {/* Success Modal Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full shadow-2xl border border-indigo-100 relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Sparkles className="w-10 h-10 text-emerald-600" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Upgrade Successful!</h2>
                <p className="text-slate-600 text-lg mb-8">Billing is complete and your premium features are now unlocked.</p>
                
                <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">You now have access to:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2 text-slate-700 font-medium">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      FIRE Planner
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 font-medium">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      Tax Wizard
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 font-medium">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      Portfolio X-Ray
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 font-medium">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      Couple's Planner
                    </li>
                  </ul>
                </div>
                
                <button 
                  onClick={() => {
                    setShowSuccess(false);
                    router.replace('/dashboard/billing');
                  }}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={null}>
      <BillingContent />
    </Suspense>
  );
}

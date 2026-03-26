'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/db';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Home, PieChart, Sparkles, User as UserIcon, Activity, Rocket, UserPlus, Scale, TrendingUp, ShieldCheck, AlertTriangle, Users, CreditCard, Lock, Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import JointOptimizer from '@/components/JointOptimizer';
import DashboardHeader from '@/components/DashboardHeader';

export default function ProfilePage() {
  const { user, loading: authLoading, tier } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({
     assets: 0, debt: 0, emergency_fund: 0, risk_profile: 'moderate', household_id: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Risk Profiler Quiz State
  const [quizScore, setQuizScore] = useState(5); 

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    if (!user) return;
     setLoading(true);
     try {
       // Try to fetch profile
       const data = await getProfile(user.uid);
       if (data) {
          setProfile(data);
       } else {
          // If no profile exists, create a default one
          const defaultProfile = { id: user.uid, assets: 0, debt: 0, emergency_fund: 0, risk_profile: 'moderate', household_id: crypto.randomUUID() };
          await updateProfile(user.uid, defaultProfile);
          setProfile(defaultProfile);
       }
     } catch (error) {
       console.error('Error fetching profile:', error);
     }
     setLoading(false);
  };

  const handleSaveProfile = async () => {
     if (!user) return;
     setLoading(true);
     try {
       await updateProfile(user.uid, {
         assets: profile.assets,
         debt: profile.debt,
         emergency_fund: profile.emergency_fund,
         risk_profile: getRiskCategory(quizScore)
       });
       toast.success("Wealth Profile saved!");
       fetchProfile();
     } catch (error: any) {
       toast.error("Failed to save profile: " + error.message);
     }
     setLoading(false);
  };

  const getRiskCategory = (score: number) => {
     if (score <= 3) return 'conservative';
     if (score <= 6) return 'moderate';
     return 'aggressive';
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (authLoading || (!user && !loading)) {
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
          title="Wealth Profile" 
          subtitle="Configure your assets and risk tolerance."
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20 relative">
           
          {tier !== 'premium' && (
             <div className="absolute inset-0 z-50 rounded-3xl backdrop-blur-md bg-white/60 flex flex-col items-center justify-center border border-slate-200 mt-8 mb-20 shadow-xl overflow-hidden mx-8">
                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-100">
                   <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                      <Lock className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h2>
                   <p className="text-slate-500 mb-8 font-medium">Wealth Profiling and Couple's Sync are advanced coordination tools. Upgrade to Premium to unlock them.</p>
                   <button onClick={() => router.push('/dashboard/billing')} className="bg-rose-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-rose-700 transition w-full shadow-lg shadow-rose-600/30">Unlock Premium (₹199)</button>
                </div>
             </div>
          )}

           <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${tier !== 'premium' ? 'opacity-30 pointer-events-none blur-sm select-none' : ''}`}>
              {/* Profile Config */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2"><Scale className="w-5 h-5 text-teal-600"/> Financial Status</h3>
                 
                 <div className="space-y-5">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Liquid Assets (₹)</label>
                       <input type="number" value={profile.assets} onChange={e => setProfile({...profile, assets: Number(e.target.value)})} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Mutual funds, stocks, savings" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Debt / Loans (₹)</label>
                       <input type="number" value={profile.debt} onChange={e => setProfile({...profile, debt: Number(e.target.value)})} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-400 outline-none" placeholder="Credit cards, personal loans" />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1.5">Emergency Fund (₹)</label>
                       <input type="number" value={profile.emergency_fund} onChange={e => setProfile({...profile, emergency_fund: Number(e.target.value)})} className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Liquid cash assigned for emergencies" />
                    </div>
                    <button onClick={handleSaveProfile} disabled={loading} className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl mt-4 hover:bg-teal-700 transition">
                       Update Health Profilers
                    </button>
                 </div>
              </div>

              {/* Risk Profiler & Couples */}
              <div className="space-y-8">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                     <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2 relative z-10"><ShieldCheck className="w-5 h-5 text-indigo-600"/> Risk Profiler Questionnaire</h3>
                     <p className="text-sm text-slate-500 mb-6 relative z-10">Slide to indicate your market behavior. Groq uses this to build SIP recommendations.</p>
                     
                     <div className="space-y-6 relative z-10">
                        <div>
                           <label className="flex flex-col text-sm font-medium text-slate-700 mb-2">
                              <span>Market drops 20% tomorrow. You:</span>
                              <span className="text-indigo-600 font-bold mt-1 uppercase text-xs">Score: {quizScore}/10 ({getRiskCategory(quizScore)})</span>
                           </label>
                           <input type="range" min="1" max="10" value={quizScore} onChange={e => setQuizScore(Number(e.target.value))} className="w-full accent-indigo-600" />
                           <div className="flex justify-between text-xs text-slate-400 font-medium mt-1">
                              <span>Panic Sell</span>
                              <span>Hold & Buy More</span>
                           </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                           <h4 className="font-bold text-indigo-900 mb-2">Automated SIP Suggestion</h4>
                           {getRiskCategory(quizScore) === 'conservative' && <p className="text-sm text-indigo-800">Your profile suggests safety. **70% Fixed Income / 30% Equity**. Suggesting Liquid Funds and Bluechip MFs.</p>}
                           {getRiskCategory(quizScore) === 'moderate' && <p className="text-sm text-indigo-800">Your profile is balanced. **50% Equity / 50% Debt**. Suggesting Flexi Cap MFs and Nifty50 Indices.</p>}
                           {getRiskCategory(quizScore) === 'aggressive' && <p className="text-sm text-indigo-800">Your profile seeks growth. **80% Equity / 20% Debt**. Suggesting Small Cap MFs and Direct Equities.</p>}
                        </div>
                     </div>
                  </div>

                  {/* Couples Planner Sync Section */}
                  <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-all"></div>
                     <Users className="w-12 h-12 text-white/10 absolute -right-2 -bottom-2" />
                     <h3 className="font-bold text-lg mb-2 flex items-center justify-center sm:justify-start gap-2 relative z-10"><UserPlus className="w-5 h-5"/> Couple's Sync Planner</h3>
                     <p className="text-rose-100 text-sm mb-6 relative z-10">Sync your partner's net worth to unlock joint optimization (HRA/NPS splits) and household fire tracking.</p>
                     
                     <div className="space-y-4 relative z-10">
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                           <div>
                              <div className="text-[10px] text-rose-200 uppercase font-black tracking-widest mb-1 opacity-80">Your Household ID</div>
                              <div className="font-mono text-lg font-black tracking-wider">{profile.household_id ? profile.household_id.substring(0, 8).toUpperCase() : 'GENERATING...'}</div>
                           </div>
                           <button className="bg-white text-rose-600 px-5 py-2.5 rounded-xl font-black text-xs shadow-xl hover:scale-105 transition-transform" onClick={() => {
                              navigator.clipboard.writeText(profile.household_id);
                              toast.success('Household ID copied!');
                           }}>COPY ID</button>
                        </div>

                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder="Paste Partner's ID" 
                              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm placeholder:text-rose-200/50 outline-none focus:bg-white/20 transition-all"
                              id="partner-id-input"
                           />
                           <button 
                              className="bg-rose-900/40 hover:bg-rose-900/60 text-white px-6 py-3.5 rounded-xl font-bold text-sm border border-white/10 transition-all"
                              onClick={async () => {
                                 const idInput = (document.getElementById('partner-id-input') as HTMLInputElement).value;
                                 if (!idInput) return toast.error('Please enter an ID');
                                 
                                 setLoading(true);
                                 // Simple Mock Sync: Update household_id to the provided one
                                 try {
                                   await updateProfile(user.uid, { household_id: idInput });
                                   toast.success('Household Synchronized!');
                                   fetchProfile();
                                 } catch (error: any) {
                                   toast.error('Sync failed: ' + error.message);
                                 }
                                 setLoading(false);
                              }}
                           >
                              SYNC
                           </button>
                        </div>
                     </div>

                     {profile.household_id && (
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                           <div className="shrink-0 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-rose-100" />
                           </div>
                           <div className="flex-1">
                              <div className="text-[10px] font-black uppercase tracking-widest text-rose-200 mb-0.5">Joint Household Status</div>
                              <div className="text-xl font-black tracking-tight">ACTIVE CONNECTION</div>
                           </div>
                           <button className="text-[10px] font-black uppercase text-rose-200 bg-rose-900/40 px-3 py-1.5 rounded-lg hover:bg-rose-900/60 transition-colors" onClick={async () => {
                              if (!confirm('Disconnect from Household?')) return;
                              const newId = crypto.randomUUID();
                              await updateProfile(user?.uid || '', { household_id: newId });
                              fetchProfile();
                              toast.success('Disconnected');
                           }}>RESET</button>
                        </div>
                     )}
                  </div>
              </div>
           </div>
           {profile.household_id && user && <JointOptimizer householdId={profile.household_id} currentUserId={user.uid} />}
        </div>
      </main>
    </div>
  );
}

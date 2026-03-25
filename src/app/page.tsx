'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, TrendingUp, BrainCircuit, ShieldCheck, Zap, ArrowRight, Check, Star, Users, Briefcase, BarChart3, PieChart } from 'lucide-react';
import { Suspense } from 'react';

function HomeContent() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-600/20 bg-indigo-600">
              <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FinGenius</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
            <div className="absolute top-[40%] left-[70%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold mb-8 animate-bounce">
              <Star className="w-3 h-3 fill-indigo-600" />
              <span>Trusted by 10,000+ Smart Investors</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Manage Wealth with <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                Artificial Intelligence.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              FinGenius is your elite AI wealth mentor. Optimize taxes, plan your early retirement, and scan portfolios for hidden risks—all in one premium platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
              >
                Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg text-slate-700 hover:bg-slate-100 transition-all bg-white border border-slate-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Sophisticated Tools for Modern Finance</h2>
              <p className="text-lg text-slate-500 font-medium">Built with cutting-edge AI to give you the upper hand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart AI Insights",
                  desc: "Our LLM-powered engine analyzes your spending patterns to spot savings opportunities you didn't know existed.",
                  icon: <BrainCircuit />,
                  color: "bg-purple-50 text-purple-600"
                },
                {
                  title: "FIRE Roadmap",
                  desc: "Calculate exactly when you can retire early with our sophisticated Financial Independence (FIRE) calculator.",
                  icon: <TrendingUp />,
                  color: "bg-blue-50 text-blue-600"
                },
                {
                  title: "Tax Wizard",
                  desc: "Scan your Form 16 or salary slips to instantly compare Old vs New tax regimes and maximize deductions.",
                  icon: <BarChart3 />,
                  color: "bg-emerald-50 text-emerald-600"
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/60 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${f.color} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/5 -z-10" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4 block">Transparent Pricing</span>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6">Choose Your Path to Freedom</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-slate-200 shadow-xl flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <PieChart className="w-32 h-32 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Essential</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-slate-900">₹0</span>
                  <span className="text-slate-500 font-bold">/forever</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1 relative z-10">
                  <li className="flex items-center gap-3 text-slate-600 font-bold"><Check className="w-5 h-5 text-indigo-500 shrink-0"/> Core Expense Tracking</li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold"><Check className="w-5 h-5 text-indigo-500 shrink-0"/> Basic AI Insights</li>
                  <li className="flex items-center gap-3 text-slate-400 font-medium line-through decoration-slate-300">Advanced AI Wealth Tools</li>
                </ul>
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full py-5 rounded-2xl bg-slate-100 text-slate-800 font-black text-lg hover:bg-slate-200 transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Premium Tier */}
              <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-12 border border-slate-700 shadow-2xl flex flex-col relative overflow-hidden group scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity">
                  <Zap className="w-32 h-32 text-white" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-6">
                  Recommended
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Premium Wealth</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-white">₹199</span>
                  <span className="text-indigo-300 font-bold">/month</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1 relative z-10">
                  <li className="flex items-center gap-3 text-white font-bold"><Check className="w-5 h-5 text-emerald-400 shrink-0"/> Tax Wizard (Regime Tool)</li>
                  <li className="flex items-center gap-3 text-white font-bold"><Check className="w-5 h-5 text-emerald-400 shrink-0"/> FIRE Retirement Planner</li>
                  <li className="flex items-center gap-3 text-white font-bold"><Check className="w-5 h-5 text-emerald-400 shrink-0"/> Portfolio X-Ray Scan</li>
                  <li className="flex items-center gap-3 text-white font-bold"><Check className="w-5 h-5 text-emerald-400 shrink-0"/> AI Wealth Assistant</li>
                </ul>
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full py-5 rounded-2xl bg-indigo-500 text-white font-black text-lg hover:bg-indigo-400 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/30 relative z-20"
                >
                  Unlock Everything
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-white border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800">FinGenius</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">© 2024 FinGenius — AI Financial Intelligence for the next generation.</p>
            <div className="flex items-center gap-6">
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Users className="w-5 h-5"/></a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Briefcase className="w-5 h-5"/></a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><ShieldCheck className="w-5 h-5"/></a>
            </div>
          </div>
        </footer>
      </main>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

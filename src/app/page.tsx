'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, TrendingUp, BrainCircuit, ShieldCheck, Zap, ArrowRight, Check, Star, Users, Briefcase, BarChart3, PieChart } from 'lucide-react';
import { Suspense, useState } from 'react';
import DashboardPreview from '@/components/DashboardPreview';
import { MobileNavButton, MobileNavDrawer } from '@/components/MobileNav';
import FAQ from '@/components/FAQ';
import About from '@/components/About';

import { ThemeToggle } from '@/components/ThemeToggle';

function HomeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-none overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">FinGenius</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>


          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-none font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                Sign Up
              </button>
            </div>
            <MobileNavButton 
              isOpen={isMobileNavOpen} 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} 
            />
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
            <div className="absolute top-[40%] left-[70%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
              Manage Wealth with <br className="hidden lg:block" />
              <span className="text-primary">
                Artificial Intelligence.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              FinGenius is your elite AI wealth mentor. Optimize taxes, plan your early retirement, and scan portfolios for hidden risks—all in one premium platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-none font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group"
              >
                Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
        <DashboardPreview />

        {/* Features Section */}
        <section id="features" className="py-24 bg-background border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Sophisticated Tools for Modern Finance</h2>
              <p className="text-lg text-muted-foreground font-medium">Built with cutting-edge AI to give you the upper hand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart AI Insights",
                  desc: "Our LLM-powered engine analyzes your spending patterns to spot savings opportunities you didn't know existed.",
                  icon: <BrainCircuit />,
                  color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                },
                {
                  title: "FIRE Roadmap",
                  desc: "Calculate exactly when you can retire early with our sophisticated Financial Independence (FIRE) calculator.",
                  icon: <TrendingUp />,
                  color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                },
                {
                  title: "Tax Wizard",
                  desc: "Scan your Form 16 or salary slips to instantly compare Old vs New tax regimes and maximize deductions.",
                  icon: <BarChart3 />,
                  color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-none bg-card border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                  <div className={`w-14 h-14 rounded-none flex items-center justify-center mb-6 shadow-sm ${f.color} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Transparent Pricing</span>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-6">Choose Your Path to Freedom</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="bg-card rounded-none p-10 lg:p-12 border border-border shadow-xl flex flex-col relative overflow-hidden group">
                <h3 className="text-2xl font-bold text-foreground mb-2">Essential</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-foreground">₹0</span>
                  <span className="text-muted-foreground font-bold">/forever</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1 relative z-10">
                  <li className="flex items-center gap-3 text-muted-foreground font-bold"><Check className="w-5 h-5 text-primary shrink-0"/> Core Expense Tracking</li>
                  <li className="flex items-center gap-3 text-muted-foreground font-bold"><Check className="w-5 h-5 text-primary shrink-0"/> Basic AI Insights</li>
                  <li className="flex items-center gap-3 text-muted-foreground font-medium line-through decoration-muted">Advanced AI Wealth Tools</li>
                </ul>
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full py-5 rounded-none bg-muted text-foreground font-black text-lg hover:bg-muted/80 transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Premium Tier */}
              <div className="bg-slate-900 rounded-none p-10 lg:p-12 border border-slate-700 shadow-2xl flex flex-col relative overflow-hidden group scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-6">
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
                  className="w-full py-5 rounded-none bg-primary text-primary-foreground font-black text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 relative z-20"
                >
                  Unlock Everything
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <About />

        {/* FAQ Section */}
        <FAQ />

        {/* Premium Multi-Column Footer */}
        <footer className="py-24 bg-background border-t border-border relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[30%] h-[30%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
              {/* Brand Column */}
              <div className="col-span-2 lg:col-span-2 space-y-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                  <div className="w-10 h-10 rounded-none overflow-hidden flex items-center justify-center">
                    <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-foreground">FinGenius</span>
                </div>
                <p className="text-muted-foreground font-medium max-w-sm leading-relaxed">
                  FinGenius is an elite AI personal finance mentor helping you track wealth, optimize taxes, and plan for early retirement with precision.
                </p>
                <div className="flex items-center gap-4">
                  {/* Twitter */}
                  <a href="https://twitter.com/entrextlabs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-none bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="http://linkedin.com/company/entrext/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-none bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/entrext.labs/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-none bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  {/* Discord */}
                  <a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-none bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group">
                    <svg className="w-5 h-5" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.31,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.71,11.11,105.47,105.47,0,0,0,32.19-16.14v0C130.34,50.67,125.13,27,107.7,8.07ZM42.45,65.69c-6.39,0-11.75-5.87-11.75-13.08,0-7.21,5.14-13.08,11.75-13.08s11.9,5.87,11.75,13.08C54.2,59.82,49.07,65.69,42.45,65.69Zm38.19,0c-6.39,0-11.75-5.87-11.75-13.08,0-7.21,5.14-13.08,11.75-13.08s11.9,5.87,11.75,13.08C92.39,59.82,87.28,65.69,80.64,65.69Z"/></svg>
                  </a>
                  {/* Substack */}
                  <a href="https://entrextlabs.substack.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-none bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Product</h4>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-muted-foreground font-bold hover:text-primary transition-colors">AI Coach</a></li>
                  <li><a href="#features" className="text-muted-foreground font-bold hover:text-primary transition-colors">Tax Wizard</a></li>
                  <li><a href="#features" className="text-muted-foreground font-bold hover:text-primary transition-colors">Retirement</a></li>
                  <li><a href="#features" className="text-muted-foreground font-bold hover:text-primary transition-colors">Portfolio X-Ray</a></li>
                  <li><a href="#pricing" className="text-muted-foreground font-bold hover:text-primary transition-colors">Pricing</a></li>
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Company</h4>
                <ul className="space-y-4">
                  <li><a href="#about" className="text-muted-foreground font-bold hover:text-primary transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-muted-foreground font-bold hover:text-primary transition-colors">Mission</a></li>
                  <li><a href="https://entrextlabs.substack.com/subscribe" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-bold hover:text-primary transition-colors">Newsletter</a></li>
                  <li><a href="#" className="text-muted-foreground font-bold hover:text-primary transition-colors">Careers</a></li>
                </ul>
              </div>

              {/* Help & Legal */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="#faq" className="text-muted-foreground font-bold hover:text-primary transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-muted-foreground font-bold hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground font-bold hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-bold hover:text-primary transition-colors">Help Center</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-muted-foreground text-sm font-bold">
                © {new Date().getFullYear()} FinGenius. Built by <a href="http://linkedin.com/company/entrext/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Entrext Labs</a>. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-muted-foreground text-sm font-bold hover:text-foreground">Cookies</a>
                <a href="#" className="text-muted-foreground text-sm font-bold hover:text-foreground">Security</a>
                <a href="#" className="text-muted-foreground text-sm font-bold hover:text-foreground">Status</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <MobileNavDrawer 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
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

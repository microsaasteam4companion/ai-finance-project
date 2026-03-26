'use client';

import { ShieldCheck, Cpu, Users, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Our Story
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground leading-[1.1] mb-6">
                Financial Literacy, <br />
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Reimagined.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                FinGenius was born from a simple realization: the tools used by elite wealth managers should be accessible to everyone. We've combined cutting-edge AI with deep financial expertise to create your personal wealth mentor.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "Privacy & Security First",
                  content: "Your financial data is yours alone. We use bank-grade encryption and never sell your personal information."
                },
                {
                  icon: <Cpu className="w-6 h-6" />,
                  title: "AI-Driven Precision",
                  content: "Our LLM-powered engine analyzes complex tax laws and market trends to provide personalized, actionable advice."
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Community Driven",
                  content: "Built for the modern investor who values transparency, efficiency, and long-term financial freedom."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-none bg-card border border-border hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-none blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-card border border-border rounded-none p-8 lg:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-20 h-20 rounded-none flex items-center justify-center">
                   <img src="/logo.png" alt="FinGenius" className="w-10 h-10 opacity-80" />
                </div>
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-foreground">Democratizing Wealth.</h4>
                  <p className="text-muted-foreground font-bold italic">"Empowering 10 million households to achieve FIRE by 2030."</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-none bg-muted/50 border border-border">
                    <div className="text-3xl font-black text-primary mb-1">98%</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accuracy</div>
                  </div>
                  <div className="p-6 rounded-none bg-muted/50 border border-border">
                    <div className="text-3xl font-black text-primary mb-1">24/7</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Support</div>
                  </div>
                </div>

                <div className="p-8 rounded-none bg-slate-900 text-white border border-slate-700">
                  <p className="text-sm font-medium leading-relaxed mb-6">
                    "FinGenius isn't just an app; it's a movement towards financial sovereignty. We're here to ensure you're never alone in your wealth journey."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-primary flex items-center justify-center font-bold text-xs uppercase tracking-tighter">
                      FG
                    </div>
                    <div>
                      <div className="text-sm font-bold">The FinGenius Team</div>
                      <div className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest">Visionaries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Activity, Shield, Sparkles, ArrowUpRight, DollarSign } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="relative py-12 px-6 lg:px-8 -mt-20 z-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group bg-white rounded-none border border-slate-200/60 shadow-2xl shadow-indigo-500/10 overflow-hidden"
        >
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar Mockup (Hidden on mobile) */}
            <div className="hidden lg:flex w-20 flex-col items-center py-8 gap-8 border-r border-slate-100">
              <div className="w-10 h-10 bg-indigo-600 rounded-none flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              {[Activity, PieChart, TrendingUp, Shield].map((Icon, i) => (
                <Icon key={i} className={`w-6 h-6 ${i === 0 ? 'text-indigo-600' : 'text-slate-300'}`} />
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 lg:p-12">
              <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Wealth Dashboard</h3>
                  <p className="text-slate-500 font-medium">Hello, Alex! Your portfolio is hitting new highs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-none text-xs font-bold border border-indigo-100 uppercase tracking-wider">Premium Member</div>
                    <div className="w-10 h-10 rounded-none bg-slate-100 border border-slate-200" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 {[
                   { label: 'Total Net Worth', value: '₹12,45,200', change: '+₹42,000', icon: <DollarSign className="w-5 h-5"/>, color: 'indigo' },
                   { label: 'AI Wealth Score', value: '94/100', change: 'Top 1% elite', icon: <Sparkles className="w-5 h-5"/>, color: 'purple' },
                   { label: 'Est. Retirement', value: '8 Years', change: 'FIRE track', icon: <TrendingUp className="w-5 h-5"/>, color: 'emerald' },
                 ].map((stat, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.2 + i * 0.1 }}
                     className="bg-slate-50 border border-slate-100 rounded-none p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                   >
                      <div className={`w-10 h-10 rounded-none flex items-center justify-center mb-4 ${stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {stat.icon}
                      </div>
                      <p className="text-sm font-bold text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-800 mb-2">{stat.value}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' : stat.color === 'purple' ? 'bg-purple-50 text-purple-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {stat.change}
                      </span>
                   </motion.div>
                 ))}
              </div>

              {/* Mock Chart Area */}
              <div className="bg-slate-900/5 border border-slate-100 rounded-none p-8 relative overflow-hidden h-64 lg:h-80">
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="font-bold text-slate-700 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500"/> Financial Roadmap</h4>
                       <div className="flex gap-2">
                          {['1W', '1M', '1Y', 'ALL'].map((t, i) => (
                            <span key={i} className={`text-[10px] font-black px-2 py-1 rounded-none ${i === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer'}`}>{t}</span>
                          ))}
                       </div>
                    </div>
                    
                    {/* Abstract SVG Chart Drawing */}
                    <svg viewBox="0 0 800 300" className="w-full h-40 lg:h-52 drop-shadow-2xl overflow-visible">
                       <motion.path 
                         initial={{ pathLength: 0 }}
                         whileInView={{ pathLength: 1 }}
                         transition={{ duration: 2, ease: "easeInOut" }}
                         d="M0,250 C100,240 150,220 200,180 C250,140 300,150 350,120 C400,90 450,110 500,80 C550,50 600,60 700,30 L800,20" 
                         fill="none" 
                         stroke="url(#gradient)" 
                         strokeWidth="8" 
                         strokeLinecap="round" 
                       />
                       <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                             <stop offset="0%" stopColor="#4f46e5" />
                             <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                       </defs>
                    </svg>

                    <div className="absolute top-[40%] left-[65%] group">
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="w-4 h-4 rounded-none bg-indigo-600 border-4 border-white shadow-lg cursor-pointer" 
                       />
                       <div className="absolute -top-16 -left-12 bg-white rounded-none shadow-2xl p-3 border border-slate-100 opacity-100 w-32 pointer-events-none scale-0 group-hover:scale-100 transition-all origin-bottom">
                          <p className="text-[10px] font-bold text-slate-400 mb-0.5">Wealth Goal Achieved!</p>
                          <p className="text-sm font-black text-slate-900">₹8.4L Net Worth</p>
                       </div>
                    </div>
                 </div>

                 {/* Decorative Grid Lines */}
                 <div className="absolute inset-x-0 bottom-0 top-20 flex flex-col justify-between opacity-[0.03] pointer-events-none px-8">
                    {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-slate-900" />)}
                 </div>
              </div>
            </div>

            {/* AI Assistant Peek */}
            <div className="lg:w-80 bg-slate-50 p-8 flex flex-col items-center justify-center border-l border-slate-100">
               <div className="w-16 h-16 rounded-none bg-white shadow-xl flex items-center justify-center mb-6 border border-indigo-50">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
               </div>
               <h4 className="text-lg font-bold text-slate-800 mb-2 text-center">AI Advisor</h4>
               <p className="text-sm text-slate-500 font-medium text-center leading-relaxed">
                  "Based on your current SIP frequency and tax bracket, I suggest moving ₹1.5L to NPS (80CCD) to hit retirement 6 months earlier."
               </p>
               <button className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-none font-bold text-xs shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">Connect Advisor</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

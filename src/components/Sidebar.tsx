'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Home, PieChart, Activity, Sparkles, TrendingUp, CreditCard, LogOut, User, Rocket, FileText, LayoutDashboard, Lock } from 'lucide-react';

export default function Sidebar() {
  const { user, tier } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, type: 'free' },
    { name: 'Budgets', href: '/dashboard/budgets', icon: PieChart, type: 'free' },
    { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Activity, type: 'free' },
  ];

  const premiumItems = [
    { name: 'AI Coach', href: '/dashboard/coach', icon: Sparkles },
    { name: 'FIRE Planner', href: '/dashboard/fire', icon: Rocket },
    { name: 'Tax Wizard', href: '/dashboard/tax', icon: FileText },
    { name: 'Portfolio X-Ray', href: '/dashboard/portfolio', icon: LayoutDashboard },
    { name: 'Wealth Profile', href: '/dashboard/profile', icon: User },
  ];

  const isPremium = tier === 'premium';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">FinGenius</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <div className="pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Tools</div>
        {navItems.map((item) => (
          <a 
            key={item.name}
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </a>
        ))}

        <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
          Premium Wealth {!isPremium && <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />}
        </div>
        {premiumItems.map((item) => {
          const isLocked = !isPremium;
          const isActive = pathname === item.href;
          return (
            <a 
              key={item.name}
              href={isLocked ? "/dashboard/billing" : item.href} 
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors font-medium ${isLocked ? 'text-slate-400 hover:bg-slate-50' : isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isLocked ? 'text-slate-300' : isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                {item.name}
              </div>
              {isLocked && <Lock className="w-3.5 h-3.5 text-slate-300" />}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <a href="/dashboard/billing" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium mb-1 ${pathname === '/dashboard/billing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}>
           <CreditCard className="w-5 h-5" /> Billing & Plans
        </a>
        <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"><LogOut className="w-5 h-5" />Log Out</button>
      </div>
    </aside>
  );
}

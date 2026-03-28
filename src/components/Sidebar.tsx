'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Home, PieChart, Activity, Sparkles, TrendingUp, CreditCard, LogOut, User, Rocket, FileText, LayoutDashboard, Lock } from 'lucide-react';

import { ThemeToggle } from './ThemeToggle';

import Link from 'next/link';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, tier } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Budgets', href: '/dashboard/budgets', icon: PieChart },
    { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Activity },
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-50 
        transition-transform duration-300 transform md:relative md:translate-x-0 md:flex md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">FinGenius</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="pb-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core Tools</div>
        {navItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href} 
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}

        <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
          Premium Wealth {!isPremium && <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />}
        </div>
        {premiumItems.map((item) => {
          const isLocked = !isPremium;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={isLocked ? "/dashboard/billing" : item.href} 
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors font-medium ${isLocked ? 'text-muted-foreground/50 hover:bg-muted' : isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isLocked ? 'text-muted-foreground/30' : isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.name}
              </div>
              {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground font-medium md:hidden">
          <span>Appearance</span>
          <ThemeToggle />
        </div>
        <Link href="/dashboard/billing" onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${pathname === '/dashboard/billing' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
           <CreditCard className="w-5 h-5" /> Billing & Plans
        </Link>
      </div>
    </aside>
    </>
  );
}


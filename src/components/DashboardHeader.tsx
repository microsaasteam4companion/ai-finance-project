'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onOpenSidebar?: () => void;
}

export default function DashboardHeader({ title, subtitle, badge, onOpenSidebar }: DashboardHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-background border-b border-border px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 z-[100] transition-all">
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button 
            onClick={onOpenSidebar}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg md:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div>
           <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
             {title}
             {badge && <span className="hidden sm:inline bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{badge}</span>}
           </h1>
           {subtitle && <p className="text-xs md:text-sm text-muted-foreground font-medium whitespace-nowrap">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="hidden md:block text-right">
              <div className="text-sm font-bold text-foreground">{user?.user_metadata?.username || user?.email?.split('@')[0]}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Member</div>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border border-border group-hover:border-indigo-200 dark:group-hover:border-indigo-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-all">
              <UserIcon className="w-5 h-5" />
            </div>
          </div>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-border py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-border/50 md:hidden">
                   <div className="text-sm font-bold text-foreground truncate">{user?.email}</div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


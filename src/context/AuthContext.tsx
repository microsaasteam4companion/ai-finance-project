'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { isEmailPremium } from '@/lib/premiumConfig';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  tier: string;
  refreshTier: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, tier: 'free', refreshTier: async () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<string>('free');

  const fetchTier = async (userId: string, email?: string) => {
    if (isEmailPremium(email)) {
      setTier('premium');
      return;
    }
    const { data } = await supabase.from('profiles').select('tier').eq('id', userId).single();
    setTier(data?.tier || 'free');
  };

  const refreshTier = async () => {
    if (user) await fetchTier(user.id, user.email || undefined);
  };

  useEffect(() => {
    let mounted = true;

    // Supabase onAuthStateChange handles the initial session (event === 'INITIAL_SESSION')
    // and all subsequent auth state changes automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchTier(currentUser.id, currentUser.email);
      } else {
        setTier('free');
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, tier, refreshTier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

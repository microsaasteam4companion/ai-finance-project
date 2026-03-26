'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { getProfile } from '@/lib/db';
import { isEmailPremium } from '@/lib/premiumConfig';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  tier: string;
  refreshTier: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  tier: 'free', 
  refreshTier: async () => 'free' 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<string>('free');

  const fetchTier = async (userId: string, email?: string) => {
    if (isEmailPremium(email)) {
      setTier('premium');
      return 'premium';
    }
    
    // Fetch profile from Firestore
    const profile = await getProfile(userId);
    const newTier = profile?.tier || 'free';
    setTier(newTier);
    return newTier;
  };

  const refreshTier = async () => {
    if (user) return await fetchTier(user.uid, user.email || undefined);
    return 'free';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await fetchTier(currentUser.uid, currentUser.email || undefined);
      } else {
        setTier('free');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, tier, refreshTier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

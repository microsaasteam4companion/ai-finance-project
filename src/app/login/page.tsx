'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, TrendingUp, Sparkles, BrainCircuit, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginIdentifier = email.includes('@') ? email : `${email.toLowerCase().trim()}@fingenius.ai`;

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email: loginIdentifier, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push('/dashboard?auth=success');
    } else {
      // Server-side signup to bypass email confirmation
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password })
        });
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          // Auto-login after successful signup
          const { error: loginError } = await supabase.auth.signInWithPassword({ 
            email: loginIdentifier, 
            password 
          });
          if (loginError) {
            setError('Account created, but auto-login failed. Please sign in manually.');
          } else {
            router.push('/dashboard?auth=success');
          }
        }
      } catch (err) {
        setError('Signup failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[60%] left-[80%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Left side: branding/hero illustration */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg mx-auto text-center lg:text-left">
          <div className="w-16 h-16 bg-white/10 rounded-2xl mb-8 backdrop-blur-md overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Meet your personal<br />AI wealth mentor.
          </h1>
          <p className="text-xl text-indigo-200/80 mb-12">
            FinGenius analyzes your spending, spots opportunities, and guides you to financial freedom—automatically.
          </p>
          
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart AI Insights</h3>
                <p className="text-sm text-indigo-200/60">Automated nudges & recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">FIRE Planning</h3>
                <p className="text-sm text-indigo-200/60">Step-by-step roadmap to retire early</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {isLogin ? 'Enter your details to access your dashboard' : 'Join FinGenius and master your money'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                <span className="shrink-0 leading-5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none"
            >
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

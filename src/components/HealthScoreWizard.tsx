'use client';

import { useState } from 'react';
import { Sparkles, ShieldCheck, HeartPulse, Scale, TrendingUp, Users, ChevronRight, ChevronLeft, CheckCircle2, IndianRupee, ShieldAlert, Zap, Target } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

interface HealthScoreWizardProps {
  onClose: () => void;
  onComplete: () => void;
  userId: string;
}

export default function HealthScoreWizard({ onClose, onComplete, userId }: HealthScoreWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data state based on the 6 dimensions
  const [data, setData] = useState({
    emergency_months: 0,
    has_term_insurance: false,
    has_health_insurance: false,
    asset_breakdown: 'mostly_savings', // savings, mutual_funds, stocks, mix
    monthly_debt_emi: 0,
    monthly_income: 0,
    tax_regime: 'new', // old, new, unsure
    retirement_target_age: 60,
    current_age: 30,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Calculate derived metrics
      const debtToIncome = data.monthly_income > 0 ? (data.monthly_debt_emi / data.monthly_income) * 100 : 0;
      
      // Update profile in Supabase
      // Note: We use existing fields and could add new ones if schema allows.
      // For now, we'll store the high-level metrics.
      const { error } = await supabase.from('profiles').update({
        emergency_fund: data.emergency_months * (data.monthly_income * 0.7), // rough estimate
        debt: data.monthly_debt_emi * 12, // rough estimation for health score
        risk_profile: data.asset_breakdown === 'stocks' || data.asset_breakdown === 'mix' ? 'aggressive' : 'moderate',
        // We could use a metadata column if available, or just use these to calculate the score on the fly
      }).eq('id', userId);

      if (error) throw error;

      toast.success('Financial Wellness Profile Updated!');
      onComplete();
    } catch (err: any) {
      toast.error('Failed to save assessment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <ShieldAlert className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Emergency Preparedness</h3>
            <p className="text-slate-500 font-medium">How many months of basic expenses do you have saved in a liquid bank account today?</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[0, 1, 3, 6].map(m => (
                <button 
                  key={m} 
                  onClick={() => { setData({...data, emergency_months: m}); nextStep(); }}
                  className={`p-4 rounded-2xl border-2 transition-all font-bold text-center ${data.emergency_months === m ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'}`}
                >
                  {m === 0 ? 'Zero' : `${m} Months`}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">Insurance Coverage</h3>
            <p className="text-slate-500 font-medium">Select the insurance policies you currently hold independently (outside of work).</p>
            <div className="space-y-4 pt-4 text-left">
               <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={data.has_term_insurance} onChange={e => setData({...data, has_term_insurance: e.target.checked})} className="w-6 h-6 accent-indigo-600" />
                  <div>
                    <div className="font-bold text-slate-800 text-lg">Term Life Insurance</div>
                    <div className="text-sm text-slate-500 font-medium">At least 10x your annual income.</div>
                  </div>
               </label>
               <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" checked={data.has_health_insurance} onChange={e => setData({...data, has_health_insurance: e.target.checked})} className="w-6 h-6 accent-indigo-600" />
                  <div>
                    <div className="font-bold text-slate-800 text-lg">Health Insurance</div>
                    <div className="text-sm text-slate-500 font-medium">Private cover for you or your family.</div>
                  </div>
               </label>
            </div>
            <button onClick={nextStep} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-6 shadow-lg shadow-indigo-600/20">Continue</button>
          </div>
        );
      case 3:
        return (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">Investment Diversification</h3>
            <p className="text-slate-500 font-medium">Where is the majority of your current wealth invested?</p>
            <div className="grid grid-cols-1 gap-4 pt-4 text-left">
              {[
                { id: 'mostly_savings', label: 'Mostly FD & Savings', sub: 'Conservative' },
                { id: 'mutual_funds', label: 'Mutual Funds / Gold', sub: 'Balanced' },
                { id: 'stocks', label: 'Direct Stocks / Crypto', sub: 'Aggressive' },
                { id: 'mix', label: 'Balanced Mix', sub: 'Diversified' },
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setData({...data, asset_breakdown: item.id}); nextStep(); }}
                  className={`p-4 px-6 rounded-2xl border-2 text-left transition-all font-bold ${data.asset_breakdown === item.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className={data.asset_breakdown === item.id ? 'text-emerald-700' : 'text-slate-700'}>{item.label}</div>
                  <div className="text-xs text-slate-400 font-medium">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mb-6">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">Debt Health</h3>
            <p className="text-slate-500 font-medium">Tell us about your monthly income and loan repayments (EMI).</p>
            <div className="space-y-5 pt-4">
               <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Monthly In-hand Income (₹)</label>
                  <input type="number" value={data.monthly_income} onChange={e => setData({...data, monthly_income: Number(e.target.value)})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold" placeholder="e.g. 100000" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Total Monthly EMIs (₹)</label>
                  <input type="number" value={data.monthly_debt_emi} onChange={e => setData({...data, monthly_debt_emi: Number(e.target.value)})} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold" placeholder="e.g. 25000" />
               </div>
               <button onClick={nextStep} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg active:scale-[0.98] transition-transform">Next Step</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">Tax Efficiency</h3>
            <p className="text-slate-500 font-medium">Which tax regime are you currently opting for this year?</p>
            <div className="grid grid-cols-1 gap-4 pt-4 text-left">
              {[
                { id: 'new', label: 'New Tax Regime', sub: 'Default (Simplified)' },
                { id: 'old', label: 'Old Tax Regime', sub: 'Claiming House Rent / 80C' },
                { id: 'unsure', label: 'I am not sure', sub: 'Let AI help me decide later' },
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setData({...data, tax_regime: item.id}); nextStep(); }}
                  className={`p-4 px-6 rounded-2xl border-2 text-left transition-all font-bold ${data.tax_regime === item.id ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className={data.tax_regime === item.id ? 'text-purple-700' : 'text-slate-700'}>{item.label}</div>
                  <div className="text-xs text-slate-400 font-medium">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">Retirement Readiness</h3>
            <p className="text-slate-500 font-medium">Final step: What is your target age to reach financial freedom?</p>
            <div className="pt-8 px-4">
               <div className="flex justify-between font-bold text-orange-600 mb-2">
                 <span>Age {data.retirement_target_age}</span>
               </div>
               <input type="range" min={data.current_age + 5} max="75" value={data.retirement_target_age} onChange={e => setData({...data, retirement_target_age: Number(e.target.value)})} className="w-full accent-orange-500 h-2 bg-orange-100 rounded-lg appearance-none" />
               <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                  <span>Early Retirement</span>
                  <span>Standard</span>
               </div>
            </div>
            <button onClick={handleFinish} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold mt-10 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Assessment'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100">
           <div className={`h-full bg-indigo-600 transition-all duration-500`} style={{ width: `${(step / 6) * 100}%` }} />
        </div>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Step {step} of 6</span>
            {step > 1 && (
              <button onClick={prevStep} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                 <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>

          {renderStep()}
        </div>

        {/* Brand footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
           <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
           </div>
           <span className="text-xs font-bold text-slate-400 tracking-tight uppercase">FinGenius AI Assessment</span>
        </div>
      </div>
    </div>
  );
}

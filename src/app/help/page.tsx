'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Mail, ExternalLink, ChevronDown, ChevronUp, BookOpen, Zap, Shield, CreditCard } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'How does FinGenius protect my financial data?',
    a: 'Your data is stored on Google Firebase with enterprise-grade encryption. We use TLS 1.3 for data in transit and AES-256 for data at rest. We never share your financial data with third parties for marketing.',
  },
  {
    q: 'How do I add a transaction?',
    a: 'Go to your Dashboard and click the "Add Manual" button to log a transaction. You can also use the AI Receipt Scanner to automatically extract data from a photo of your receipt or invoice.',
  },
  {
    q: 'What is the AI Health Score?',
    a: "The AI Health Score is a 0-100 score that evaluates your overall financial wellness across 6 dimensions: Savings Rate, Emergency Fund, Investments, Debt Health, Insurance, and Retirement. Click on the score card in your dashboard to complete the wizard.",
  },
  {
    q: 'How does the FIRE Retirement Planner work?',
    a: 'The FIRE (Financial Independence, Retire Early) planner calculates your target corpus based on your expected monthly expenses and desired withdrawal rate. Navigate to Dashboard → FIRE to explore it.',
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes. You can upgrade to Premium Wealth from the Billing section in your dashboard. To downgrade or cancel, go to Dashboard → Subscriptions and manage your plan there.',
  },
  {
    q: 'How do I reset my password?',
    a: 'On the login page, click "Forgot password?" and enter your email address. If you signed up with Google, simply use the "Continue with Google" button to sign in.',
  },
  {
    q: 'What does the Tax Wizard do?',
    a: 'The Tax Wizard (Premium feature) allows you to compare the Old vs New tax regimes based on your salary and deductions. It shows which regime saves you more tax and by how much.',
  },
  {
    q: 'Is my data deleted when I close my account?',
    a: 'Yes. When you delete your account, all associated data including transactions, profile, and financial data is permanently removed from our servers within 30 days.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-card">
          <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

const guides = [
  { icon: Zap, title: 'Getting Started', desc: 'Create your account, set up your profile, and add your first transaction in under 5 minutes.', color: 'text-yellow-500 bg-yellow-500/10' },
  { icon: Shield, title: 'AI Health Score', desc: 'Understand how your financial health is scored and what steps improve each dimension.', color: 'text-purple-500 bg-purple-500/10' },
  { icon: BookOpen, title: 'Tax Wizard Guide', desc: 'Step-by-step guide to comparing Old vs New tax regimes using your Form 16 or salary slips.', color: 'text-blue-500 bg-blue-500/10' },
  { icon: CreditCard, title: 'Premium Features', desc: 'A complete overview of what\'s included in Premium Wealth — FIRE, Tax Wizard, Portfolio X-Ray.', color: 'text-emerald-500 bg-emerald-500/10' },
];

export default function HelpPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-foreground mb-3">Help Center</h1>
          <p className="text-muted-foreground text-lg">Everything you need to get the most out of FinGenius</p>
        </div>

        {/* Quick Guides */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-md hover:shadow-sm transition-shadow flex items-start gap-4">
                <div className={`p-2 rounded-md ${g.color} shrink-0`}>
                  <g.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{g.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Still need help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://discord.com/invite/ZZx3cBrx2"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-card border border-border rounded-md hover:border-primary/40 hover:shadow-sm transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  Discord Community
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Get real-time help from our community and the FinGenius team.</p>
              </div>
            </a>

            <a
              href="mailto:support@entrext.in"
              className="p-6 bg-card border border-border rounded-md hover:border-primary/40 hover:shadow-sm transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-primary/10 text-primary rounded-md">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground mb-1">Email Support</div>
                <p className="text-muted-foreground text-sm">support@entrext.in · We respond within 24 hours on business days.</p>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

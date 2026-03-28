'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Effective Date: January 1, 2025 · Last Updated: March 28, 2025</p>
        </div>

        <div className="space-y-10 text-[15px] text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using FinGenius (operated by Entrext Labs), you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. These terms constitute a legally binding agreement between you and Entrext Labs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Use of the Platform</h2>
            <p className="mb-3">FinGenius provides AI-powered personal finance tools including expense tracking, tax analysis, FIRE planning, and portfolio analysis. You agree to:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Use the platform only for lawful personal finance management purposes</li>
              <li>Not attempt to reverse-engineer, decompile, or exploit our AI systems</li>
              <li>Not share your account credentials with third parties</li>
              <li>Provide accurate, truthful financial information when using our tools</li>
              <li>Not use the platform for fraudulent or deceptive activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account. FinGenius is not liable for losses resulting from unauthorized account access due to your failure to secure your credentials. You must be at least 18 years old to create an account. We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Subscription & Payments</h2>
            <p className="mb-3">FinGenius offers a free tier and a Premium Wealth subscription (₹199/month). By subscribing:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>You authorize us to charge your payment method on a recurring basis</li>
              <li>Subscriptions auto-renew unless cancelled before the billing date</li>
              <li>Refunds are issued at Entrext Labs&apos; discretion within 7 days of the billing date</li>
              <li>We reserve the right to change pricing with 30 days&apos; advance notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>All content, features, AI models, and branding on FinGenius are owned by Entrext Labs and protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without explicit written permission from Entrext Labs.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Financial Disclaimer</h2>
            <p>FinGenius provides AI-generated financial analysis for informational purposes only. Our insights and recommendations are <strong>not professional financial advice</strong>. We strongly recommend consulting a certified financial advisor before making significant investment or tax decisions. Entrext Labs is not liable for financial losses arising from decisions made based on our platform&apos;s output.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Entrext Labs shall not be liable for indirect, incidental, special, or consequential damages arising from your use of FinGenius. Our total liability is limited to the amount you paid in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Termination</h2>
            <p>We may terminate or suspend access to FinGenius at any time, without notice, for violations of these terms. You may delete your account at any time from your profile settings. Upon termination, your data will be deleted as per our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Governing Law</h2>
            <p>These terms shall be governed by the laws of India. Any disputes arising from these terms shall be resolved in the courts of Bengaluru, Karnataka, India.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Updates to These Terms</h2>
            <p>We may update these Terms of Service from time to time. We will notify you of material changes via email or a prominent notice on the platform. Continued use after changes constitutes acceptance of the new terms.</p>
          </section>

          <div className="pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">For questions about these terms, contact us at <a href="mailto:legal@entrext.in" className="text-primary hover:underline">legal@entrext.in</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

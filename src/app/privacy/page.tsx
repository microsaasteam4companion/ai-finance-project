'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Effective Date: January 1, 2025 · Last Updated: March 28, 2025</p>
        </div>

        <div className="space-y-10 text-[15px] text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>Entrext Labs (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates FinGenius. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform. We are committed to protecting your privacy and handling your data responsibly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following categories of information:</p>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 border border-border rounded-md">
                <h3 className="font-semibold mb-1 text-foreground">Account Information</h3>
                <p className="text-muted-foreground text-sm">Username, email address, password (hashed), and profile preferences when you create an account.</p>
              </div>
              <div className="p-4 bg-muted/50 border border-border rounded-md">
                <h3 className="font-semibold mb-1 text-foreground">Financial Data</h3>
                <p className="text-muted-foreground text-sm">Transaction records, income/expense data, budget information, and financial profile data you voluntarily enter into the platform.</p>
              </div>
              <div className="p-4 bg-muted/50 border border-border rounded-md">
                <h3 className="font-semibold mb-1 text-foreground">Usage Data</h3>
                <p className="text-muted-foreground text-sm">Pages visited, features used, session duration, and interactions within the platform for product improvement.</p>
              </div>
              <div className="p-4 bg-muted/50 border border-border rounded-md">
                <h3 className="font-semibold mb-1 text-foreground">Technical Data</h3>
                <p className="text-muted-foreground text-sm">IP address, browser type, device information, and cookies for security and performance purposes.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>To provide and operate the FinGenius platform and its AI features</li>
              <li>To generate personalized financial insights and recommendations</li>
              <li>To process payments and manage your subscription</li>
              <li>To send transactional emails and product updates (with your consent)</li>
              <li>To improve our AI models and platform features</li>
              <li>To detect and prevent fraud and security threats</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored on Firebase (Google Cloud) infrastructure with enterprise-grade security including encryption at rest and in transit (TLS 1.3). We implement role-based access controls and regular security audits. Financial data is never stored in unencrypted form. We retain your data for as long as your account is active, or as required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services that may receive limited data:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Firebase (Google)</strong> — Authentication, database, and hosting</li>
              <li><strong className="text-foreground">Google AI (Gemini)</strong> — AI-powered financial analysis (data is not retained by Google for training)</li>
              <li><strong className="text-foreground">Dodo Payments</strong> — Payment processing (we do not store card details)</li>
              <li><strong className="text-foreground">Vercel</strong> — Application hosting and CDN</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">We do not sell your personal data to any third party for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="mb-3">Under applicable data protection laws, you have the right to:</p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Access</strong> — Request a copy of all personal data we hold about you</li>
              <li><strong className="text-foreground">Correction</strong> — Request correction of inaccurate or incomplete data</li>
              <li><strong className="text-foreground">Deletion</strong> — Request deletion of your account and all associated data</li>
              <li><strong className="text-foreground">Portability</strong> — Request your data in a machine-readable format</li>
              <li><strong className="text-foreground">Opt-out</strong> — Unsubscribe from marketing communications at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>FinGenius uses essential cookies for authentication and session management. We use analytics cookies to understand platform usage patterns. You can control cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>FinGenius is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has created an account, please contact us immediately at privacy@entrext.in.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notice. Continued use of FinGenius after changes constitutes acceptance of the updated policy.</p>
          </section>

          <div className="pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">For privacy inquiries or data requests, contact us at <a href="mailto:privacy@entrext.in" className="text-primary hover:underline">privacy@entrext.in</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { blogs } from '@/data/blogs';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinGenius Blogs - AI Personal Finance & Wealth Mentorship',
  description: 'Learn how to master your personal finance, optimize taxes, build an emergency fund, and retire early using AI-driven wealth strategies.',
  openGraph: {
    title: 'FinGenius Blogs - AI Personal Finance & Wealth Mentorship',
    description: 'Master your wealth with AI-powered financial guides.',
    url: 'https://fingenius.entrext.com/blogs',
    siteName: 'FinGenius',
    images: [{ url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Json-Ld for CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "FinGenius AI Finance Blog",
            "url": "https://fingenius.entrext.com/blogs",
            "description": "Premium guides on personal finance, wealth management, and AI optimization."
          }),
        }}
      />

      <nav className="w-full bg-background border-b border-border h-20 flex items-center px-6 sticky top-0 z-50">
         <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="FinGenius Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">FinGenius</span>
         </Link>
         <div className="ml-auto hidden sm:flex items-center gap-6 font-semibold text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="/login" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md shadow-md text-sm">Sign In</Link>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center mb-24 max-w-3xl mx-auto relative relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -z-10"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-6 relative overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Wealth Magazine
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight mb-8 leading-[1.1]">
            Master Your Wealth <br className="hidden md:block"/> With <span className="text-primary">Intelligence</span>.
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Read our detailed, AI-driven guides on achieving Financial Independence and Retiring Early (FIRE).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, idx) => (
            <Link href={"/blogs/" + blog.slug} key={blog.slug} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between relative">
                <div>
                  <div className="text-primary font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> 5 Min Read</div>
                  <h2 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{blog.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium line-clamp-3">{blog.summary}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-12 border-t border-border bg-card">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-black text-foreground mb-4">Want the ultimate FinGenius Experience?</h2>
            <p className="text-muted-foreground mb-8">Stop reading spreadsheets. Start building wealth with your AI mentor today.</p>
            <Link href="/login" className="bg-primary text-primary-foreground font-black px-10 py-4 rounded-xl shadow-xl shadow-primary/30 hover:scale-105 transition-transform inline-block">Start Your FIRE Journey</Link>
         </div>
      </footer>
    </div>
  );
}

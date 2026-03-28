import { blogs } from '@/data/blogs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Sparkles, ChevronDown } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = blogs.find(b => b.slug === resolvedParams.slug);
  if (!blog) return {};
  
  return {
    title: blog.title + ' | FinGenius AI',
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      url: 'https://fingenius.entrext.com/blogs/' + blog.slug,
      images: [{ url: blog.imageUrl, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: blog.date,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = blogs.find(b => b.slug === resolvedParams.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = blogs.filter(b => blog.relatedSlugs.includes(b.slug));

  const structuredDataArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.imageUrl],
    "datePublished": blog.date,
    "author": [{
      "@type": "Organization",
      "name": "FinGenius AI Intelligence",
      "url": "https://fingenius.entrext.com"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "FinGenius",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fingenius.entrext.com/logo.png"
      }
    }
  };

  const structuredDataFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataFAQ) }} />

      <nav className="w-full bg-background border-b border-border h-20 flex items-center px-6 sticky top-0 z-50">
         <Link href="/blogs" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
         </Link>
         <Link href="/" className="ml-auto hidden sm:flex bg-primary text-primary-foreground px-5 py-2.5 rounded-md shadow-md text-sm font-bold">
            Try FinGenius AI
         </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Wealth Intelligence
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-bold text-muted-foreground">
             <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(blog.date).toLocaleDateString()}</div>
             <div className="flex items-center gap-2"><Share2 className="w-4 h-4"/> Share Article</div>
          </div>
        </header>

        <div className="relative aspect-[21/9] w-full bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden mb-16 shadow-2xl">
           <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Main Content */}
          <article className="md:col-span-3 prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl">
             <div className="text-xl leading-relaxed text-muted-foreground font-medium mb-10 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
                {blog.summary}
             </div>
             
             <div dangerouslySetInnerHTML={{ __html: blog.content }} className="space-y-6" />
             
             <hr className="my-16 border-border" />

             {/* FAQs */}
             <div className="mt-16 bg-card border border-border rounded-2xl p-8">
               <h2 className="text-3xl font-black mb-8 border-b-0">Frequently Asked Questions</h2>
               <div className="space-y-4">
                 {blog.faqs.map((faq, i) => (
                   <details key={i} className="group bg-muted/50 rounded-xl">
                     <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground p-5 marker:content-none select-none">
                       {faq.question}
                       <ChevronDown className="w-5 h-5 group-open:-rotate-180 transition-transform text-muted-foreground" />
                     </summary>
                     <div className="px-5 pb-5 text-muted-foreground leading-relaxed font-medium">
                       {faq.answer}
                     </div>
                   </details>
                 ))}
               </div>
             </div>
          </article>

          {/* Sidebar TOC - Sticky */}
          <aside className="hidden md:block md:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h3 className="font-extrabold text-sm uppercase tracking-widest text-muted-foreground mb-4">Table of Contents</h3>
               <ul className="space-y-3 font-semibold text-sm">
                  <li><a href="#" className="text-primary hover:underline">Introduction</a></li>
                  <li><a href="#" className="text-foreground hover:text-primary transition-colors">Core Concepts</a></li>
                  <li><a href="#" className="text-foreground hover:text-primary transition-colors">AI Implementation</a></li>
                  <li><a href="#" className="text-foreground hover:text-primary transition-colors">Conclusion</a></li>
                  <li><a href="#" className="text-foreground hover:text-primary transition-colors">FAQs</a></li>
               </ul>
               <div className="mt-10 p-5 bg-gradient-to-br from-primary to-indigo-800 rounded-xl text-white shadow-xl shadow-primary/20">
                 <Sparkles className="w-6 h-6 mb-3 text-indigo-300" />
                 <h4 className="font-black text-lg mb-2 leading-tight">Stop reading, start building.</h4>
                 <p className="text-xs text-indigo-100 mb-4 opacity-90 line-clamp-3">Connect your accounts to FinGenius AI and get personalized wealth projections instantly.</p>
                 <Link href="/login" className="block text-center w-full py-2 bg-white text-primary font-bold text-xs rounded-md hover:bg-slate-50 transition-colors shadow-sm">Get Started For Free</Link>
               </div>
            </div>
          </aside>
        </div>

        {/* Hub / Connected Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
             <h3 className="text-2xl font-black mb-8">Related Wealth Strategies</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {relatedBlogs.map((rb) => (
                 <Link href={"/blogs/" + rb.slug} key={rb.slug} className="group flex gap-6 p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                       <img src={rb.imageUrl} alt={rb.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                       <h4 className="font-black text-foreground mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">{rb.title}</h4>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Read Now</span>
                    </div>
                 </Link>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

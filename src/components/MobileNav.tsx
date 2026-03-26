'use client';

import { useRouter } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeToggle } from './ThemeToggle';

export function MobileNavButton({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) {
  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeToggle />
      <button 
        onClick={onClick}
        className="p-2 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}

export function MobileNavDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-2xl"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[280px] bg-background border-l border-border shadow-2xl z-[100] flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-none overflow-hidden flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-lg text-foreground">FinGenius</span>
              </div>
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="text-lg font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center justify-between py-2 border-t border-border mt-2">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
            </nav>

            <div className="mt-auto pt-8 border-t border-border flex flex-col gap-4">
              <button 
                onClick={() => { router.push('/login'); onClose(); }}
                className="w-full py-4 bg-primary text-primary-foreground rounded-none font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


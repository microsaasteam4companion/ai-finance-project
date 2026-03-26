'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors focus:outline-none group"
      >
        <span className="text-lg md:text-xl font-bold text-foreground pr-8 group-hover:text-primary transition-colors">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-none flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isOpen ? <Minus className="w-5" /> : <Plus className="w-5" />}
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pb-8 text-muted-foreground font-medium leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "What exactly is FinGenius?",
      answer: "FinGenius is an advanced AI-powered financial mentor that helps you track expenses, optimize taxes, and plan for long-term wealth using artificial intelligence. It's designed to give you elite-level financial guidance at a fraction of the cost."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use bank-grade encryption and partner with Supabase for secure data storage. Your financial privacy is our top priority—we never sell your data and provide full control over what you share."
    },
    {
      question: "How does the AI Tax Wizard work?",
      answer: "Our AI analyzes your income and potential deductions to instantly compare different tax regimes. It helps you identify missing deductions and determines which regime saves you the maximum amount based on your unique profile."
    },
    {
      question: "What is the FIRE Roadmap?",
      answer: "FIRE stands for Financial Independence, Retire Early. Our roadmap calculates exactly when you can stop working based on your current savings, investments, and spending habits. It even provides scenario planning to see how small changes today impact your retirement date."
    },
    {
      question: "Is there a free version available?",
      answer: "Yes! Our Essential plan is free forever and includes core expense tracking and basic AI insights to help you get started on your wealth-building journey."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Common Questions</span>
          <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">Got Questions? We have Answers</h2>
        </div>

        <div className="bg-card rounded-none p-8 md:p-12 border border-border shadow-xl">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

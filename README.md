# 🧠 FinGenius: The AI Wealth Brain

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Groq](https://img.shields.io/badge/AI-LLaMA%203.3%20(70B)-orange?style=for-the-badge)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-blueviolet?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/CSS-Tailwind%204-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**FinGenius** is a premium, AI-powered terminal for household financial optimization. Unlike traditional trackers, FinGenius uses a **Context-Aware AI Engine** to provide holistic financial mentoring, cross-partner tax optimization, and deep portfolio analytics.

---

## 🚀 Key Features

### 1. **AI Savings Coach (Life Event Advisor)**
- **Contextual Awareness**: The AI reads your entire Wealth Profile (Assets, Debt, Risk) before suggesting tips.
- **Life Trigger Presets**: One-tap expert advice for **Bonuses, Marriage, New Baby, and Inheritance**.

### 2. **CA Tax Wizard 2.0**
- **OCR Scanning**: Upload Form 16 or salary slips for instant data extraction via **Tesseract.js**.
- **Regime Modeling**: Interactive comparison of **Old vs New Tax Regimes (FY24-25)**.
- **Deduction Audit**: AI identifies missed HRA, NPS, and 80C/80D opportunities.

### 3. **Couple’s Money Planner**
- **Household Sync**: Securely link partner accounts using a unique Household ID.
- **Joint Optimization**: Automatically optimizes HRA and NPS contributions across both incomes for maximum family savings.

### 4. **Portfolio X-Ray & FIRE Planner**
- **Performance Tracking**: Estimated **XIRR** vs. Nifty 50 benchmarks.
- **AI Rebalancing**: Step-by-step Buy/Sell checklists to maintain your risk-aligned asset allocation.
- **FIRE Roadmap**: Month-by-month retirement path with an AI-generated investment glide path.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Framer Motion (Animations).
- **AI Backend**: LLaMA 3.3 (70B) powered by **Groq Cloud** (Sub-second inference).
- **Database & Auth**: Supabase (PostgreSQL + RLS).
- **OCR & Parsing**: Tesseract.js (Client-side) & PDF-Parse (Server-side).
- **Payments**: Razorpay Integration (Premium Gating).
- **Visuals**: Recharts (Financial DataViz) & Lucide React (Icons).

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Account
- Groq API Key

### 2. Installation
```bash
git clone https://github.com/anuragkumarprajapati8-star/FinGenius.git
cd FinGenius
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=your_razorpay_id
```

### 4. Run Locally
```bash
npm run dev
```

---

## 🛡️ Security & Privacy
- **Data Isolation**: Multi-tenant architecture via Supabase Row-Level Security.
- **Privacy-First AI**: All AI processing is contextualized per-session and never stored for training.

---

## 👨‍💻 Author
**Anurag Kumar Prajapati**
- GitHub: [@anuragkumarprajapati8-star](https://github.com/anuragkumarprajapati8-star)

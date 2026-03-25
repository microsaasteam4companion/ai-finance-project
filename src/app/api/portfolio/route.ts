import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

import { verifyPremiumStatus } from '@/lib/premiumVerify';
import { extractTextFromPDF } from '@/lib/pdfService';
import { supabase } from '@/lib/supabaseClient';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let text = '';
    let userId = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      userId = formData.get('userId') as string;
      const file = formData.get('file') as File;
      
      if (file && file.type === 'application/pdf') {
        const buffer = Buffer.from(await file.arrayBuffer());
        text = await extractTextFromPDF(buffer);
      } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or use an image for OCR.' }, { status: 400 });
      }
    } else {
      const body = await req.json();
      text = body.text;
      userId = body.userId;
    }

    if (!userId) {
       return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const isPremium = await verifyPremiumStatus(userId);
    if (!isPremium) {
       return NextResponse.json({ error: 'FinGenius Premium required to access Portfolio X-Ray.' }, { status: 403 });
    }

    if (!text || text.length < 10) {
       return NextResponse.json({ error: 'Could not extract enough text from the document. Please try a clearer scan or an image.' }, { status: 400 });
    }

    const { data: profile } = await supabase.from('profiles').select('risk_profile').eq('id', userId).single();
    const riskProfile = profile?.risk_profile || 'moderate';

    const prompt = `
You are an elite SEBI-registered Mutual Fund Portfolio Analyst.
Analyze this heavily unstructured OCR text extracted from an Indian CAMS / KFintech Consolidated Account Statement (CAS):
"${text}"

User Risk Profile: ${riskProfile}

1. Guess/Extract the total portfolio value if visible.
2. Identify the Top 3-5 Mutual funds / AMC names present in the text.
3. Estimate the Equity vs Debt split based purely on the detected fund names.
4. Estimate the Portfolio XIRR (%) based on current value vs likely historical NAVs of identified funds.
5. Provide a Benchmark Return (%) (assume Nifty 50 TRI ~14-16%).
6. Generate a 3-step Rebalancing Plan (Buy/Sell/Hold) to align this portfolio with a "${riskProfile}" risk profile.

Output exactly this JSON format:
{
  "totalValue": 550000,
  "equityPercent": 85,
  "debtPercent": 15,
  "estimatedXirr": 18.2,
  "benchmarkReturn": 15.1,
  "topFunds": ["Parag Parikh Flexi Cap Fund", "Nippon India Small Cap", "SBI Liquid Fund"],
  "insights": [
     "High Overlap Warning: Both your Large Cap and Flexi Cap hold 30% HDFC Bank.",
     "Consider moving from Regular to Direct plans to save ~1% on Expense Ratios."
  ],
  "rebalancingPlan": [
    { "action": "Sell", "fund": "Small Cap Fund", "reason": "Exposure too high for ${riskProfile} profile." },
    { "action": "Buy", "fund": "Index Fund", "reason": "Increase stability with Nifty 50." }
  ]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return NextResponse.json(parsed);
  } catch(error: any) {
    console.error('Portfolio API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

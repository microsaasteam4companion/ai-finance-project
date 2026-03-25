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
    let manualIncome: number | undefined;

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
      manualIncome = body.manualIncome;
    }

    if (!userId) {
       return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const isPremium = await verifyPremiumStatus(userId);
    if (!isPremium) {
       return NextResponse.json({ error: 'FinGenius Premium required to access CA Tax Wizard.' }, { status: 403 });
    }

    const { data: profile } = await supabase.from('profiles').select('risk_profile').eq('id', userId).single();
    const riskProfile = profile?.risk_profile || 'moderate';

    const prompt = `
You are an expert Indian Chartered Accountant (CA) AI.
Analyze ${manualIncome ? 'this provided Gross Annual Income: ' + manualIncome : 'this raw OCR text extracted from an Indian Form 16, salary slip, or tax document: "' + text + '"'}

The user has a **${riskProfile}** risk profile. Rank investments accordingly.

1. ${manualIncome ? 'Use the provided Gross Annual Income of ' + manualIncome + '.' : 'Extract the Estimated Gross Annual Income from the text.'}
   - CRITICAL: If you find a monthly salary amount (e.g., 45,000), multiply it by 12 to get the Annual Income.
2. Compare the Old Tax Regime vs New Tax Regime taxes for this exact Annual income level for FY 2024-25.
3. Identify precisely which deductions are likely MISSING or underutilized (Section 80C, 80D, HRA, LTA, NPS) based on the input.
4. Suggest the optimal regime.
5. Provide a list of exactly 5 tax-saving investments (ELSS, PPF, NPS, VPF, Sukanya Samriddhi) ranked by suitability for a **${riskProfile}** investor.
6. For each investment, classify Risk (Low/Medium/High) and Liquidity (Low/Medium/High).

Output exactly this JSON format:
{
  "estimatedIncome": 540000,
  "isAnnualized": true,
  "oldRegimeTax": 0,
  "newRegimeTax": 0,
  "recommendedRegime": "New Regime better for low income.",
  "suggestions": [
     "Standard deduction of ₹50k is automatic.",
     "Section 80C allows ₹1.5L savings if you choose Old Regime."
  ],
  "investmentRanking": [
    { "name": "ELSS", "risk": "High", "liquidity": "Medium", "suitability": "Top pick for long-term wealth." },
    { "name": "PPF", "risk": "Low", "liquidity": "Low", "suitability": "Safe, tax-free returns." }
  ],
  "regimeBreakdown": {
     "old": { "stdDeduction": 50000, "investmentsAllowed": true },
     "new": { "stdDeduction": 75000, "investmentsAllowed": false }
  }
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch(error: any) {
    console.error('Tax API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

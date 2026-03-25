import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { groq } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { userId, partnerId } = await req.json();

    if (!userId || !partnerId) {
      return NextResponse.json({ error: 'Sync required' }, { status: 400 });
    }

    // Fetch both profiles
    const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: partnerProfile } = await supabase.from('profiles').select('*').eq('id', partnerId).single();

    if (!userProfile || !partnerProfile) {
      return NextResponse.json({ error: 'Profiles not found' }, { status: 404 });
    }

    const prompt = `
You are an expert Indian Financial Planner specializing in Dual-Income Households. 
Analyze these two profiles for a couple:

Partner A:
- Monthly Income: ₹${userProfile.income || 0}
- Tax Bracket: Guess based on income
- Liquid Assets: ₹${userProfile.assets || 0}
- Debt: ₹${userProfile.debt || 0}

Partner B:
- Monthly Income: ₹${partnerProfile.income || 0}
- Tax Bracket: Guess based on income
- Liquid Assets: ₹${partnerProfile.assets || 0}
- Debt: ₹${partnerProfile.debt || 0}

Provide a detailed Joint Optimization Strategy covering:
1. HRA Optimization: Who should claim HRA for maximum tax benefit?
2. NPS Matching: Should both contribute or only the higher earner?
3. SIP Splits: How to split a joint ₹50k investment for maximum tax efficiency.
4. Insurance Advisory: Joint Term Insurance vs Individual.
5. Consolidated Net Worth: ₹${(userProfile.assets + partnerProfile.assets) - (userProfile.debt + partnerProfile.debt)}

Output in JSON format:
{
  "jointNetWorth": number,
  "hraStrategy": "string",
  "npsStrategy": "string",
  "sipSplit": "string",
  "insuranceStrategy": "string",
  "topInsight": "string"
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Joint Optimize API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

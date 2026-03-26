import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

import { verifyPremiumStatus } from '@/lib/premiumVerify';
import { adminDb } from '@/lib/firebaseAdmin';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { transactions, user_name, userId, event } = await req.json();

    if (!userId) {
       return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const isPremium = await verifyPremiumStatus(userId);
    if (!isPremium) {
       return NextResponse.json({ error: 'FinGenius Premium required for AI Coaching.' }, { status: 403 });
    }

    // Fetch full wealth profile from Firestore
    const profileDoc = await adminDb.collection('users').doc(userId).get();
    const profile = profileDoc.data();
    const { assets = 0, debt = 0, risk_profile = 'moderate', emergency_fund = 0 } = profile || {};

    let eventContext = '';
    if (event === 'bonus') eventContext = 'The user just received a Year-End Bonus. Suggest how to split it between debt, investments, and a small treat.';
    else if (event === 'marriage') eventContext = 'The user is planning a marriage. Suggest joint account strategies and long-term goal alignment.';
    else if (event === 'baby') eventContext = 'The user has a new baby. Suggest insurance coverage updates and a child education fund start.';
    else if (event === 'inheritance') eventContext = 'The user received an inheritance. Suggest tax-efficient lump sum investing and avoiding lifestyle creep.';

    const prompt = `You are FinGenius, an expert AI financial mentor. Your tone should be encouraging, professional, and slightly witty.
    
    ${eventContext ? 'SPECIAL EVENT: ' + eventContext : ''}

    USER CONTEXT:
    - Name: ${user_name || 'User'}
    - Total Assets: ₹${assets}
    - Total Debt: ₹${debt}
    - Emergency Fund: ₹${emergency_fund}
    - Risk Profile: ${risk_profile}

    The user has the following recent transactions:
    ${JSON.stringify(transactions)}

    Please analyze their situation. Provide 1 actionable insight or behavioral nudge. 
    ${event ? 'Focus specifically on the ' + event + ' event, but relate it to their existing ₹' + debt + ' debt and ₹' + assets + ' assets.' : 'Make it specific to their spending data and current wealth profile.'}
    Keep the response under 4 sentences. Format it nicely, avoiding complex markdown. Use their name if available.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // Actively supported Groq model
      temperature: 0.7,
      max_tokens: 500,
    });

    const advice = completion.choices[0]?.message?.content || 'Keep tracking your expenses to get personalized insights!';

    return NextResponse.json({ advice });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

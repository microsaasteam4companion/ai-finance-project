import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { verifyPremiumStatus } from '@/lib/premiumVerify';
import { supabaseServer } from '@/lib/supabaseServer';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, userId } = await req.json();

    if (!text || !userId) {
      return NextResponse.json({ error: 'Missing text or userId' }, { status: 400 });
    }

    const isPremium = await verifyPremiumStatus(userId);
    if (!isPremium) {
       return NextResponse.json({ error: 'FinGenius Premium required for Voice Assistant.' }, { status: 403 });
    }

    // 1. Send natural language to Groq for intent mapping
    const prompt = `
You are the brain behind the FinGenius Voice Assistant.
The user just said: "${text}"

Determine their intent. They either want to:
1. "add_transaction": e.g., "Add 500 for lunch", "I spent 10k on rent"
2. "query_spend": e.g., "How much did I spend on food this month?", "What's my travel total?"
3. "unknown": e.g., "Hello", "Tell me a joke"

Output ONLY valid JSON.
Format for add_transaction:
{ "action": "add_transaction", "amount": 500, "category": "food", "type": "expense", "reply": "Added 500 rupees for food." }

Format for query_spend:
{ "action": "query_spend", "category": "food", "reply": "Let me check that for you." }

Format for unknown:
{ "action": "unknown", "reply": "I'm sorry, I can only help log expenses or query your spending." }
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(responseContent);

    // 2. Execute Action based on Intent
    if (parsed.action === 'add_transaction') {
       // Insert into DB
       const { error } = await supabaseServer.from('transactions').insert([{
         user_id: userId,
         amount: parsed.amount,
         category: parsed.category.toLowerCase(),
         type: parsed.type || 'expense',
         payment_method: 'cash',
         date: new Date().toISOString().split('T')[0],
         is_recurring: false
       }]);

       if (error) throw error;
       return NextResponse.json({ success: true, reply: parsed.reply, action: 'add_transaction' });

    } else if (parsed.action === 'query_spend') {
       // Query DB
       const startOfMonth = new Date(); startOfMonth.setDate(1);
       
       let query = supabaseServer
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('type', 'expense')
          .gte('date', startOfMonth.toISOString().split('T')[0]);

       if (parsed.category && parsed.category.toLowerCase() !== 'all') {
          query = query.ilike('category', parsed.category);
       }

       const { data } = await query;
       const total = data ? data.reduce((sum: number, t: any) => sum + Number(t.amount), 0) : 0;
       
       const reply = `You have spent ₹${total.toLocaleString()} on ${parsed.category || 'everything'} this month.`;
       return NextResponse.json({ success: true, reply, action: 'query_spend' });

    } else {
       return NextResponse.json({ success: true, reply: parsed.reply, action: 'unknown' });
    }

  } catch(error: any) {
    console.error('Voice API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { ocrText } = await req.json();

    const prompt = `You are an AI that extracts structured financial data from raw, messy OCR text of a receipt.
    Extract the total amount, the date (in YYYY-MM-DD format if possible, or leave blank), the vendor name, and suggest a category (e.g., Food, Transport, Shopping).
    Only output a strictly valid JSON object. No markdown formatting, no explanation. Just JSON.
    Example: {"amount": 45.50, "date": "2023-10-14", "vendor": "Starbucks", "category": "Food"}
    
    Raw OCR Text:
    ${ocrText}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(resultText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Groq OCR Parsing Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

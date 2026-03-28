import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageData } = await req.json();

    const prompt = `You are a professional financial AI. Analyze this receipt image and extract structured data.
    - amount: Total amount (number)
    - date: Transaction date (YYYY-MM-DD)
    - vendor: Store/Service name
    - category: Assign one of these: [Food, Shopping, Travel, Health, Bills, Others]
    - summary: 1-sentence description (e.g. "Pizza from Domino's")

    Only output a strictly valid JSON object. No markdown, no text.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
              },
            },
          ],
        },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(resultText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Groq Vision Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

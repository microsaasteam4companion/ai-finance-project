import { Groq } from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY || '';

if (!apiKey) {
  console.warn('Missing GROQ_API_KEY environment variable (expected during build if not provided).');
}

export const groq = new Groq({
  apiKey: apiKey || 'placeholder_key'
});

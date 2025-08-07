// src/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get your API key from your Google AI Studio dashboard
// and add it to your environment variables
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Google Generative AI API key in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generativeModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

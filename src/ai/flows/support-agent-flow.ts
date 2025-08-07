
'use server';
/**
 * @fileOverview A support agent AI flow for the admin panel.
 *
 * - analyzeSupportThread - Analyzes a support chat thread and provides a summary and suggested reply.
 * - SupportAgentInput - The input type for the analyzeSupportThread function.
 * - SupportAgentOutput - The return type for the analyzeSupportThread function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// We can't import the Message type directly into the schema because of client/server boundary issues with Zod.
// So we redefine the message structure for the schema.
const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.number(),
  sender: z.enum(['user', 'admin']),
  silent: z.boolean().optional(),
  file_url: z.string().url().optional().describe("URL of an image file attached to the message."),
});

const SupportAgentInputSchema = z.object({
  messages: z.array(MessageSchema).describe("The chat history between the user and admin."),
});
export type SupportAgentInput = z.infer<typeof SupportAgentInputSchema>;

const SupportAgentOutputSchema = z.object({
  summary: z.string().describe("A one-sentence summary of the user's issue or question."),
  suggestedReply: z.string().describe("A concise, professional reply to send to the user."),
});
export type SupportAgentOutput = z.infer<typeof SupportAgentOutputSchema>;

export async function analyzeSupportThread(input: SupportAgentInput): Promise<SupportAgentOutput> {
  return supportAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportAgentPrompt',
  input: {schema: SupportAgentInputSchema},
  output: {schema: SupportAgentOutputSchema},
  prompt: `You are an expert customer support agent for AstralCore, a crypto management platform.
Your task is to analyze a support conversation and assist the admin.

Based on the message history provided, which may include text and images from the user, please do the following:
1.  **Summarize the Issue:** Write a concise, one-sentence summary of the user's problem or question. If they provided an image (indicated by a 'file_url'), explicitly mention that you have analyzed the screenshot in your summary (e.g., "The user is asking about an error shown in their screenshot.").
2.  **Draft a Reply:** Compose a helpful, professional, and empathetic response to the user. Be direct and clear. Address their concerns directly. If their issue seems resolved, draft a polite closing message.

Here is the conversation history:
{{#each messages}}
[{{sender}}] {{text}}
{{#if file_url}}
[Image attached by user]
{{/if}}
{{/each}}
`,
});

const supportAgentFlow = ai.defineFlow(
  {
    name: 'supportAgentFlow',
    inputSchema: SupportAgentInputSchema,
    outputSchema: SupportAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

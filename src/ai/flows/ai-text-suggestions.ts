'use server';
/**
 * @fileOverview A Genkit flow for generating AI text suggestions for landing page elements.
 *
 * - aiTextSuggestionsForLandingPage - A function that generates AI text suggestions based on page purpose.
 * - AiTextSuggestionsForLandingPageInput - The input type for the aiTextSuggestionsForLandingPage function.
 * - AiTextSuggestionsForLandingPageOutput - The return type for the aiTextSuggestionsForLandingPage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiTextSuggestionsForLandingPageInputSchema = z.object({
  pagePurpose: z
    .string()
    .describe(
      'The primary purpose or goal of the landing page (e.g., "sell a new SaaS product", "generate leads for a service business", "promote an event").'
    ),
  pageName: z
    .string()
    .optional()
    .describe('The name of the landing page, if available.'),
  brandName: z
    .string()
    .optional()
    .describe('The brand or company name associated with the landing page, if available.'),
});
export type AiTextSuggestionsForLandingPageInput = z.infer<
  typeof AiTextSuggestionsForLandingPageInputSchema
>;

const AiTextSuggestionsForLandingPageOutputSchema = z.object({
  headlineSuggestion: z
    .string()
    .describe('A catchy and compelling main headline suggestion.'),
  subheadlineSuggestion: z
    .string()
    .describe('A concise subheadline suggestion that elaborates on the main headline.'),
  primaryCtaLabelSuggestion: z
    .string()
    .describe('A clear and action-oriented label suggestion for the primary call-to-action button.'),
  secondaryCtaLabelSuggestion: z
    .string()
    .optional()
    .describe('An optional, alternative label suggestion for a secondary call-to-action button.'),
});
export type AiTextSuggestionsForLandingPageOutput = z.infer<
  typeof AiTextSuggestionsForLandingPageOutputSchema
>;

export async function aiTextSuggestionsForLandingPage(
  input: AiTextSuggestionsForLandingPageInput
): Promise<AiTextSuggestionsForLandingPageOutput> {
  return aiTextSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTextSuggestionsForLandingPagePrompt',
  input: { schema: AiTextSuggestionsForLandingPageInputSchema },
  output: { schema: AiTextSuggestionsForLandingPageOutputSchema },
  prompt: `You are an expert marketing copywriter specializing in high-converting landing pages.
Your task is to generate initial text suggestions for a landing page's headline, subheadline, and call-to-action buttons.
Focus on being concise, impactful, and aligned with the page's purpose.

Page Purpose: {{{pagePurpose}}}
{{#if pageName}}Page Name: {{{pageName}}}{{/if}}
{{#if brandName}}Brand Name: {{{brandName}}}{{/if}}

Please provide creative and effective suggestions for the following:
`,
});

const aiTextSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiTextSuggestionsForLandingPageFlow',
    inputSchema: AiTextSuggestionsForLandingPageInputSchema,
    outputSchema: AiTextSuggestionsForLandingPageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

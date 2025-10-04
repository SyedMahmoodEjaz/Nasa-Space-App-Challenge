'use server';

/**
 * @fileOverview An AI-powered tool for identifying and highlighting new patterns within image datasets.
 *
 * - discoverNewPatterns - A function that handles the discovery of new patterns in image datasets.
 * - DiscoverNewPatternsInput - The input type for the discoverNewPatterns function.
 * - DiscoverNewPatternsOutput - The return type for the discoverNewPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DiscoverNewPatternsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A NASA image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  task: z
    .string()
    .describe(
      'A task description such as detecting changes in a series of images, finding anomalies, or other desired patterns.'
    ),
});
export type DiscoverNewPatternsInput = z.infer<typeof DiscoverNewPatternsInputSchema>;

const DiscoverNewPatternsOutputSchema = z.object({
  analysisResult: z
    .string()
    .describe(
      'A detailed report of the discovered patterns, anomalies, or changes in the image, including any relevant data and visual representations.'
    ),
});
export type DiscoverNewPatternsOutput = z.infer<typeof DiscoverNewPatternsOutputSchema>;

export async function discoverNewPatterns(input: DiscoverNewPatternsInput): Promise<DiscoverNewPatternsOutput> {
  return discoverNewPatternsFlow(input);
}

const discoverNewPatternsPrompt = ai.definePrompt({
  name: 'discoverNewPatternsPrompt',
  input: {schema: DiscoverNewPatternsInputSchema},
  output: {schema: DiscoverNewPatternsOutputSchema},
  prompt: `You are an expert AI assistant designed to identify and analyze patterns in NASA image datasets.

You will receive a high-resolution image and a specific task to perform, such as change detection or anomaly identification.

Based on the provided image and task, analyze the image for relevant patterns, anomalies, or changes. Provide a detailed report of your findings.

Image: {{media url=imageDataUri}}
Task: {{{task}}}

Analysis Report:`,
});

const discoverNewPatternsFlow = ai.defineFlow(
  {
    name: 'discoverNewPatternsFlow',
    inputSchema: DiscoverNewPatternsInputSchema,
    outputSchema: DiscoverNewPatternsOutputSchema,
  },
  async input => {
    const {output} = await discoverNewPatternsPrompt(input);
    return output!;
  }
);

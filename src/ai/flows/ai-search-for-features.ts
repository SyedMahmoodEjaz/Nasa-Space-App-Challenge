'use server';

/**
 * @fileOverview AI-powered feature search within NASA image datasets.
 *
 * - aiSearchForFeatures - A function that allows users to search for features within NASA image datasets using AI-powered text descriptions.
 * - AISearchForFeaturesInput - The input type for the aiSearchForFeatures function.
 * - AISearchForFeaturesOutput - The return type for the aiSearchForFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISearchForFeaturesInputSchema = z.object({
  imageDescription: z.string().describe('A text description of the feature to search for within the NASA image dataset.'),
  imageDataUri: z
    .string()
    .describe(
      "A NASA image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AISearchForFeaturesInput = z.infer<typeof AISearchForFeaturesInputSchema>;

const AISearchForFeaturesOutputSchema = z.object({
  relevantCoordinates: z.string().describe('The coordinates of the described feature within the NASA image, or null if not found.'),
  reasoning: z.string().describe('The AI reasoning behind identifying the coordinates.'),
});

export type AISearchForFeaturesOutput = z.infer<typeof AISearchForFeaturesOutputSchema>;

export async function aiSearchForFeatures(input: AISearchForFeaturesInput): Promise<AISearchForFeaturesOutput> {
  return aiSearchForFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchForFeaturesPrompt',
  input: {schema: AISearchForFeaturesInputSchema},
  output: {schema: AISearchForFeaturesOutputSchema},
  prompt: `You are an AI expert in analyzing NASA image datasets. Your task is to identify the coordinates of a specific feature within a given NASA image based on a text description.

  Analyze the following NASA image:
  {{media url=imageDataUri}}

  Based on the image, find the coordinates of the following feature:
  {{{imageDescription}}}

  Return the coordinates of the identified feature, or respond null if the feature is not found. Explain your reasoning for how you identified the feature, which will be displayed to the user.

  Output coordinates as a string.
  `,
});

const aiSearchForFeaturesFlow = ai.defineFlow(
  {
    name: 'aiSearchForFeaturesFlow',
    inputSchema: AISearchForFeaturesInputSchema,
    outputSchema: AISearchForFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

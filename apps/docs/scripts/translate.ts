import { createGoogleGenerativeAI } from '@ai-sdk/google';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import { generateText } from 'ai';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(import.meta.dirname, '..', '.env.local') });

/**
 * Retrieve a file using Bun.file
 * @param path The path to the file
 * @returns The file
 */
export const getFile = async (path: string) => {
  try {
    const file = await fs.readFile(path, 'utf-8');
    if (!file) {
      throw new Error(`File ${path} does not exist`);
    }
    return file;
  } catch (error) {
    console.error(
      `Error reading file ${path}:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};

/**
 * Retrieves a prompt from a file and compiles its variables using Handlebars templating
 * @param promptPath The path to the prompt file
 * @param variables An object containing variables to compile into the template
 * @returns The compiled prompt string with variables replaced
 */
export async function getPrompt(
  promptPath: string,
  variables: Record<string, string> = {}
) {
  const prompt = await getFile(promptPath);
  return Handlebars.compile(prompt)(variables);
}

export async function saveFile(path: string, content: string) {
  try {
    await fs.writeFile(path, content);
  } catch (error) {
    console.error(
      `Error saving file ${path}:`,
      error instanceof Error ? error.message : error
    );
  }
}

//API Key for Google Generative AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

// Function to translate and save the output
export async function translateAndSave(
  language: string,
  prompt: string,
  sourceFile: string,
  destinationFile?: string,
  { perf, mimeType }: { perf?: boolean; mimeType?: string } = {
    perf: true,
    mimeType: 'text/plain',
  }
) {
  try {
    const file = await fs.readFile(sourceFile);
    const start = performance.now();
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      // output: 'no-schema',
      system: prompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Translate the following documentfrom English to "${language}" locale language`,
            },
            {
              type: 'file',
              data: file,
              mimeType: mimeType || `text/plain`,
            },
          ],
        },
      ],
    });
    const translatedText = result.text;

    if (destinationFile) {
      await saveFile(destinationFile, translatedText);
    }

    if (perf) {
      const end = performance.now();
      console.group(`========= ${sourceFile} performance =========`);
      console.info(`Translation took ${Math.round((end - start) / 1000)}s`);
      console.info(`Prompt used ${result.usage?.promptTokens} tokens`);
      console.info(`Completion used ${result.usage?.completionTokens} tokens`);
      console.info(`Total used ${result.usage?.totalTokens} tokens`);
      console.groupEnd();
    }

    return translatedText;
  } catch (error) {
    console.error(`Error translating ${sourceFile}:`, error);
  }
}

// await translateAndSave(
//   'es',
//   await getPrompt('./mdx-translation.md'),
//   path.join(import.meta.dirname, '..', 'content', 'en', 'index.mdx'),
//   './test.mdx',
//   { perf: true }
// ).then(() => console.log('FINISHED'));

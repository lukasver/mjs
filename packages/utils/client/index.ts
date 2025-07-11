'use client';
export * from './dates';

export const copyToClipboard = (text: string) => {
  try {
    navigator?.clipboard?.writeText(text);
  } catch (error) {
    console.error(
      `Failed to copy, navigator is not available: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

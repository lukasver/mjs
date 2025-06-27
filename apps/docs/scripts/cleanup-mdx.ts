import { join } from 'node:path';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';

async function cleanupMdxFile(filePath: string): Promise<void> {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  if (lines.length === 0) {
    return;
  }

  let startIndex = 0;
  let endIndex = lines.length - 1;

  // Check if first line is a code fence
  const firstLine = lines[0]?.trim();
  if (firstLine === '```mdx') {
    startIndex = 1;
  }

  // Check if first line starts with "title" and needs frontmatter delimiter
  if (firstLine?.startsWith('title:')) {
    lines.unshift('---');
    startIndex = 0;
  }

  // Find the actual last line by skipping trailing empty lines
  while (endIndex >= 0 && lines[endIndex]?.trim() === '') {
    endIndex--;
  }

  // Check if last non-empty line is a code fence
  const lastLine = lines[endIndex]?.trim();
  if (lastLine === '```') {
    endIndex--;
  }

  // Only rewrite the file if we found changes to make
  if (startIndex > 0 || endIndex < lines.length - 1 || lines[0] === '---') {
    const cleanedContent = lines.slice(startIndex, endIndex + 1).join('\n');
    await writeFile(filePath, cleanedContent);
  }
}

const processRecursively = async (localeDir: string): Promise<void> => {
  const entries = await readdir(localeDir);
  const processPromises = entries.map(async (entry) => {
    const fullPath = join(localeDir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      // Recursively process subdirectories
      await processRecursively(fullPath);
    } else if (entry.endsWith('.mdx')) {
      await cleanupMdxFile(fullPath);
    }
  });

  await Promise.allSettled(processPromises);
};

async function main() {
  const src = join(import.meta.dirname, '..', 'content');
  const files = await readdir(src);

  const locales: string[] = [];

  for (const locale of files) {
    // handle only locales with 2 characters
    if (locale === 'en' || locale?.length !== 2) {
      continue;
    }
    const entryPath = join(src, locale);
    const stats = await stat(entryPath);
    if (stats.isDirectory()) {
      locales.push(locale);
    }
  }

  const results = await Promise.allSettled(
    locales.map((locale) => processRecursively(join(src, locale)))
  );

  // Log results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`✅ Successfully processed locale: ${locales[index]}`);
    } else {
      console.error(
        `❌ Failed to process locale: ${locales[index]}`,
        result.reason
      );
    }
  });
}

try {
  await main();
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}

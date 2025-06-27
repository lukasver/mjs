import { readdir, stat, mkdir, copyFile, rm } from 'fs/promises';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { translateAndSave, getPrompt } from './translate';

// we need to read the contents folder for en language, since its going to be used as reference
// Iterate over all langauges and for each langauge
// ensure the folder/file structure is the same as in en (some performant way like deterministic hash or other)
// If content structure is the same, then do nothing for that language
// If content structure is different, then copy all files recursively from contents/en to the new folder ONLY

/**
 * Get a deterministic hash representing the directory structure
 */
async function getDirectoryStructureHash(dirPath: string): Promise<string> {
  const items: string[] = [];

  async function traverse(currentPath: string, relativePath = '') {
    try {
      const entries = await readdir(currentPath);

      for (const entry of entries.sort()) {
        const fullPath = join(currentPath, entry);
        const entryRelativePath = relativePath
          ? join(relativePath, entry)
          : entry;
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          items.push(`dir:${entryRelativePath}`);
          await traverse(fullPath, entryRelativePath);
        } else {
          items.push(`file:${entryRelativePath}`);
        }
      }
    } catch {
      // Directory doesn't exist or is inaccessible
      console.warn(`Warning: Could not read directory ${currentPath}`);
    }
  }

  await traverse(dirPath);
  const structureString = items.join('\n');
  return createHash('sha256').update(structureString).digest('hex');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy directory structure recursively
 */
async function copyDirectoryStructure(srcDir: string, destDir: string) {
  // First, clear all existing contents in the destination directory
  console.group(`Copying directory structure from ${srcDir} to ${destDir}`);
  try {
    const existingEntries = await readdir(destDir);
    for (const entry of existingEntries) {
      const entryPath = join(destDir, entry);
      await rm(entryPath, { recursive: true, force: true });
      console.log(`Removed: ${relative(process.cwd(), entryPath)}`);
    }
  } catch {
    // Directory might not exist, which is fine
    await mkdir(destDir, { recursive: true });
  }

  async function copyRecursive(src: string, dest: string) {
    try {
      const entries = await readdir(src);

      // Ensure destination directory exists
      await mkdir(dest, { recursive: true });

      for (const entry of entries) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        const stats = await stat(srcPath);

        if (stats.isDirectory()) {
          await copyRecursive(srcPath, destPath);
        } else {
          await copyFile(srcPath, destPath);
          console.log(`Copied: ${relative(process.cwd(), destPath)}`);
        }
      }
    } catch (error) {
      console.error(`Error copying from ${src} to ${dest}:`, error);
    }
  }

  await copyRecursive(srcDir, destDir);
  console.groupEnd();
}

/**
 * Recursively translates files with specified extensions in a directory
 * @param locale The target locale to translate to
 * @param localeDir The directory containing files to translate
 * @param extensions Array of file extensions to process (without dots)
 */
async function translateAndSaveRecursive(
  locale: string,
  localeDir: string,
  extensions: string[],
  options: { perf?: boolean; batchSize?: number } = {}
): Promise<void> {
  const { perf = true, batchSize = 5 } = options;
  // const contentDir = join(import.meta.dirname, '..', 'content');
  // const referenceDir = join(contentDir, 'en');
  const translationPrompt = await getPrompt(
    join(import.meta.dirname, 'mdx-translation.md')
  );
  const translationTasks: Array<{
    relativePath: string;
    sourceFile: string;
    targetFile: string;
  }> = [];

  async function collectTranslationTasks(currentPath: string) {
    try {
      const entries = await readdir(currentPath);

      for (const entry of entries) {
        const fullPath = join(currentPath, entry);

        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          await collectTranslationTasks(fullPath);
        } else {
          const fileExtension = entry.split('.').pop()?.toLowerCase();
          if (fileExtension && extensions.includes(fileExtension)) {
            const relativePath = relative(localeDir, fullPath);
            translationTasks.push({
              relativePath,
              sourceFile: fullPath,
              targetFile: fullPath,
            });
          }
        }
      }
    } catch (error) {
      console.error(
        `Error collecting tasks from directory ${currentPath}:`,
        error
      );
    }
  }

  // First, collect all translation tasks
  await collectTranslationTasks(localeDir);

  if (translationTasks.length === 0) {
    console.log('No files found to translate');
    return;
  }

  console.log(`Found ${translationTasks.length} files to translate`);

  // Process translations in parallel with rate limiting
  const results = [];

  for (let i = 0; i < translationTasks.length; i += batchSize) {
    const batch = translationTasks.slice(i, i + batchSize);
    console.group(
      `Processing batch ${i / batchSize + 1} of ${Math.ceil(
        translationTasks.length / batchSize
      )}`
    );

    const batchPromises = batch.map(
      async ({ relativePath, sourceFile, targetFile }) => {
        try {
          console.log(`Translating ${relativePath} to ${locale}...`);
          await translateAndSave(
            locale,
            translationPrompt,
            sourceFile,
            targetFile,
            { perf: true }
          );
          return { relativePath, success: true };
        } catch (error) {
          return { relativePath, success: false, error };
        }
      }
    );
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults);
    console.groupEnd();

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < translationTasks.length) {
      await sleep(1000);
    }
  }

  // Log results summary
  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;
  const failed = results.filter(
    (r) =>
      r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
  ).length;

  console.log('\n📊 Translation Results:');
  console.log(`✅ Successfully translated: ${successful} files`);
  console.log(`❌ Failed to translate: ${failed} files`);

  // Log failed files if any
  if (failed > 0) {
    console.log('\nFailed translations:');
    results.forEach((result, index) => {
      const task = translationTasks[index];
      if (!task) return;

      if (result.status === 'rejected') {
        console.error(`❌ ${task.relativePath}: ${result.reason}`);
      } else if (result.status === 'fulfilled' && !result.value.success) {
        console.error(`❌ ${result.value.relativePath}: ${result.value.error}`);
      }
    });
  }
}

async function main() {
  const contentDir = join(import.meta.dirname, '..', 'content');
  const referenceDir = join(contentDir, 'en');

  // Get all available locales from the content directory
  const allLocales = await readdir(contentDir);

  const locales = [];

  for (const locale of allLocales) {
    const entryPath = join(contentDir, locale);
    const stats = await stat(entryPath);
    if (stats.isDirectory()) {
      locales.push(locale);
    }
  }

  console.log(`Found locales: ${locales.join(', ')}`);

  // Get reference structure hash
  const referenceHash = await getDirectoryStructureHash(referenceDir);
  console.log(
    `Reference structure hash (en): ${referenceHash.substring(0, 8)}...`
  );

  // Filter out the reference locale
  const targetLocales = locales.filter((locale) => locale !== 'en');

  if (targetLocales.length === 0) {
    console.log('No target locales found to process');
    return;
  }

  // Get structure hashes for all target locales in parallel
  console.log('\nAnalyzing locale structures...');
  const hashPromises = targetLocales.map(async (locale) => {
    const localeDir = join(contentDir, locale);
    const localeHash = await getDirectoryStructureHash(localeDir);

    return {
      locale,
      localeDir,
      localeHash,
      needsUpdate: referenceHash !== localeHash,
    };
  });

  const hashResults = await Promise.allSettled(hashPromises);

  // Process hash results and identify locales that need updates
  const localeAnalysis: Array<{
    locale: string;
    localeDir: string;
    localeHash: string;
    needsUpdate: boolean;
  }> = [];

  hashResults.forEach((result, index) => {
    const locale = targetLocales[index];
    if (!locale) return;

    if (result.status === 'fulfilled') {
      const { localeHash, needsUpdate } = result.value;
      console.log(
        `${locale}: ${localeHash.substring(0, 8)}... ${
          needsUpdate ? '✗ needs update' : '✓ up to date'
        }`
      );
      localeAnalysis.push(result.value);
    } else {
      console.error(`Failed to analyze ${locale}:`, result.reason);
      // Still add to analysis with needsUpdate = true as fallback
      localeAnalysis.push({
        locale,
        localeDir: join(contentDir, locale),
        localeHash: 'error',
        needsUpdate: true,
      });
    }
  });

  // Filter locales that need updates
  const localesNeedingUpdate = localeAnalysis.filter(
    (analysis) => analysis.needsUpdate
  );

  if (localesNeedingUpdate.length === 0) {
    console.log('\n✅ All locales are up to date');
    return;
  }

  // Copy directory structures in parallel for locales that need updates
  console.log(`\nUpdating ${localesNeedingUpdate.length} locale(s)...`);

  const copyPromises = localesNeedingUpdate.map(
    async ({ locale, localeDir }) => {
      console.log(`\nStarting update for ${locale}...`);
      await copyDirectoryStructure(referenceDir, localeDir);
      await translateAndSaveRecursive(locale, localeDir, ['mdx']);
      // timer to avoid rate limiting
      await sleep(1000);
      return { locale, success: true };
    }
  );

  const copyResults = await Promise.allSettled(copyPromises);

  // Report results
  console.log('\n📋 Update Results:');
  copyResults.forEach((result, index) => {
    const localeInfo = localesNeedingUpdate[index];
    if (!localeInfo) return;

    const locale = localeInfo.locale;

    if (result.status === 'fulfilled') {
      console.log(`✅ ${locale}: Successfully updated`);
    } else {
      console.error(`❌ ${locale}: Failed to update -`, result.reason);
    }
  });

  const successCount = copyResults.filter(
    (r) => r.status === 'fulfilled'
  ).length;
  const totalCount = copyResults.length;

  console.log(
    `\n🎉 Translation structure synchronization completed: ${successCount}/${totalCount} locales updated successfully`
  );
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}

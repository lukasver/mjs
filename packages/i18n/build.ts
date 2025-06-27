import * as fs from 'fs/promises';
import path from 'path';
import { deepmerge } from 'deepmerge-ts';

/**
 * Polyfill for __dirname in ESM
 */
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * List of output app folders.
 */
const APPS = ['web', 'docs', 'token', 'globals'];

/**
 * Returns the absolute path to a messages subdirectory.
 */
function getMessagesPath(...segments: string[]) {
  return path.join(__dirname, 'messages', ...segments);
}

/**
 * Returns the absolute path to a dist subdirectory.
 */
function getDistPath(...segments: string[]) {
  return path.join(__dirname, 'dist', ...segments);
}

/**
 * Reads and parses a JSON file. Returns an empty object if not found.
 */
async function readJsonSafe(
  filePath: string
): Promise<Record<string, unknown>> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (_err) {
    return {};
  }
}

/**
 * Writes a JSON object to a file, pretty-printed.
 */
async function writeJson(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Gets the set of all locale codes (filenames without .json) in the given directories.
 */
async function getLocalesFromDirs(...dirs: string[]): Promise<Set<string>> {
  const localeSet = new Set<string>();
  for (const dir of dirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          localeSet.add(file.replace(/\.json$/, ''));
        }
      }
    } catch (_err) {
      // Directory may not exist, skip
    }
  }
  return localeSet;
}

/**
 * Merges web and globals messages for each locale and writes to dist folders.
 */
async function build() {
  // Get all available locales from web and globals
  const globalsLocales = await getLocalesFromDirs(getMessagesPath('globals'));

  for (const app of APPS) {
    const appLocales = await getLocalesFromDirs(getMessagesPath(app));
    const allLocales = new Set([...appLocales, ...globalsLocales]);
    for (const locale of allLocales) {
      const appMessages = await readJsonSafe(
        getMessagesPath(app, `${locale}.json`)
      );
      // Read globals
      const globalsMessages = await readJsonSafe(
        getMessagesPath('globals', `${locale}.json`)
      );
      // Merge
      const merged = deepmerge(appMessages, globalsMessages);
      // Write to dist
      const outPath = getDistPath(app, `${locale}.json`);
      await writeJson(outPath, merged);
    }
  }
  console.log('i18n build complete.');
}

// Run build
build().catch((err) => {
  console.error('i18n build failed:', err);
  process.exit(1);
});

import path from 'node:path';
import fs, { stat } from 'node:fs/promises';
import { DEFAULT_LOCALES } from '.';

/**
 * Polyfill for __dirname in ESM
 */
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Returns the absolute path to a messages subdirectory.
 */
export function getMessagesPath(...segments: string[]) {
  return path.join(__dirname, 'messages', ...segments);
}

/**
 * Returns the absolute path to a messages subdirectory.
 */
export function getPromptsPath(...segments: string[]) {
  return path.join(__dirname, 'prompts', ...segments);
}

/**
 * Returns the absolute path to a dist subdirectory.
 */
export function getDistPath(...segments: string[]) {
  return path.join(__dirname, 'dist', ...segments);
}

/**
 * Reads and parses a JSON file. Returns an empty object if not found.
 */
export async function readJsonSafe(
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
export async function writeJson(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Gets the set of all locale codes (filenames without .json) in the given directories.
 */
export async function getLocalesFromDirs(
  ...dirs: string[]
): Promise<Set<string>> {
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
  if (localeSet.size === 1 && localeSet.has('en')) {
    DEFAULT_LOCALES.forEach((locale) => localeSet.add(locale));
  }

  return localeSet;
}

export const getAppsFromDirs = async () => {
  const files = await fs.readdir(getMessagesPath());
  const appsSet = new Set<string>();
  for (const file of files) {
    try {
      const stats = await stat(getMessagesPath(file));
      if (stats.isDirectory()) {
        appsSet.add(file);
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  }
  return [...appsSet];
};

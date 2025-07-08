import { deepmerge } from 'deepmerge-ts';
import {
  getAppsFromDirs,
  getDistPath,
  getLocalesFromDirs,
  getMessagesPath,
  readJsonSafe,
  writeJson,
} from './utils';

/**
 * Merges web and globals messages for each locale and writes to dist folders.
 */
async function build() {
  // Get all available locales from web and globals
  const [globalsLocales, APPS] = await Promise.all([
    getLocalesFromDirs(getMessagesPath('globals')),
    getAppsFromDirs(),
  ]);
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

import 'server-only';
import { Folder, type PageMapItem } from 'nextra';
import { Locale } from './i18n';

/**
 * Type guard to check if a page item is a folder with children
 */
export const isFolder = (page: PageMapItem): page is Folder => {
  return 'children' in page && Array.isArray(page.children);
};

/**
 * Safely extracts section title from front matter
 * @param frontMatter - The front matter object
 * @returns The section title if it exists and is a string
 */
const getSectionTitleFromFrontMatter = (
  frontMatter: unknown
): string | undefined => {
  if (
    frontMatter &&
    typeof frontMatter === 'object' &&
    'sectionTitle' in frontMatter
  ) {
    const fm = frontMatter as Record<string, unknown>;
    return typeof fm.sectionTitle === 'string' ? fm.sectionTitle : undefined;
  }
  return undefined;
};

/**
 * Extracts the section title from the first child page that has one
 * @param children - Array of child page items
 * @returns The section title or undefined if none found
 */
const extractSectionTitle = (children: PageMapItem[]): string | undefined => {
  for (const child of children) {
    if (child && 'frontMatter' in child) {
      const sectionTitle = getSectionTitleFromFrontMatter(child.frontMatter);
      if (sectionTitle) {
        return sectionTitle;
      }
    }
  }
  return undefined;
};

/**
 * Determines the appropriate title for a page item
 * @param page - The page item to get title for
 * @returns The title string
 */
const getPageTitle = (page: PageMapItem): string => {
  // Get the current title from the page, ensuring it's a string
  const currentTitle =
    'title' in page && typeof page.title === 'string' ? page.title : '';

  // If it's a folder, try to get section title from children
  if (isFolder(page)) {
    const sectionTitle = extractSectionTitle(page.children);
    return sectionTitle || currentTitle;
  }

  return currentTitle;
};

/**
 * Normalize the page map to have the correct title for each page.
 * For folders, it uses the sectionTitle from the first child with frontmatter
 * to allow translation of section names.
 *
 * @param _lang - The language of the page (currently unused but reserved for future i18n)
 * @returns A function that normalizes the page map
 */
export default function normalizePageMap(_lang: Locale) {
  return (pageMap: PageMapItem[]): PageMapItem[] => {
    return pageMap.map((page) => {
      const _page = structuredClone(page);
      if ('title' in _page) {
        _page.title = getPageTitle(_page);
      }
      return _page;
    });
  };
}

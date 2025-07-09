# @mjs/docs

## Content

The [content](apps/docs/content) folder contains the .mdx files which are used to render the documentation content in the site.

The [en](apps/docs/content/en) files are used as reference to automatically generate the translations to all other configurated languages in the [@mjs/i18n](packages/i18n) package.

## Translations

The `generate` script in the package.json is run before building by turbo and is used to:

- generate .mdx from remote content (if configured)
- Ensure the `content` folder has all required files by copying the files from the `en` folder recursively and translating all `.mdx` files and `_meta.jsx` files.
- Parses all results to generate some cleanup for basic formatting errors.

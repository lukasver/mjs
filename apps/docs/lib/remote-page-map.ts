import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from 'nextra/page-map';
import { getRemoteFilePaths } from '@/lib/utils';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import dotenv from 'dotenv';

dotenv.config();

const getRemotePageMap = async () => {
  // Get only english filepath
  const filePaths = await getRemoteFilePaths(
    'mahjongstars/docs/contents/test/en?ref=main'
  );

  const { mdxPages, pageMap } = convertToPageMap({
    filePaths,
    basePath: 'r',
  });
  // `mergeMetaWithPageMap` is used to change sidebar order and title
  const remotePageMap = mergeMetaWithPageMap(pageMap[0]!, {
    simple: {
      title: 'Simple',
      type: 'doc',
      theme: {
        typesetting: 'article',
      },
    },
  });

  return {
    pages: mdxPages,
    pageMap: normalizePageMap(remotePageMap),
  };
};

const generateRemotePageMap = async () => {
  const { pages, pageMap } = await getRemotePageMap();

  const data = {
    pages,
    pageMap,
  };

  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const filePath = join(dataDir, 'remote-page-map.json');
  writeFileSync(filePath, JSON.stringify(data, null, 2));

  // eslint-disable-next-line no-console
  console.log(`✅ Remote page map file generated at ${filePath}`);
};

generateRemotePageMap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Error generating remote page map:', err);
  process.exit(1);
});

export const getRemoteFilePaths = async (path: string) => {
  const token = process.env.GITHUB_TOKEN;
  try {
    const response = await fetch(`https://api.github.com/repos/${path}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const files = await response.json();

    console.debug('🚀 ~ utils.ts:18 ~ files:', files);

    const fileNames = files
      .filter((item: any) => item.type === 'file')
      .map((item: any) => item.name);

    return fileNames;
  } catch (error) {
    console.error(
      '[getRemoteFilePaths] error:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
};

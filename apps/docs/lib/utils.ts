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

		return await response.json();
	} catch (error) {
		console.error(
			"[getRemoteFilePaths] error:",
			error instanceof Error ? error.message : error,
		);
		return [];
	}
};

import type { CoreMessage } from "ai";

type BaseArgs = {
	systemPrompt?: string | { text: string; variables: Record<string, string> };
	model: "gemini-1.5-flash" | (string & {});
	documents?: {
		src: string;
	}[];
};

type ArgsWithMessages = {
	messages: CoreMessage[];
	prompt?: never;
};

type ArgsWithPrompt = {
	prompt: string | { src: string; variables: Record<string, string> };
	messages?: never;
};

export type GenerateArgs = BaseArgs & (ArgsWithMessages | ArgsWithPrompt);

export type GenerateOptions = {
	perf?: boolean;
	save?: {
		path: string;
		name: string;
	};
};

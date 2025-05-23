import "@total-typescript/ts-reset";
import "@total-typescript/ts-reset/dom";

declare global {
	type Awaitable<T> = T | PromiseLike<T>;
	interface PageProps<T = { [key: string]: string }> {
		params: T;
		searchParams: { [key: string]: string | string[] };
	}
}

export {};

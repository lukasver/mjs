import { AppNextApiRequest } from "@/_pages/api/_config";
import HttpStatusCode from "@/common/controllers/httpStatusCodes";
import storage from "@/containers/Settings/storage";
import axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	Method,
} from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";
import useSWR, { Fetcher } from "swr";

export type APIErrorType = {
	message: string;
	status: HttpStatusCode;
	payload?: unknown;
	success: false;
};
export interface APIPayload {
	status: number;
	message: string;
	error?: string;
	[key: string]: any; // TODO: try to narrow this down
}

export const isHTTPSuccessStatus = (code: HttpStatusCode): boolean => {
	if (!code) return false;
	return Number(String(code)[0]) === 2;
};

export const getHeaders = (accessToken = "") => {
	return {
		Authorization: accessToken ? `Bearer ${accessToken}` : "",
		Accept: "application/json",
		"Content-Type": "application/json",
	};
};
interface CallAPI {
	url: string;
	req?: NextApiRequest | AppNextApiRequest;
	res?: NextApiResponse;
	headers?: { [key: string]: string };
	data?: { [key: string]: any };
	params?: { [key: string]: any };
	method?: Method;
}

export const API_BASE_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/api`;

export const fetcher = async (url: string, options?: AxiosRequestConfig) => {
	try {
		const { data } = await axios({
			baseURL: API_BASE_URL,
			url,
			method: "GET" as const,
			headers: { ...(await getHeaders()) },
			...options,
		});

		return data;
	} catch (err) {
		const errors = err as Error | AxiosError;
		if (axios.isAxiosError(errors)) {
			const { response } = errors;
			errors.code = String(response?.status);
			if (response?.status === 401) {
				storage?.clear();
				signOut({
					callbackUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/login`,
				});
			}
			throw errors;
		}
		throw errors;
	}
};

/**
 *
 * Function used for fetching data in client or server side. For calling in serverside, req & res arguments
 * need to be passed, else the fetch would be done in the client
 */
export const callAPI = async <Payload>({
	url,
	req,
	res,
	headers = {},
	method = "GET" as Method,
	data,
	params,
}: CallAPI): Promise<AxiosResponse<Payload>> => {
	let accessToken;

	const isServerSideCall = !!(req && res);

	if (isServerSideCall) {
		accessToken = (await getToken({ req }))?.access_token;
	}

	return axios({
		baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/api`,
		url,
		method,
		headers: {
			...(accessToken && { Authorization: `Bearer ${accessToken}` }),
			...(req && { ...req.headers }),
			...headers,
		},
		data: data || {},
		params: params || {},
	});
};

export const useAPI = <Payload = unknown, Body = unknown>(
	url: string,
	shouldFetch = true,
	options?: AxiosRequestConfig & { data?: Body },
	swrOptions?: object,
) => {
	const { data, error, mutate } = useSWR<Payload, APIErrorType>(
		shouldFetch ? [url, options] : null,
		() => fetcher(url, options),
		{
			// https://swr.vercel.app/docs/error-handling#error-retry
			onErrorRetry: (error, key, _config, revalidate, { retryCount }) => {
				if (key === `@"/transactions",undefined,`) {
					return;
				}
				// Never retry on 404.
				if (error.status === 404) return;

				if (error.status === 409) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
			...swrOptions,
		},
	);

	return {
		data,
		isLoading: !error && !data && !!shouldFetch,
		isError: error && axios.isAxiosError(error) ? error.toJSON() : error,
		isIdle: !shouldFetch,
		mutate,
		key: url,
	};
};

export const SWRFetcher: Fetcher<any, string> = (url) => {
	return axios
		.get(url)
		.then((res) => {
			return res.data;
		})
		.catch((e) => console.error(e));
};

export const fetchService = async <Payload = APIPayload>(
	requestObj: AxiosRequestConfig,
): Promise<{
	data: Payload | null;
	status: HttpStatusCode;
	error?: string;
}> => {
	const config: AxiosRequestConfig = {
		baseURL: API_BASE_URL,
		...requestObj,
		headers: { ...(await getHeaders()), ...requestObj.headers },
	};
	try {
		const response = await axios(config);
		if (response) {
			const { data, status } = response;
			return {
				status,
				data,
			};
		} else {
			return {
				data: null,
				status: 401,
			};
		}
	} catch (e) {
		return {
			data: null,
			status: e.status || 500,
			error: JSON.stringify(e),
		};
	}
};

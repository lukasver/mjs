import { IS_CI } from "@/common/config/contants";
import HttpStatusCode from "@/common/controllers/httpStatusCodes";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { getHeaders } from "./fetch.service";

export interface MinioFileResponse {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	bucket: string;
	key: string;
	acl: string;
	contentType: string;
	contentDisposition: null;
	storageClass: string;
	serverSideEncryption: null;
	metadata: {
		fieldName: string;
		date: string;
	};
	etag: string;
	versionId: null;
}

export interface UploadToMinio {
	bucket?: string;
	imageName: string;
	file: File;
}

interface CallMinioAPIResponse<Payload> {
	data: Payload;
	status: number;
	error?: AxiosError;
}

const minioAxios = axios.create({
	baseURL: "/api/minio",
	timeout: 10000,
	// headers: {'X-Custom-Header': 'foobar'}
});

export const deleteFromMinio = async ({
	bucket = BUCKET,
	imageName,
	accessToken = "",
}) => {
	const config = {
		params: {
			url: imageName,
			bucket,
		},
		method: "DELETE" as const,
		headers: {
			...(await getHeaders()),
			...(accessToken && {
				Authorization: `Bearer ${accessToken}`,
			}),
		},
	};
	return await callMinioAPI(config);
};

// export const uploadToMinio = async ({
//   bucket = BUCKET,
//   imageName,
//   file
// }: UploadToMinio) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const config = {
//     data: formData,
//     params: {
//       imageName,
//       bucket
//     },
//     method: 'POST' as const,
//     headers: { ...getHeaders(), 'content-type': 'multipart/form-data' }
//   };
//   return await callMinioAPI<{
//     status: number;
//     message: string;
//     file: MinioFileResponse[];
//   }>(config);
// };

export const callMinioAPI = async <Payload>(
	config: AxiosRequestConfig,
): Promise<CallMinioAPIResponse<Payload | null>> => {
	try {
		if (!config.headers) {
			config.headers = { ...getHeaders() };
		}
		const response: AxiosResponse<Payload> = await minioAxios(config);
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
			status: e?.status || 500,
			error: e,
		};
	}
};

export const BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET;
export const MINIO_PUBLIC_URL = `https://${process.env.NEXT_PUBLIC_MINIO_URL}/${BUCKET}/`;
export const getAssets = (
	fileName: string,
	options?: { bucket?: string },
): string =>
	`https://cdn.beta.smat.io/${options?.bucket || "assets"}/${fileName}`;

export const resizeImage = async (
	file: File,
	baseUrl: string,
	fileExtension: string,
	masterProjectId: string,
	accessToken?: string,
) => {
	const formData = new FormData();
	formData.append("buffer", file);
	formData.append("baseUrl", baseUrl);
	formData.append("fileExtension", fileExtension);
	formData.append("masterProjectId", masterProjectId);
	axios({
		url: "/api/editImage",
		method: "POST",
		data: formData,
		headers: {
			...(await getHeaders()),
			"Content-Type": "multipart/form-data",
			...(accessToken && {
				Authorization: `Bearer ${accessToken}`,
			}),
		},
	});
};

export const uploadToMinioWithPresigned = async ({
	bucket = BUCKET,
	imageName,
	file,
	accessToken = undefined,
}) => {
	const { data } = await callMinioAPI<{
		status: HttpStatusCode;
		url: string;
	}>({
		method: "PUT" as const,
		headers: {
			...(await getHeaders()),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		},
		params: {
			imageName,
			bucket,
		},
	});
	if (data?.status !== 200 || !data?.url) {
		return toast.error("Error getting presigned URL from Minio");
	}
	if (IS_CI) return;
	return axios(data.url, {
		method: "PUT" as const,
		data: file,
	});
};

export const downloadToMinioWithPresigned = async ({
	bucket = BUCKET,
	url,
}) => {
	const { data } = await callMinioAPI<{
		status: HttpStatusCode;
		url: string;
	}>({
		method: "GET" as const,
		headers: { ...(await getHeaders()) },
		params: {
			bucket,
			url,
		},
	});

	if (data?.status !== 200 || !data?.url) {
		return toast.error("Error getting presigned URL from Minio");
	}

	if (IS_CI) return;

	return axios(data.url, {
		method: "GET" as const,
		responseType: "blob",
	});
};

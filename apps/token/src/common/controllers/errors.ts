import logger from "@/services/logger.service";
import { GET_UNHANDLED_ERROR } from "@/utils";
import { InvariantError } from "@epic-web/invariant";
import { Prisma } from "@prisma/client";
import { isAxiosError } from "axios";
import { z } from "zod";
import {
	IS_DEVELOPMENT,
	IS_PRODUCTION,
	IS_STAGE_SERVER,
} from "../config/contants";
import { LogSeverity } from "../enums";
import HttpStatusCode from "./httpStatusCodes";

export class HttpError extends Error {
	status = HttpStatusCode.INTERNAL_SERVER_ERROR;
	payload;

	constructor(status: HttpStatusCode, message: string, payload?: unknown) {
		super(message);
		this.status = status;
		this.payload = payload;

		Object.setPrototypeOf(this, HttpError.prototype);
	}

	getMessage(): { message: string } {
		return { message: "Something went wrong: " + this.message };
	}
	getStatus(): { status: HttpStatusCode } {
		return { status: this.status };
	}

	getPayload(): { payload?: unknown } {
		return { payload: this.payload };
	}
	getError(): { message: string; status: HttpStatusCode } {
		return { ...this.getMessage(), ...this.getStatus(), ...this.getPayload() };
	}
}

export class DbError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, HttpError.prototype);
	}
}

export const isPrismaError = (
	e: unknown,
): e is Prisma.PrismaClientKnownRequestError => {
	return !!e && e instanceof Prisma.PrismaClientKnownRequestError;
};

/**
 * Helper function to map errors to an structured format that we can use to send to the client
 * and/or log drain
 * To be used serverside only
 * @param e Any error
 * @param {boolean} [log=true] Automatically send log to log drain, defaults TRUE.
 */
export const getError = (
	e: unknown,
	log = true,
): {
	message: string;
	status: number;
	stack?: Error["stack"];
	issues?: { path: string | number; message: string }[];
} => {
	let error: {
		message: string;
		status: number;
		stack?: Error["stack"];
		issues?: { path: string | number; message: string }[];
	} = {
		message: GET_UNHANDLED_ERROR,
		status: HttpStatusCode.INTERNAL_SERVER_ERROR,
	};

	switch (true) {
		case isAxiosError(e):
			error = {
				status: e?.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
				message:
					e?.response?.data?.message ||
					e?.response?.data?.error ||
					JSON.stringify(e?.response?.data || {}),
				...((IS_DEVELOPMENT || IS_STAGE_SERVER) && { stack: e.stack }),
			};
			break;
		case isPrismaError(e):
			error = {
				status: HttpStatusCode.BAD_REQUEST,
				message: `[${e.name}] ${e.message}`,
				...((IS_DEVELOPMENT || IS_STAGE_SERVER) && { stack: e.stack }),
			};
			break;
		case e instanceof HttpError:
			error = {
				status: e.status,
				message: e.message,
				...((IS_DEVELOPMENT || IS_STAGE_SERVER) && { stack: e.stack }),
			};
			break;

		case e instanceof z.ZodError:
			error = {
				...e,
				issues: e.issues.map((e) => ({
					path: e.path[0],
					message: e.message,
				})),
				message: "Zod validation error",
				status: HttpStatusCode.BAD_REQUEST,
			};
			if (IS_PRODUCTION) {
				delete error.stack;
			}
			break;
		case e instanceof InvariantError:
			error = { ...e, status: HttpStatusCode.BAD_REQUEST };
			if (IS_PRODUCTION) {
				delete error.stack;
			}
			break;
		case e instanceof Error:
			error = {
				message: e.message,
				status: HttpStatusCode.INTERNAL_SERVER_ERROR,
				...((IS_DEVELOPMENT || IS_STAGE_SERVER) && { stack: e.stack }),
			};
			break;
		default:
			error = {
				message: GET_UNHANDLED_ERROR,
				status: HttpStatusCode.INTERNAL_SERVER_ERROR,
			};
	}
	if (log) {
		logger(error, LogSeverity.ERROR);
	}
	return error;
};

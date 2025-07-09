import { env } from "../../common/config/env";

// type LogObject =
// 	| {
// 			level: LogSeverity;
// 			time: string;
// 			pid: number;
// 			pathname: string;
// 			hostname: string;
// 			msg: string;
// 			user_id?: string | number;
// 	  }
// 	| {
// 			msg: string;
// 			error: Error["message"];
// 			stack: Error["stack"];
// 	  };

// const logging = new Logging({
// 	projectId: IS_PRODUCTION ? "token-production-smat" : "token-dashboard-364022",
// 	keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

// const reportServer = logging.log("nextjs-server", { removeCircular: true });

// type ServerLoggerConfig = {
// 	labels?: { [k: string]: string };
// 	jsonPayload?: Record<string, string>;
// 	textPayload?: string;
// 	req?: NextRequestWithAuth;
// 	status?: number;
// };

// export const serverLogger = async (
// 	message: LoggerArgs[0],
// 	severity?: LogSeverity,
// 	config: ServerLoggerConfig = {},
// ) => {
// 	console.debug(
// 		`[${severity}]: ${
// 			typeof message === "string" ? message : JSON.stringify(message)
// 		}`,
// 	);
// 	const { req, status, ...logEntry } = config;
// 	const entry = reportServer.entry(
// 		{
// 			resource: { type: "api", labels: { name: "nextjs-server" } },
// 			severity: severity || LogSeverity.DEFAULT,
// 			...(!!req && {
// 				httpRequest: {
// 					requestMethod: req.method,
// 					requestUrl: req.nextUrl.href,
// 					referer:
// 						req.headers.get("referer") || req.headers.get("x-forwarded-host"),
// 					userAgent: req.headers.get("user-agent"),
// 					status,
// 					remoteIp: getIp(req),
// 				},
// 			}),
// 			...logEntry,
// 		},
// 		message,
// 	);
// 	const logLevel =
// 		severity === LogSeverity.DEFAULT
// 			? "write"
// 			: (severity?.toLowerCase() ?? "write");
// 	await reportServer[logLevel](entry).catch(console.error);
// };

// export const getIp = (req: ServerLoggerConfig["req"]) => {
// 	return (
// 		req?.headers?.["x-forwarded-for"] ||
// 		req?.headers["x-real-ip"] ||
// 		req?.headers.get("x-forwarded-for") ||
// 		req?.headers.get("x-real-ip")
// 	);
// };

// type LoggerArgs = [
// 	string | LogObject | Error | ReturnType<typeof getError>,
// 	LogSeverity?,
// 	ServerLoggerConfig?,
// ];

// const logger = (...args: LoggerArgs) => {
// 	const [m, severity, config] = args;

// 	let messageToSend: LoggerArgs[0] = m;

// 	if (typeof m === "string") {
// 		messageToSend = m;
// 	}
// 	if (m instanceof Error) {
// 		messageToSend = {
// 			msg: m.name,
// 			error: m.message,
// 			stack: m.stack,
// 		};
// 	}
// 	if (m instanceof AxiosError) {
// 		const body = m?.response?.data;
// 		messageToSend = {
// 			msg: m.name,
// 			error:
// 				body?.error || body?.message || body ? JSON.stringify(body) : m.message,
// 			stack: m?.stack,
// 		};
// 	}
// 	if (m instanceof ZodError) {
// 		messageToSend = {
// 			msg: m.name,
// 			error: m.message || GET_UNHANDLED_ERROR,
// 			stack: JSON.stringify(m.flatten()) || m.stack,
// 		};
// 	}

// 	if (IS_DEVELOPMENT || IS_TEST) {
// 		return console.debug(`[${severity}] ${JSON.stringify(messageToSend)}`);
// 	}
// 	return serverLogger(messageToSend, severity, config);
// };

const log = (...args: unknown[]) => {
	if (env.IS_DEV || env.DEBUG) {
		console.debug("\x1b[31m%s\x1b[0m", ...args);
	}
};

export default log;

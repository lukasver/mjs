import { LogSeverity } from "@/common/enums";
import { JWTUser } from "@/common/types/next-auth";
import logger from "@/services/logger.service";
import axios from "axios";

enum PROMO_CODES {
	AMBASSADOR = "Strategic2023*",
}

const ACCESS_TOKEN = process.env.ZITADEL_ADMIN_SERVICE_ACCOUNT_PAT;

export const checkAndAssignRole = ({
	code,
	user,
}: {
	code: string;
	user: JWTUser;
}) => {
	if (
		!Object.values(PROMO_CODES).includes(code as PROMO_CODES) ||
		!ACCESS_TOKEN
	) {
		return;
	}
	try {
		axios({
			method: "POST",
			url: `${process.env.ZITADEL_ISSUER}/management/v1/users/${user.id}/grants`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${ACCESS_TOKEN}`,
				"x-zitadel-orgid": process.env.ZITADEL_ORG_ID,
			},
			data: {
				userId: user.id,
				projectId: process.env.ZITADEL_PROJECT_ID,
				roleKeys: Object.entries(PROMO_CODES).reduce((agg, [key, value]) => {
					if (code === value) {
						agg.push(key);
					}
					return agg;
				}, [] as string[]),
			},
		});
	} catch (e) {
		logger(e, LogSeverity.ERROR);
	}
};

import { parseArgs } from "node:util";
import { ROLES } from "@/common/config/constants";
import { invariant } from "@epic-web/invariant";
import { PrismaClient } from "@prisma/client";
import log from "../lib/services/logger.server";
import { seedBlockchains } from "./scripts/blockchains";
import { seedRoles, seedUserRoles } from "./scripts/roles";
import { seedOpenSale } from "./scripts/sales";
import { seedUsers } from "./scripts/users";

const TEST_ADMIN_WALLET = "0x8f75517e97e0bB99A2E2132FDe0bBaC5815Bac70";

const options = {
	environment: { type: "string" as const },
};

const prisma = new PrismaClient();

async function main() {
	const {
		values: { environment },
	} = parseArgs({ options });
	invariant(environment, "Environment is required");
	try {
		log(`Not implemented: ${environment}`);
		switch (environment) {
			case "development": {
				await seedRoles(prisma);
				await seedUsers(
					[
						{
							walletAddress: TEST_ADMIN_WALLET,
							name: "Admin MJS",
							email: "lucas@smat.io",
						},
					],
					prisma,
				).then((r) => {
					return seedUserRoles(
						r.map((user) => ({
							id: user.id,
							role: ROLES.SUPER_ADMIN,
						})),
						prisma,
					);
				});

				// await seedTransactions(prisma);
				await seedBlockchains(prisma);
				await seedOpenSale(prisma);
				// await deleteAndRecreateOriginalSaleTransactions(prisma);
				break;
			}

			case "test":
				/** data for your test environment */
				break;
			case "production":
				if (process.env.NODE_ENV !== "production") {
					throw new Error(
						"This script is only for PRODUCTION environments, check env vars",
					);
				}
				// await deleteAndRecreateOriginalSaleTransactions(prisma);
				await seedBlockchains(prisma);
				break;
			default:
				break;
		}
	} catch (error) {
		console.error("Error al importar datos:", error);
	} finally {
		// Cierra la conexión de Prisma al finalizar
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error("Error en la función principal:", error);
	process.exit(1);
});

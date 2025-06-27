import { parseArgs } from "node:util";
import log from "@/lib/services/logger.server";
import { PrismaClient } from "@prisma/client";

const options = {
	environment: { type: "string" as const },
};

const prisma = new PrismaClient();

async function main() {
	const {
		values: { environment },
	} = parseArgs({ options });
	try {
		log(`Not implemented: ${environment}`);
		// switch (environment) {
		// 	case "development":
		// 		if (!IS_DEVELOPMENT) {
		// 			throw new Error(
		// 				"This script is only for DEVELOPMENT environments, check env vars",
		// 			);
		// 		}
		// 		await seedTransactions(prisma);
		// 		await seedBlockchains(prisma);
		// 		await seedOpenSale(prisma);
		// 		await deleteAndRecreateOriginalSaleTransactions(prisma);
		// 		break;
		// 	case "test":
		// 		/** data for your test environment */
		// 		break;
		// 	case "production":
		// 		if (!IS_PRODUCTION) {
		// 			throw new Error(
		// 				"This script is only for PRODUCTION environments, check env vars",
		// 			);
		// 		}
		// 		// await deleteAndRecreateOriginalSaleTransactions(prisma);
		// 		await seedBlockchains(prisma);
		// 		break;
		// 	default:
		// 		break;
		// }
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

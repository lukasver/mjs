import { ALLOWED_CHAINS } from "@/services/crypto/config";
import { PrismaClient } from "@prisma/client";

export async function seedBlockchains(prisma: PrismaClient) {
	const response = await prisma.blockchain.createMany({
		data: ALLOWED_CHAINS.map(({ id, name }) => ({
			name: name,
			id: id,
		})),
	});
	console.log("Blockchains created:", response?.count);
}

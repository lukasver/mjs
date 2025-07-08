import { z } from 'zod';

export const GetTokenVerificationDto = z.object({
  token: z.string(),
});

export type GetTokenVerificationDto = z.infer<typeof GetTokenVerificationDto>;

export const CreateEmailVerificationDto = z.object({
  email: z.string().email(),
  token: z.string(),
  userId: z.string(),
});

export type CreateEmailVerificationDto = z.infer<
  typeof CreateEmailVerificationDto
>;

export const DeleteTokenDto = z.object({
  // Uses userId from context
});

export type DeleteTokenDto = z.infer<typeof DeleteTokenDto>;

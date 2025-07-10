import { FIAT_CURRENCIES } from '@/common/config/constants';
import { FormInputProps } from '@mjs/ui/primitives/form-input';
import z from 'zod';

export const formSchemaShape = {
  name: z.string().min(1, 'Sale name required'),
  tokenName: z.string().min(1, 'Token name required'),
  tokenSymbol: z
    .string()
    .max(6, 'Token symbol must be at most 6 characters')
    .min(1, 'Token symbol required'),
  tokenContractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/g, 'Invalid token contract address')
    .min(1, 'Token contract address required')
    .optional(),
  tokenContractChainId: z.number().int().optional(),
  tokenPricePerUnit: z
    .number()
    .min(0.01, 'Price per unit must be at least 0.01')
    .min(1, 'Price per unit required'),
  saleCurrency: z.enum(
    FIAT_CURRENCIES as unknown as [
      string,
      ...(typeof FIAT_CURRENCIES)[number][]
    ],
    {
      required_error: 'Sale currency required',
      invalid_type_error: 'Invalid currency',
    }
  ),
  toWalletsAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/g, 'Invalid wallet address')
    .min(1, 'Wallet address required'),
  saleStartDate: z
    .date()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      'Please choose a future date for the start date'
    ),
  saleClosingDate: z.date(),
  initialTokenQuantity: z
    .number()
    .int()
    .min(1, 'Initial token quantity must be at least 1')
    .min(1, 'Initial token quantity required'),
  availableTokenQuantity: z
    .number()
    .int()
    .min(0, 'Available token quantity must be at least 0')
    .max(
      Number.MAX_SAFE_INTEGER,
      'Available quantity cannot exceed initial quantity'
    )
    .min(1, 'Available token quantity required'),
  minimumTokenBuyPerUser: z
    .number()
    .int()
    .min(1, 'Minimum buy per user must be at least 1')
    .max(Number.MAX_SAFE_INTEGER, 'Minimum cannot exceed initial quantity')
    .min(1, 'Minimum buy per user required'),
  maximumTokenBuyPerUser: z
    .number()
    .int()
    .max(Number.MAX_SAFE_INTEGER, 'Maximum cannot exceed initial quantity')
    .nullable()
    .refine(
      (val: number | null) => val === null || val > 0,
      'Maximum buy per user must be greater than 0'
    ),
  saftCheckbox: z.boolean().default(false),
};

export const FormSchema = z.object(formSchemaShape).superRefine((data, ctx) => {
  if (
    data.saleClosingDate &&
    data.saleStartDate &&
    data.saleClosingDate <= data.saleStartDate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End date must be after the start date',
      path: ['saleClosingDate'],
    });
  }
  if (data.tokenContractAddress && !data.tokenContractChainId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Blockchain is required when token contract is specified',
      path: ['tokenContractChainId'],
    });
  }
});

export type InputProps = {
  [key in keyof typeof formSchemaShape]: Omit<FormInputProps, 'name'> & {
    optionKey?: string;
  };
};

export const InputProps = {
  name: { type: 'text' },
  tokenName: { type: 'text' },
  tokenSymbol: { type: 'text' },
  tokenContractAddress: { type: 'text' },
  tokenContractChainId: { type: 'select' },
  tokenPricePerUnit: {
    type: 'number',
    inputProps: { inputMode: 'decimal', autoComplete: 'off' },
  },
  saleCurrency: {
    type: 'select',
    optionKey: 'currency',
  },
  toWalletsAddress: { type: 'text' },
  saleStartDate: { type: 'text' },
  saleClosingDate: { type: 'text' },
  initialTokenQuantity: {
    type: 'number',
    inputProps: { inputMode: 'decimal', autoComplete: 'off' },
  },
  availableTokenQuantity: {
    type: 'number',
    inputProps: { inputMode: 'decimal', autoComplete: 'off' },
  },
  minimumTokenBuyPerUser: {
    type: 'number',
    inputProps: { inputMode: 'decimal', autoComplete: 'off' },
  },
  maximumTokenBuyPerUser: {
    type: 'number',
    inputProps: { inputMode: 'decimal', autoComplete: 'off' },
  },
  saftCheckbox: { type: 'checkbox' },
} as InputProps;

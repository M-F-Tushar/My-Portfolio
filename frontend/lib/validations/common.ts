import { z } from 'zod';

export const optionalUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine((value) => !value || value.startsWith('http') || value.startsWith('mailto:'), {
    message: 'URL must start with http, https, or mailto',
  });

export const visibleSchema = z.object({
  visible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

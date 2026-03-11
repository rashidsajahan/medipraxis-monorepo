import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1),
  mobile_number: z.string().min(1),
  mobile_country_code: z.string().min(1),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  mobile_number: z.string().min(1),
  mobile_country_code: z.string().min(1),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

/* ---------------- TYPES (DERIVED) ---------------- */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

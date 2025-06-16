import { z } from "zod";
import { UserRoleSchema } from "./enums";

export const TokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
});

export const TokenDataSchema = z.object({
    email: z.string().email(),
    user_id: z.string().uuid(),
    user_role: UserRoleSchema
});

export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
    user_role: UserRoleSchema
});

export type Token = z.infer<typeof TokenSchema>;
export type TokenData = z.infer<typeof TokenDataSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

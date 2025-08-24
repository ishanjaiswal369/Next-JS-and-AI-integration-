import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const singUpSchema = z.object({
    username: usernameValidation,
    email: z
        .string()
        .min(5, "Email must be at least 5 characters long")
        .max(50, "Email must be at most 50 characters long"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
})

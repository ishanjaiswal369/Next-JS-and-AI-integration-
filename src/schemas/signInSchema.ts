import {z} from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .min(5, "Email must be at least 5 characters long")
        .max(50, "Email must be at most 50 characters long")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
}) 
import {z} from "zod";

export const messageSchema = z.object({
    content : z.string()
        .min(10, "Content is required")
        .max(500, "Content must be less than 500 characters"),
})
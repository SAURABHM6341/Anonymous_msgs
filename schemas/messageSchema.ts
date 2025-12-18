import {z} from 'zod';
export const MessageSchemaValidation = z.object({
    content: z.string().min(2, "Content is required").max(300, "Content is too long(300 characters max)"),
    createdAt: z.date().optional()
})
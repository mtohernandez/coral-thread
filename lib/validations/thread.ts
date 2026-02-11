import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Thread must be at least 3 characters long" })
    .max(280, { message: "Thread must be less than 280 characters long" }),
  image: z.string().url().optional().or(z.literal("")),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Thread must be at least 3 characters long" })
    .max(280, { message: "Thread must be less than 280 characters long" }),
});

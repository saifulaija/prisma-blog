import { z } from 'zod';

const createBlogSchema = z.object({
  body:z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    image: z.string().optional(),
    authorId: z.string(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]), // Assuming Visibility is an enum
    createdAt: z.string(), // Assuming createdAt is a string in ISO format
    updatedAt: z.string(),
  })
});

export const blogValidationSchema = {
   createBlogSchema
};

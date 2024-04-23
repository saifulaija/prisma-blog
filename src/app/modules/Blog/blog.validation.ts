import { z } from 'zod';

const createBlog = z.object({
  body:z.object({
    
    title: z.string(),
    content: z.string(),
    image: z.string().optional(),
    authorId: z.string(),
    views:z.number().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]), // Assuming Visibility is an enum
    createdAt: z.string(), // Assuming createdAt is a string in ISO format
    updatedAt: z.string(),
  })
});


const updateBlog = z.object({
   body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    category:z.string().optional()
   }),
});




export const blogValidationSchema = {
   createBlog,updateBlog
};

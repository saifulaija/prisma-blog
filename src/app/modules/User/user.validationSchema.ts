import { z } from "zod";

// const createAdminSchema = z.object({
//    password: z.string({ required_error: 'Password is required' }),
//    admin: z.object({
//       name: z.string({ required_error: 'Name is required' }),
//       email: z.string({ required_error: 'Email is required' }),
//       contactNumber: z.string({ required_error: 'Contact number is required' }),
//    }),
// });

const createAdminSchema = z.object({
  body: z.object({
    password: z.string(),
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
  }),
});

const userUpdateStatus = z.object({
   body: z.object({
     status: z.enum([ 'ACTIVE', 'BLOCKED','DELETED']),
   }),
 });

export const userValidationSchema = {
  createAdminSchema,userUpdateStatus
};

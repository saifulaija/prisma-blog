import { Admin, UserRole } from '@prisma/client';

import prisma from '../../../shared/prismaClient';
import { FileUploadHelper } from '../../../helpers/fileUploader';
import { IUploadFile } from '../../interfaces/file';
import { hashedPassword } from './user.utils';
import { Request } from 'express';


const createAdmin = async (payload:any) => {
  const {password,...admin}=payload
 

 
   const hashPassword = await hashedPassword(password);

   const result = await prisma.$transaction(async transactionClient => {
     const newUser = await transactionClient.user.create({
       data: {
         email:admin.email,
         password: hashPassword,
         role: UserRole.ADMIN,
       },
     });
     console.log({newUser})
     const newAdmin = await transactionClient.admin.create({
       data:admin,
     });
 
     return newAdmin;
   });
 
   return result;
 };
const createAuthor = async (payload:any) => {
  const {password,...author}=payload
 

 
   const hashPassword = await hashedPassword(password);

   const result = await prisma.$transaction(async transactionClient => {
     const newUser = await transactionClient.user.create({
       data: {
         email:author.email,
         password: hashPassword,
         role: UserRole.BLOGGER,
       },
     });
     
     const newAdmin = await transactionClient.author.create({
       data:author,
     });
 
     return newAdmin;
   });
 
   return result;
 };

export const userServices = {
   createAdmin,createAuthor
};

import { Blog } from "@prisma/client"
import prisma from "../../../shared/prismaClient"

const craeteBlogIntoDb=async(payload:Blog,user:any)=>{
    console.log(user.email)

    const authorData=await prisma.author.findUniqueOrThrow({
        where:{
     email:user.email
        }
    });
    

const result =await prisma.blog.create({
    data:{...payload,authorId:authorData.id}
})
return result
}

export const blogServicres={
    craeteBlogIntoDb
}
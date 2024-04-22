import { Blog } from "@prisma/client"

const craeteBlogIntoDb=async(data:Blog)=>{
    console.log(data)
}

export const blogServicres={
    craeteBlogIntoDb
}
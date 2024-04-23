import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { LikeServices } from "./like.service";

const like = catchAsync(async (req: Request & {user?:any}, res: Response) => {
    const { id } = req.params;
    const user=req.user;
  
  
    const result = await LikeServices.like(id, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "like created  successfully!",
      data: result,
    });
  });


  const unlike = catchAsync(async (req: Request & {user?:any}, res: Response) => {
    const { id } = req.params;
    const user=req.user;
   
  
    const result = await LikeServices.unLike(id, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "like deleted  successfully!",
      data: result,
    });
  });

  export const LikeControllers={
like,unlike
  }
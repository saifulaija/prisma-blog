import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { CommentServices } from "./comment.service";
import { Request, Response } from "express";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServices.createCommentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully!",
    data: result,
  });
});
const updateMyComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommentServices.updateCommentIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully!",
    data: result,
  });
});

export const CommentControllers = {
  createComment,updateMyComment
};

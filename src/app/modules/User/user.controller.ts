import { Request, Response } from "express";

import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { userServices } from "./user.service";
import { filterValidQueryParams } from "../../../shared/filterValidQueryParams";
import { userValidParams } from "./user.constant";
import { paginationAndSortingParams } from "../../../shared/appConstants";
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});
const createAuthor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAuthor(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Author created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user=req.user
    const validQueryParams = filterValidQueryParams(req.query, userValidParams);
    const paginationAndSortingQueryParams = filterValidQueryParams(
      req.query,
      paginationAndSortingParams
    );

    const result = await userServices.getAllUsersFromDb(
      validQueryParams,
      paginationAndSortingQueryParams,
      user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users data fetched!",
      meta: result.meta,
      data: result.result,
    });
  }
);


const getMyProfile = catchAsync(async (req: Request & {user?:any}, res: Response) => {
  const user = req.user;

  const result = await userServices.getMyProfile(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile data fetched!',
    data: result
  });
});

const updateMyProfile = catchAsync(async (req: Request &{user?:any}, res: Response) => {
  const user = req.user;
  
  console.log()

  const result = await userServices.updateMyProfile(user,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully!!',
    data: result
  });
});

export const userController = {
  createAdmin,
  createAuthor,
  getAllUsers,
  getMyProfile,
  updateMyProfile
};

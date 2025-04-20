import { AuthResponse } from "../../types/authTypes";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";

export const userLogoutControler = asyncHandler(
  async (req: Request, res: Response<AuthResponse>, next: NextFunction) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User Logout Sucessfully",
    });
  }
);

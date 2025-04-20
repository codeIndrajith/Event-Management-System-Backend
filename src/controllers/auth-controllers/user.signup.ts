import asyncHandler from "../../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { AuthResponse, SignUpRequestBody } from "../../types/authTypes";
import {
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
import { signupUser } from "../../services/authService";
import { sendTokenResponse } from "../../services/sendTokenResponse";
import { ErrorResponse } from "../../utils/errorResponse";

export const userSignupController = asyncHandler(
  async (
    req: Request<{}, {}, SignUpRequestBody>,
    res: Response<AuthResponse>,
    next: NextFunction
  ) => {
    const validEmail = emailValidation(req.body.email);
    const validPassword = passwordValidation(req.body.password);

    if (validEmail && validPassword === "") {
      const user = await signupUser(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          profileImage: req.body.profileImage,
        },
        next
      );

      sendTokenResponse(user, 201, res);
    } else if (!validEmail) {
      next(new ErrorResponse("Email is not valid", 400));
    } else if (validPassword !== "") {
      next(new ErrorResponse(`${validPassword}`, 400));
    }
  }
);

import { AuthResponse, SignInRequestBody } from "../../types/authTypes";
import asyncHandler from "../../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import {
  emailValidation,
  passwordValidation,
} from "../../validations/authValidation";
import { signinUser } from "../../services/authService";
import { sendTokenResponse } from "../../services/sendTokenResponse";
import { ErrorResponse } from "../../utils/errorResponse";

export const userSigninController = asyncHandler(
  async (
    req: Request<{}, {}, SignInRequestBody>,
    res: Response<AuthResponse>,
    next: NextFunction
  ) => {
    const validEmail = emailValidation(req.body.email);
    const validPassword = passwordValidation(req.body.password);

    if (validEmail && validPassword === "") {
      const user = await signinUser(
        {
          email: req.body.email,
          password: req.body.password,
        },
        next
      );

      sendTokenResponse(user, 200, res);
    } else if (!validEmail) {
      next(new ErrorResponse("Email is not valid", 400));
    } else if (validPassword !== "") {
      next(new ErrorResponse(`${validPassword}`, 400));
    }
  }
);

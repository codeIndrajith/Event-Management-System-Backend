import { UserPublicData } from "../types/public-types/user.types";
import { Response } from "express";
import { generateToken } from "../utils/generateToken";
import { AuthResponse, CookieOptions } from "../types/authTypes";

export const sendTokenResponse = (
  user: UserPublicData,
  statusCode: number,
  res: Response<AuthResponse>
): void => {
  // create token
  const token = generateToken({
    id: `${user.id}`,
    email: user.email,
  });

  const expiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRE!);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  }

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    statusCode,
    token,
  });
};

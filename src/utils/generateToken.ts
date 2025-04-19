import jwt from "jsonwebtoken";
import { ErrorResponse } from "./errorResponse";

interface TokenPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error: any) {
    throw new ErrorResponse("Not authorized to access this routes", 401);
  }
};

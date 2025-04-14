import { PrismaClient } from "@prisma/client";
import { SignupInput } from "../types/authTypes";
import bcrypt from "bcryptjs";
import { UserPublicData } from "../types/public-types/user.types";
import { NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const signupUser = async (
  input: SignupInput,
  next: NextFunction
): Promise<UserPublicData> => {
  const { name, email, password, roleName } = input;

  // check if the user already exist
  const existUser = await prisma.user.findUnique({ where: { email } });
  if (existUser) {
    next(new ErrorResponse("User already exist", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userId: any = uuidv4();

  // create new user
  const newUser = await prisma.user.create({
    data: { id: userId, name, email, password: hashedPassword, roleName },
  });

  const { password: _, ...publicData } = newUser;
  return { ...publicData, id: String(publicData.id) };
};

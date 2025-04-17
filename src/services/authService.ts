import { PrismaClient } from "@prisma/client";
import { SignInRequestBody, SignupInput } from "../types/authTypes";
import bcrypt from "bcryptjs";
import { UserPublicData } from "../types/public-types/user.types";
import { NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { v4 as uuidv4 } from "uuid";
import { toRole } from "../utils/role-converter";

const prisma = new PrismaClient();

export const signupUser = async (
  input: SignupInput,
  next: NextFunction
): Promise<UserPublicData> => {
  const { name, email, password, role } = input;

  try {
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      throw new ErrorResponse("User already exist", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId: any = uuidv4();

    const roleName = toRole(role);

    // create new user
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: roleName,
      },
    });

    const { password: _, ...publicData } = newUser;
    return { ...publicData, id: String(publicData.id) };
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const signinUser = async (
  input: SignInRequestBody,
  next: NextFunction
): Promise<UserPublicData> => {
  const { email, password } = input;

  try {
    const logUser = await prisma.user.findFirst({ where: { email } });
    if (!logUser) {
      throw new ErrorResponse("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, logUser.password);
    if (!isPasswordValid) {
      throw new ErrorResponse("Invalid email or password", 401);
    }
    const { password: _, ...publicData } = logUser;
    return {
      ...publicData,
      id: String(publicData.id),
    };
  } catch (error: any) {
    next(error);
    throw error;
  }
};

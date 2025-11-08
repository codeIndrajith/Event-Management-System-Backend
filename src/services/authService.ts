import { PrismaClient } from "@prisma/client";
import {
  IRequest,
  SignInRequestBody,
  SignUpRequestBody,
  UserProfileUpdateRequestBody,
} from "../types/authTypes";
import bcrypt from "bcryptjs";
import { UserPublicData } from "../types/public-types/user.types";
import { NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { v4 as uuidv4 } from "uuid";
import { toRole } from "../utils/role-converter";

const prisma: any = new PrismaClient();

export const signupUser = async (
  input: SignUpRequestBody,
  next: NextFunction
): Promise<UserPublicData> => {
  const { name, email, password, role, profileImage } = input;

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
        profileImage,
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
  const { email, password, role, notificationToken } = input;

  try {
    if (!role) {
      throw new ErrorResponse("Role is required", 400);
    }
    const logUser = await prisma.user.findFirst({
      where: { email, role },
    });
    if (!logUser) {
      throw new ErrorResponse("Invalid credentials", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, logUser.password);
    if (!isPasswordValid) {
      throw new ErrorResponse("Invalid email or password", 401);
    }
    // update notification token if provided
    if (notificationToken) {
      await prisma.user.update({
        where: { id: logUser.id },
        data: { notificationToken },
      });
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

export const getUsersService = async (
  req: IRequest,
  next: NextFunction
): Promise<UserPublicData> => {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.user?.id } });
    if (!user) {
      throw new ErrorResponse("User not found", 400);
    }
    const { password: _, ...publicData } = user;
    return {
      ...publicData,
    };
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const userProfileUpdateService = async (
  data: UserProfileUpdateRequestBody,
  userId: string,
  next: NextFunction
): Promise<string> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
      },
    });

    if (!updatedUser) {
      throw new ErrorResponse("Profile update failed", 400);
    }

    return "Profile update successful";
  } catch (error: any) {
    next(error);
    throw error;
  }
};

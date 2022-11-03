import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            AND: [{ username: username }, { email: email }],
          },
          { email: email },
        ],
      },
    });
    if (findUser)
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "created user successfully", user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, message: "Password not match" });
    return res
      .status(200)
      .json({ success: true, message: "Login successfully", user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const findUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    !user
      ? res.status(400).json({ success: false, message: "User not found" })
      : res.status(200).json({ success: false, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        username: username,
        password: hash,
      },
    });
    res
      .status(200)
      .json({ success: false, message: "Updated SuccessFully", user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, message: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.deleteMany({});
    res.status(200).json({ success: true, message: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

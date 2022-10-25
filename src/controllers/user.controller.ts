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

export const deleteUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.deleteMany({});
    res.status(200).json({ success: true, message: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

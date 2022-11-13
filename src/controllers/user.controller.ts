import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail";
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

export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const msg = await sendEmail(otp, user);
    const hashOtp = await bcrypt.hash(otp, 10);
    const cekOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!cekOtp) {
      await prisma.otp.create({
        data: {
          userId: user.id,
          otp: hashOtp,
          expiredAt: new Date(new Date().getTime() + 300000),
        },
      });
    }
    if (cekOtp && cekOtp.expiredAt > new Date(Date.now())) {
      return res.status(400).json({ success: false, message: "Bad request" });
    }
    if (cekOtp) {
      await prisma.otp.update({
        where: {
          id: cekOtp.id,
        },
        data: {
          otp: hashOtp,
        },
      });
    }
    res.status(200).json({ success: true, message: msg });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.otp.findFirst({
      where: {
        userId: req.params.id,
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const valid = await bcrypt.compare(req.body.otp, user?.otp);
    if (!valid)
      return res.status(400).json({ success: false, message: "Otp invalid" });
    if (user.expiredAt < new Date(Date.now())) {
      await prisma.otp.delete({
        where: {
          id: user.id,
        },
      });
      return res.status(403).json({ success: false, message: "Otp expired" });
    }
    await prisma.otp.delete({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ success: true, message: "Successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePasswordNew = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { password, confirmPassword } = req.body;
    if (
      password !== confirmPassword ||
      (password == undefined && confirmPassword == undefined) ||
      (password == undefined && confirmPassword !== undefined) ||
      (password !== undefined && confirmPassword === undefined)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your password don't match or password and confirm password is undefined",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        password: hash,
      },
    });
    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cekOtp = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.otp.findMany({
      include: {
        user: true,
      },
    });
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

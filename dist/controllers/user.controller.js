"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.deleteUser = exports.updateUser = exports.findUsers = exports.findUser = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const findUser = yield prisma.user.findFirst({
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
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
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
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid)
            return res
                .status(400)
                .json({ success: false, message: "Password not match" });
        return res
            .status(200)
            .json({ success: true, message: "Login successfully", user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.login = login;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.findUser = findUser;
const findUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
            },
        });
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.findUsers = findUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const hash = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.update({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, message: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteUser = deleteUser;
const deleteUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.deleteMany({});
        res.status(200).json({ success: true, message: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteUsers = deleteUsers;

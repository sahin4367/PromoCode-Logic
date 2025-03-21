import { Response, NextFunction } from "express";
import { RegisterDTO } from "./user.dto";
import { EUserRole, User } from "../../../DAL/models/user.model";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { CustomRequest } from "../../../type/custome-request";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { appConfig } from "../../../consts";
import moment from "moment";

const userRegister = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ message: "All fields are required!" });
            return;
        }

        const dto = new RegisterDTO();
        dto.name = name;
        dto.email = email;
        dto.password = password;
        dto.role = role;

        const errors = await validate(dto);
        if (errors.length > 0) {
            const formattedErrors = errors.reduce((acc, error) => {
                acc[error.property] = Object.values(error.constraints || {});
                return acc;
            }, {} as { [key: string]: string[] });
            res.status(400).json({
                message: "Validation failed",
                errors: formattedErrors,
            });
            return;
        }

        if (dto.role === EUserRole.USER) {
            res.status(400).json({ message: "You can't register as an admin!" });
            return;
        }

        const existingUser = await User.findOne({ where: { email: dto.email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists!" });
            return;
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);

        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.password = hashPassword;
        newUser.role = role;

        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred!",
            error: error.message,
        });
    }
};

const userLogin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required!" });
            return;
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            res.status(401).json({ message: "Invalid password!" });
            return;
        }

        // Token yaradılışı
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: `User login successfully!`,
            token,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred!",
            error: error.message,
        });
    }}

const verifyEmail = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required~!" });
            return;
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(404).json({ message: "User not found~!" });
            return;
        }

        if (user.isVerifiedEmail) {
            res.status(400).json({ message: "Email already verified~!" });
            return;
        }

        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpireAt = moment().add(appConfig.verifyCodeExpiteMinute, "minutes").toDate();

        user.codeExpireAt = codeExpireAt;
        user.verifyCode = randomCode;

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: appConfig.USER_EMAIL,
                pass: appConfig.PASSWORD,
            },
        });

        const mailOptions = {
            from: appConfig.USER_EMAIL,
            to: user.email,
            subject: "Verify Email",
            text: `Your verification code is: ${randomCode}`,
        };

        await transporter.sendMail(mailOptions); 

        res.status(200).json({ message: "Verification email sent successfully~!" });

    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred~!",
            error: error.message,
        });
    }
};

const checkVerifyCode = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized~!" });
            return;
        }

        const user = req.user;
        const { code } = req.body;

        if (!code) {
            res.status(400).json({ message: "Code is required~!" });
            return;
        }

        if (user.isVerifiedEmail) {
            res.status(400).json({ message: "Email already verified~!" });
            return;
        }

        if (!user.verifyCode || !user.codeExpireAt || moment(user.codeExpireAt).isBefore(moment())) {
            res.status(400).json({ message: "The verification code has expired or is invalid." });
            return;
        }

        if (user.verifyCode === code) {
            user.isVerifiedEmail = true;
            user.verifyCode = null;
            user.codeExpireAt = new Date();

            await user.save();
            res.json({ message: "Email verification successful~!" });
        } else {
            res.status(400).json({ message: "Invalid verification code~!" });
        }

    } catch (error: any) {
        res.status(500).json({
            message: "An error occurred!",
            error: error.message,
        });
    }
};

export const UserController = {
    userRegister,
    userLogin,
    verifyEmail,
    checkVerifyCode,
};

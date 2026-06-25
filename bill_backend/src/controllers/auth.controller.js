import bcrypt from "bcrypt";
import config from "../config/app.config.js";
import prisma from "../config/prisma.config.js";
import { generateToken, setTokenCookie, clearTokenCookie } from "../utils/token.util.js";

// User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, number, userType } = req.body;

        if (!name || !email || !password || !number) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.userAuth.create({
            data: {
                name,
                email,
                password: hashedPassword,
                number,
                userType: userType || 'citizen',
            },
        });

        const token = generateToken({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            number: newUser.number,
            user_type: newUser.userType,
        });

        setTokenCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: newUser.id,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                user_type: newUser.userType,
            },
        });
    } catch (err) {
        console.error("Registration error:", err.message);
        if (err.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email or phone number already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await prisma.userAuth.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            user_type: user.userType,
        });

        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                user_type: user.userType,
            },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Authority Registration
export const registerAuthority = async (req, res) => {
    try {
        const { name, email, password, number } = req.body;

        if (!name || !email || !password || !number) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAuthority = await prisma.authorityAuth.create({
            data: {
                name,
                email,
                password: hashedPassword,
                number,
            },
        });

        const token = generateToken({
            id: newAuthority.id,
            name: newAuthority.name,
            email: newAuthority.email,
            number: newAuthority.number,
            role: "authority",
        }, true);

        setTokenCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "Authority registered successfully",
            authorityId: newAuthority.id,
            token,
            authority: {
                id: newAuthority.id,
                name: newAuthority.name,
                email: newAuthority.email,
            },
        });
    } catch (err) {
        console.error("Authority registration error:", err.message);
        if (err.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email or phone number already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Authority Login
export const loginAuthority = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const authority = await prisma.authorityAuth.findUnique({
            where: { email },
        });

        if (!authority) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, authority.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken({
            id: authority.id,
            name: authority.name,
            email: authority.email,
            number: authority.number,
            role: "authority",
        }, true);

        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            authority: {
                id: authority.id,
                name: authority.name,
                email: authority.email,
            },
        });
    } catch (err) {
        console.error("Authority login error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Logout
export const logout = async (req, res) => {
    clearTokenCookie(res);
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// Get User Info from Token
export const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.userAuth.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                number: true,
                userType: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.error("Error fetching user info:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get Authority Info from Token
export const getAuthorityInfo = async (req, res) => {
    try {
        const authorityId = req.user.id;

        const authority = await prisma.authorityAuth.findUnique({
            where: { id: authorityId },
            select: {
                id: true,
                name: true,
                email: true,
                number: true,
                createdAt: true,
            },
        });

        if (!authority) {
            return res.status(404).json({
                success: false,
                message: "Authority not found",
            });
        }

        return res.status(200).json({
            success: true,
            authority,
        });
    } catch (err) {
        console.error("Error fetching authority info:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default {
    registerUser,
    loginUser,
    registerAuthority,
    loginAuthority,
    logout,
    getUserInfo,
    getAuthorityInfo,
};

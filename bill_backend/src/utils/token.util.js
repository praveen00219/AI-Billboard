import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

export const generateToken = (payload, isAuthority = false) => {
    const secret = isAuthority ? config.jwt.authoritySecret : config.jwt.citizenSecret;
    return jwt.sign(payload, secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // or 'none' if across domains, but usually 'lax' is safer
        maxAge: null, // null for session cookie (destroyed when browser/tab closes)
    });
};

export const clearTokenCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
};

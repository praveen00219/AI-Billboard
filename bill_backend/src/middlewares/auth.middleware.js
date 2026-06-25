import jwt from "jsonwebtoken";
import config from "../config/app.config.js";

// Verify JWT Token Middleware
export const verifyToken = (secretKey) => {
    return (req, res, next) => {
        // Find token in Header or Cookie
        let token = null;
        const authHeader = req.headers["authorization"];
        
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No token provided. Authorization required." 
            });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return res.status(403).json({ success: false, message: "Invalid or expired token" });
            req.user = decoded;
            next();
        });
    };
};

// Citizen Token Verifier
export const verifyCitizenToken = verifyToken(config.jwt.citizenSecret);

// Authority Token Verifier
export const verifyAuthorityToken = verifyToken(config.jwt.authoritySecret);

// Role-based Access Control Middleware
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ success: false, message: "Authentication required" });
        const userRole = req.user.user_type || req.user.role;
        if (!allowedRoles.includes(userRole)) return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
        next();
    };
};

export default { verifyToken, verifyCitizenToken, verifyAuthorityToken, checkRole };

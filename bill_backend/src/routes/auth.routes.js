import express from "express";
import { registerUser, loginUser, logout, getUserInfo } from "../controllers/auth.controller.js";
import { verifyCitizenToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register a new user
router.post("/userAuth-register", registerUser);

// Login user
router.post("/userAuth-login", loginUser);

// Logout user
router.post("/logout", logout);

// Get current user info
router.get("/me", verifyCitizenToken, getUserInfo);

export default router;

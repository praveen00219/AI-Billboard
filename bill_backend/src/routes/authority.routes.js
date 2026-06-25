import express from "express";
import { registerAuthority, loginAuthority, getAuthorityInfo } from "../controllers/auth.controller.js";
import { verifyAuthorityToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register a new authority
router.post("/authorityAuth-register", registerAuthority);

// Login authority
router.post("/authorityAuth-login", loginAuthority);

// Get current authority info
router.get("/authorityAuth-info", verifyAuthorityToken, getAuthorityInfo);

export default router;

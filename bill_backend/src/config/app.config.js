import dotenv from "dotenv";

dotenv.config();

// Application Configuration Constants
export const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 5173,
        env: process.env.NODE_ENV || "development",
    },

    // Database Configuration
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },

    // JWT Configuration
    jwt: {
        citizenSecret: process.env.SEC_KEY || "billboard@2025",
        authoritySecret: process.env.AUTH_KEY || "authorityBillboard@2025",
        expiresIn: "1d",
    },

    // AI/API Configuration
    ai: {
        apiKey: process.env.KEY,
        apiUrl: process.env.API,
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    },

    // File Upload Configuration
    upload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif", "video/mp4"],
        uploadDir: "uploads",
    },
};

export default config;

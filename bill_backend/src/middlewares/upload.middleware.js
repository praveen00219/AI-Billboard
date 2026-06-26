import fs from "fs";
import multer from "multer";
import path from "path";
import config from "../config/app.config.js";

// Ensure uploads folder exists
const UPLOADS_FOLDER = path.join(process.cwd(), config.upload.uploadDir);
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// Disk Storage Configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_FOLDER),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});

// File Type Validator
const fileFilter = (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${config.upload.allowedTypes.join(", ")} allowed.`), false);
    }
};

// Multer Instance (disk storage — persisted uploads)
export const upload = multer({
    storage: storage,
    limits: { fileSize: config.upload.maxSize },
    fileFilter: fileFilter,
});

// In-memory instance — for transient AI analysis where we don't want to
// persist files to disk (e.g. "Generate with AI" before the report is saved).
export const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.upload.maxSize },
    fileFilter: fileFilter,
});

// Upload Error Handler
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ success: false, message: `File too large. Max: ${config.upload.maxSize / (1024 * 1024)}MB` });
        }
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
};

export default { upload, uploadMemory, handleUploadError };

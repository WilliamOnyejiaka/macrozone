import multer, { FileFilterCallback } from "multer";
import { Request, Express } from "express";
import fs from 'fs';
import path from 'path';
import { MAX_FILE_SIZE } from "../../config/env";

const allowedMimeTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
const fileSize: number = parseFloat(MAX_FILE_SIZE);

const typeError = "LIMIT_INVALID_FILE_TYPE";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});

export const uploads = (maxFiles: number = 6) => {

    return multer({
        storage: storage,
        limits: { fileSize: fileSize, files: maxFiles },
        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error(typeError));
            }
            return cb(null, true);
        }
    });
}

// General media upload function
export const mediaUpload = (maxFiles: number = 3) => {
    return multer({
        storage,
        limits: { fileSize: fileSize, files: maxFiles },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                // "video/mp4",
                // "video/webm",
                // "video/mpeg",
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!allowedTypes.includes(file.mimetype)) return cb(new Error(typeError));
            cb(null, true);
        },
    });
};

export default uploads;

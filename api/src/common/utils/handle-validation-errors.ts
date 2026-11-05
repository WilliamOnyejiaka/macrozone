import "multer";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import deleteFiles from "./deleteFiles";

export default async function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const msg = validationErrors.array()[0]?.msg;
        try {
            const error = JSON.parse(msg);
            res.status(error.statusCode).json({ error: true, message: error.message });
            return;
        } catch (error) {
            res.status(400).json({ error: true, message: msg });
            return;
        } finally {
            const file = (req as any).file;
            const files = (req as any).files;
            if (file) {
                await deleteFiles(file);
            }
            if (files) {
                await deleteFiles(files);
            }
        }
    }
    next();
}
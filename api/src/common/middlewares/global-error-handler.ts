
import { Response, Request, NextFunction } from "express";
import multer from "multer";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                error: true,
                message: 'File exceeds the allowed size limit'
            });
            return;
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({
                error: true,
                message: "Required field not found in request"
            });
            return;
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
            res.status(400).json({
                error: true,
                message: `Too many files: Max ${err.field || 'allowed'}`
            });
            return;
        }
    }
    if (err.message === 'LIMIT_INVALID_FILE_TYPE') {
        res.status(400).json({
            error: true,
            message: 'Invalid file type'
        });
        return;
    }

    if (err.message === 'INVALID_FIELD_NAME') {
        res.status(400).json({
            error: true,
            message: 'Invalid field name'
        });
        return;
    }

    if (err.type === 'entity.parse.failed') {
        res.status(400).json({
            error: true,
            message: 'Invalid JSON body. Send a JSON object, not a stringified string.',
        });
        return;
    }

    if (err) {
        console.log(err);
        const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
        res.status(statusCode).json({
            error: true,
            message: err.message ?? "Something went wrong"
        });
        return;
    }

    next();
}

export default globalErrorHandler;
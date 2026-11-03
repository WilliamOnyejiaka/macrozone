import { Request, Response } from "express";

// Patch BigInt serialization for JSON.stringify / Express res.json
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default function controllerResponse(res: Response, responseData: {
    statusCode: number, json: {
        error: boolean;
        message: string | null;
        data: any;
    }
}) {
    res.status(responseData.statusCode).json(responseData.json);
}
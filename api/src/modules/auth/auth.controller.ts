import { Request, Response } from "express";
import Service from "./auth.service";
import response from "../../common/utils/controller-response";

const service = new Service();

export async function signUp(req: Request, res: Response) {
    const payload = {
        ...req.body,
        ipAddress: (req.ip as string) || (req.socket.remoteAddress as string),
        userAgent: req.headers["user-agent"] || "unknown",
    };

    const result = await service.signUp(payload);
    response(res, result);
}

export async function login(req: Request, res: Response) {
    const payload = {
        ...req.body,
        ipAddress: (req.ip as string) || (req.socket.remoteAddress as string),
        userAgent: req.headers["user-agent"] || "unknown",
    };

    const result = await service.login(payload);
    response(res, result);
}
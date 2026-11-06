import { Request, Response } from "express";
import Service from "./auth.service";
import response from "../../common/utils/controller-response";
import { HttpStatus } from "../../common/types/constants";

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

export async function refreshToken(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || "unknown";
    const refreshToken = req.headers.authorization?.split(' ')[1] || req.body?.refreshToken;

    if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: true, message: "Refresh token is required" });
        return;
    }

  const result = await service.refreshToken({
        userId,
        refreshToken,
        ipAddress,
        userAgent
    });
    response(res, result);
}


export async function logout(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const { refreshToken } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const ipAddress = (req.ip as string) || (req.socket.remoteAddress as string);
    const userAgent = req.headers["user-agent"] as string;

    const result = await service.logout({
        userId,
        refreshToken,
        accessToken,
        ipAddress,
        userAgent,
    });

    response(res, result);
}
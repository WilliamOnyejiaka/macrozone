import { Request, Response } from 'express';
import UserService from './users.service';
import response from '../../common/utils/controller-response';

const userService = new UserService();

export async function getProfile(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const result = await userService.getProfile(userId);
    response(res, result);
}

export async function updateProfile(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const result = await userService.updateProfile(userId, req.body);
    response(res, result);
}

export async function changePassword(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(userId, { currentPassword, newPassword });
    response(res, result);
}

export async function updateProfilePicture(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const file = req.file || files?.avatar?.[0] || files?.profilePicture?.[0];

    const result = await userService.updateProfilePicture(userId, file as Express.Multer.File);
    response(res, result);
}

export async function deleteProfile(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const result = await userService.deleteProfile(userId);
    response(res, result);
}
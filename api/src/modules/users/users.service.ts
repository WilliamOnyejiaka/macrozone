import BaseService from "../../common/services";

export default class UsersService extends BaseService {

    public constructor() {
        super();
    }

    public async getProfile(userId: string) {}
    public async updateProfile(userId: string, data: any) {}
    public async changePassword(userId: string, data: any) {}
    public async updateProfilePicture(userId: string, data: any) {}
    public async deleteProfile(userId: string) {}
}
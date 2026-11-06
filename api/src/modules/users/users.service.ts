import "multer";
import BaseService from "../../common/services";
import { db } from "../../db";
import { users, userSessions } from "../../db/schema";
import { eq } from "drizzle-orm";
import { CdnFolders, HttpStatus } from "../../common/types";
import Password from "../../common/utils/password";
import TransactionException from "../../common/errors/transaction-exception";
import { ChangePasswordDto, UpdateProfileDto } from "./users.dto";
import cloudinary from "../../config/cloudinary";
import deleteFiles from "../../common/utils/deleteFiles";

export default class UserService extends BaseService {
    public constructor() {
        super();
    }

    public async getProfile(userId: string) {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "User not found");
            }

            const { passwordHash, ...safeUser } = user;
            return super.successResponse(HttpStatus.OK, "Profile retrieved successfully", safeUser);
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async updateProfile(userId: string, data: UpdateProfileDto) {
        try {
            const [updatedUser] = await db
                .update(users)
                .set({
                    ...data,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning();

            if (!updatedUser) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "User not found");
            }

            const { passwordHash, ...safeUser } = updatedUser;
            return super.successResponse(HttpStatus.OK, "Profile updated successfully", safeUser);
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async changePassword(userId: string, data: ChangePasswordDto) {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "User not found");
            }

            const isPasswordValid = await Password.compare(data.currentPassword, user.passwordHash);
            if (!isPasswordValid) {
                return super.errorResponse(HttpStatus.BAD_REQUEST, "Current password is incorrect");
            }

            const newPasswordHash = await Password.hash(data.newPassword);
            if (!newPasswordHash) {
                throw new TransactionException("Failed to hash password", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            await db.transaction(async (tx) => {
                await tx
                    .update(users)
                    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
                    .where(eq(users.id, userId));

                // Invalidate all active sessions for security on password change
                await tx.delete(userSessions).where(eq(userSessions.userId, userId));
            });

            return super.successResponse(HttpStatus.OK, "Password changed successfully");
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async updateProfilePicture(userId: string, file: Express.Multer.File) {
        try {
            if (!file) {
                return super.errorResponse(HttpStatus.BAD_REQUEST, "Profile picture file is required");
            }

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user) {
                await deleteFiles(file);
                return super.errorResponse(HttpStatus.NOT_FOUND, "User not found");
            }

            let newAvatarUrl: string;
            let newPublicId: string;

            try {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: CdnFolders.USER_PICTURES,
                    resource_type: "image",
                });

                newAvatarUrl = uploadResult.secure_url;
                newPublicId = uploadResult.public_id;
            } finally {
                await deleteFiles(file);
            }

            // Delete previous avatar from Cloudinary if it exists
            if (user.avatarPublicId) {
                try {
                    await cloudinary.uploader.destroy(user.avatarPublicId);
                } catch (err) {
                    console.error("Failed to delete previous avatar from Cloudinary:", err);
                }
            }

            const [updatedUser] = await db
                .update(users)
                .set({
                    avatarUrl: newAvatarUrl,
                    avatarPublicId: newPublicId,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning();

            const { passwordHash, ...safeUser } = updatedUser;
            return super.successResponse(HttpStatus.OK, "Profile picture updated successfully", safeUser);
        } catch (error) {
            if (file) {
                await deleteFiles(file).catch(() => {});
            }
            return super.handleError(error);
        }
    }

    public async deleteProfile(userId: string) {
        try {
            let avatarPublicId: string | null = null;

            await db.transaction(async (tx) => {
                // Delete user sessions first due to foreign keys, then delete/deactivate user
                await tx.delete(userSessions).where(eq(userSessions.userId, userId));

                const [deletedUser] = await tx
                    .delete(users)
                    .where(eq(users.id, userId))
                    .returning();

                if (!deletedUser) {
                    throw new TransactionException("User not found", HttpStatus.NOT_FOUND);
                }

                avatarPublicId = deletedUser.avatarPublicId;
            });

            if (avatarPublicId) {
                try {
                    await cloudinary.uploader.destroy(avatarPublicId);
                } catch (err) {
                    console.error("Failed to delete avatar from Cloudinary on user deletion:", err);
                }
            }

            return super.successResponse(HttpStatus.OK, "Profile deleted successfully");
        } catch (error) {
            return super.handleError(error);
        }
    }
}
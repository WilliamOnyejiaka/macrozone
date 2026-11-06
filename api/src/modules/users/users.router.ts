import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
    getProfile,
    updateProfile,
    changePassword,
    updateProfilePicture,
    deleteProfile
} from "./users.controller";
import {
    updateProfileValidator,
    changePasswordValidator,
    updateProfilePictureValidator
} from "./users.validator";
const router = Router();

router.get("/profile", asyncHandler(getProfile));
router.patch("/profile", updateProfileValidator, asyncHandler(updateProfile));
router.patch("/change-password", changePasswordValidator, asyncHandler(changePassword));
router.patch("/profile-picture", updateProfilePictureValidator, asyncHandler(updateProfilePicture));
router.put("/profile-picture", updateProfilePictureValidator, asyncHandler(updateProfilePicture));
router.patch("/avatar", updateProfilePictureValidator, asyncHandler(updateProfilePicture));
router.put("/avatar", updateProfilePictureValidator, asyncHandler(updateProfilePicture));
router.delete("/profile", asyncHandler(deleteProfile));

export default router;
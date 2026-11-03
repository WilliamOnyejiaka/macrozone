import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const TOKEN_SECRET = process.env.TOKEN_SECRET!;
export const STORED_SALT = process.env.STORED_SALT!;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
export const SECRET_KEY = process.env.SECRET_KEY!;
export const ACCESS_TOKEN_EXPIRES: string = process.env.ACCESS_TOKEN_EXPIRES || "15m";
export const REFRESH_TOKEN_EXPIRES: string = process.env.REFRESH_TOKEN_EXPIRES || "30d";
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET!;
export const ENV_TYPE: string = process.env.ENV_TYPE || "development";
export const GOOGLE_AUTH_CALLBACK_URL: string = process.env.GOOGLE_AUTH_CALLBACK_URL!;
export const REDIS_URL: string = process.env.REDIS_URL || 'redis://localhost:6379/12';
export const MAX_FILE_SIZE: string = process.env.MAX_FILE_SIZE! || `${10.0 * 1024 * 1024}`;
export const ALLOWED_FILE_TYPES: string = process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif";
export const SESSION_SECRET: string = process.env.SESSION_SECRET || 'your-secret-key-here';
export const SESSION_NAME: string = process.env.SESSION_NAME || 'findme_session';
export const SESSION_LIFETIME: number = parseInt(process.env.SESSION_LIFETIME || '86400000'); // Default to 1 day in milliseconds
export const RESEND_API_KEY: string = process.env.RESEND_API_KEY!;
export const EMAIL_FROM: string = process.env.EMAIL_FROM!;
export const OTP_EXPIRE_SECONDS: string = process.env.OTP_EXPIRE_SECONDS!;
export const DEFAULT_ADMIN_EMAIL: string = process.env.DEFAULT_ADMIN_EMAIL!;
export const DEFAULT_ADMIN_PASSWORD: string = process.env.DEFAULT_ADMIN_PASSWORD!;
export const DEFAULT_ADMIN_PHONE: string = process.env.DEFAULT_ADMIN_PHONE!;
export const QUEUE_URL: string = process.env.QUEUE_URL!;
export const FRONTEND_URL: string = process.env.FRONTEND_URL || "http://localhost:3000";
export const BASE_URL: string = process.env.BASE_URL || "http://localhost:3000";
export const MAX_MATERIAL_FILE_SIZE: string = process.env.MAX_MATERIAL_FILE_SIZE || "104857600";






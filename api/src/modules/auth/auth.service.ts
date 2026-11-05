import BaseService from "../../common/services";
import { LoginDto, SignUpDto } from "./auth.dto";
import { db } from "./../../db";
import { userSessions, users } from "../../db/schema";
import { and, eq, gt, lt, or } from "drizzle-orm";
import { HttpStatus, TokenType } from "../../common/types";
import Password from "../../common/utils/password";
import TransactionException from "../../common/errors/transaction-exception";
import { STORED_SALT, TOKEN_SECRET, SECRET_KEY, REFRESH_TOKEN_EXPIRES, ACCESS_TOKEN_EXPIRES } from "../../config/env";
import ms, { StringValue } from "ms";
import Token from "../../common/services/token.service";


export default class Authentication extends BaseService {

    protected readonly storedSalt: string = STORED_SALT;
    protected readonly tokenSecret: string = TOKEN_SECRET;
    protected readonly secretKey: string = SECRET_KEY;

    public constructor() {
        super();
    }

    private generateToken(data: any, type: string, expiresIn: string = ACCESS_TOKEN_EXPIRES) {
        return Token.createToken(this.tokenSecret, data, [type], expiresIn);
    }

    protected generateUserToken(data: any, tokenType: TokenType) {
        return this.generateToken(data, tokenType);
    }

    public async signUp(payload: SignUpDto) {
        try {
            const [userExists] = await db
                .select()
                .from(users)
                .where(eq(users.email, payload.email))
                .limit(1);

            if (userExists) return super.errorResponse(HttpStatus.BAD_REQUEST, "Email is already in use.");

            const result = await db.transaction(async (tx) => {

                const passwordHash = await Password.hash(payload.password);

                if (!passwordHash) throw new TransactionException("Failed to hash password", HttpStatus.INTERNAL_SERVER_ERROR);

                const [newUser] = await tx.insert(users).values({
                    name: payload.name,
                    passwordHash,
                    email: payload.email,
                    dailyCalorieGoal: payload.dailyCalorieGoal ?? 2000,
                    dailyFatGoal: payload.dailyFatGoal ?? 65,
                    dailyCarbsGoal: payload.dailyCarbsGoal ?? 250,
                    dailyProteinGoal: payload.dailyProteinGoal ?? 150,
                }).returning();

                const accessToken = this.generateUserToken({ id: newUser.id }, TokenType.ACCESS);
                const refreshToken = this.generateToken({
                    id: newUser.id,
                }, TokenType.REFRESH, REFRESH_TOKEN_EXPIRES);

                const REFRESH_TOKEN_TTL = ms(REFRESH_TOKEN_EXPIRES as StringValue);
                const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_TTL);

                const refreshTokenHash = await Password.hash(refreshToken);

                const [newUserSession] = await tx.insert(userSessions).values({
                    refreshTokenHash,
                    userId: newUser.id,
                    expiresAt: refreshTokenExpires,
                    ipAddress: payload.ipAddress,
                    userAgent: payload.userAgent
                }).returning();

                if (!newUserSession) {
                    throw new TransactionException("Failed to create user session", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                const user = { ...newUser, passwordHash: undefined };

                return { user, tokens: { accessToken, refreshToken } };
            });

            return super.successResponse(
                HttpStatus.CREATED,
                "User has been created successfully",
                result
            );
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async login(payload: LoginDto) {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, payload.email))
                .limit(1);

            if (!user) {
                return super.errorResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
            }

            const isPasswordValid = await Password.compare(payload.password, user.passwordHash);

            if (!isPasswordValid) {
                return super.errorResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
            }

            const result = await db.transaction(async (tx) => {
                const accessToken = this.generateUserToken({ id: user.id }, TokenType.ACCESS);
                const refreshToken = this.generateToken(
                    { id: user.id },
                    TokenType.REFRESH,
                    REFRESH_TOKEN_EXPIRES
                );

                const REFRESH_TOKEN_TTL = ms(REFRESH_TOKEN_EXPIRES as StringValue);
                const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_TTL);

                const refreshTokenHash = await Password.hash(refreshToken);

                // 4. Record the user session (capturing IP and User-Agent)
                const [newUserSession] = await tx.insert(userSessions).values({
                    refreshTokenHash,
                    userId: user.id,
                    expiresAt: refreshTokenExpires,
                    ipAddress: payload.ipAddress,
                    userAgent: payload.userAgent
                }).returning();

                if (!newUserSession) {
                    throw new TransactionException("Failed to create user session", HttpStatus.INTERNAL_SERVER_ERROR);
                }

                // Exclude password hash before returning user info
                const sanitizedUser = { ...user, passwordHash: undefined };

                return { user: sanitizedUser, tokens: { accessToken, refreshToken } };
            });

            return super.successResponse(
                HttpStatus.OK,
                "User has been logged in successfully",
                result
            );
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async logout(payload: { userId: string; refreshToken?: string }) {
        try {
            if (payload.refreshToken) {
                // Find and remove the specific session matching the refresh token hash
                const sessions = await db
                    .delete(userSessions)
                    .where(and(
                        eq(userSessions.userId, payload.userId),
                        eq(userSessions.refreshTokenHash, payload.refreshToken)
                    ));
            } else {
                // Fallback: Clear all sessions for the user (global logout)
                await db.delete(userSessions).where(eq(userSessions.userId, payload.userId));
            }

            return super.successResponse(
                HttpStatus.OK,
                "User has been logged out successfully");
        } catch (error) {
            return super.handleError(error);
        }
    }

    // public async refresh(payload: { refreshToken: string; ipAddress?: string; userAgent?: string }) {
    //     try {
    //         // 1. Verify token signature
    //         const decoded = verifyToken(payload.refreshToken, TokenType.REFRESH);
    //         if (!decoded) {
    //             return super.errorResponse(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token.");
    //         }

    //         // 2. Find user sessions and match the stored hash
    //         const sessions = await db
    //             .select()
    //             .from(userSessions)
    //             .where(eq(userSessions.userId, decoded.id));

    //         let validSession = null;
    //         for (const session of sessions) {
    //             const isMatch = await Password.compare(payload.refreshToken, session.refreshTokenHash);
    //             if (isMatch) {
    //                 validSession = session;
    //                 break;
    //             }
    //         }

    //         if (!validSession || new Date() > new Date(validSession.expiresAt)) {
    //             return super.errorResponse(HttpStatus.UNAUTHORIZED, "Session expired or invalid.");
    //         }

    //         // 3. Fetch user
    //         const [user] = await db
    //             .select()
    //             .from(users)
    //             .where(eq(users.id, decoded.id))
    //             .limit(1);

    //         if (!user) {
    //             return super.errorResponse(HttpStatus.UNAUTHORIZED, "User not found.");
    //         }

    //         // 4. Generate new tokens & rotate session
    //         const accessToken = this.generateUserToken({ id: user.id }, TokenType.ACCESS);
    //         const newRefreshToken = this.generateToken({ id: user.id }, TokenType.REFRESH, REFRESH_TOKEN_EXPIRES);

    //         const REFRESH_TOKEN_TTL = ms(REFRESH_TOKEN_EXPIRES as StringValue);
    //         const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_TTL);
    //         const newRefreshTokenHash = await Password.hash(newRefreshToken);

    //         await db.transaction(async (tx) => {
    //             await tx.update(userSessions)
    //                 .set({
    //                     refreshTokenHash: newRefreshTokenHash,
    //                     expiresAt: refreshTokenExpires,
    //                     ipAddress: payload.ipAddress,
    //                     userAgent: payload.userAgent,
    //                 })
    //                 .where(eq(userSessions.id, validSession.id));
    //         });

    //         return super.successResponse(
    //             HttpStatus.OK,
    //             "Token refreshed successfully",
    //             { accessToken, refreshToken: newRefreshToken }
    //         );
    //     } catch (error) {
    //         return super.handleError(error);
    //     }
    // }

}
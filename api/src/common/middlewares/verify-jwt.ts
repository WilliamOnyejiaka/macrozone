import { Request, Response, NextFunction } from "express";
import { HttpStatus, HttpStatusMessage, TokenType } from "../types/constants";
import { TOKEN_SECRET } from "../../config/env";
import Token from "../services/token.service";
import { db } from "../../db";
import { revokedAccessTokens } from "../../db/schema";
import { eq } from "drizzle-orm";

const verifyJWT =
    (types: string[], neededData: string[] = ["data"]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            const tokenSecret: string = TOKEN_SECRET;

            if (
                !req.headers.authorization ||
                req.headers.authorization.indexOf("Bearer ") === -1
            ) {
                res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({ error: true, message: "Missing Bearer Authorization Header" });
                return;
            }

            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    error: true,
                    message: "Token missing",
                });
                return;
            }

            const tokenValidationResult: any = Token.validateToken(
                token,
                types,
                tokenSecret,
            );

            if (tokenValidationResult.error) {
                const statusCode =
                    tokenValidationResult.message ===
                        HttpStatusMessage[HttpStatus.UNAUTHORIZED]
                        ? HttpStatus.UNAUTHORIZED
                        : HttpStatus.BAD_REQUEST;
                res.status(statusCode).json({
                    error: true,
                    message: tokenValidationResult.message,
                });
                return;
            }

            if (types.includes(TokenType.ACCESS)) {
                const [revoked] = await db
                    .select()
                    .from(revokedAccessTokens)
                    .where(eq(revokedAccessTokens.accessToken, token))
                    .limit(1);

                if (revoked) {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        error: true,
                        message: "Token has been revoked",
                    });
                    return;
                }
            }

            for (let item of neededData) {
                res.locals[item] = tokenValidationResult.data[item];
            }



            next();
        };

export default verifyJWT;
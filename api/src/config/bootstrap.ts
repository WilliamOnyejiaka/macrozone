import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import logger from "./logger";
import helmet from "helmet";
import errorHandler from "../common/middlewares/global-error-handler";
import http from 'http';
import path from "path";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { RedisClientType } from "redis";
import { ENV_TYPE, SECRET_KEY, SESSION_LIFETIME, SESSION_SECRET } from "./env";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../db";
import asyncHandler from "express-async-handler";

import v1Routes from "../routes/v1";

export default async function bootstrap() {
    const app = express();
    const stream = { write: (message: string) => logger.http(message.trim()) };
    const server = http.createServer(app);

    server.on("clientError", (err: any, socket) => {
        if (err?.code === "ECONNRESET" || !socket.writable) {
            socket.destroy();
            return;
        }
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    app.use(helmet());
    app.set('trust proxy', 1); // For a single proxy (e.g., Render)
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: '*' }))
    app.use(morgan("combined", { stream }));
    app.use(express.json());


    const isProd = ENV_TYPE === 'production';

    // const sessionConfig: session.SessionOptions = {
    //     secret: SESSION_SECRET,
    //     resave: false,
    //     saveUninitialized: false,
    //     name: '__sid',
    //     cookie: {
    //         secure: isProd,
    //         httpOnly: true,
    //         sameSite: isProd ? 'strict' : 'lax',
    //         maxAge: Number(SESSION_LIFETIME)
    //     },
    //     store: pubClient
    //         ? new RedisStore({ client: pubClient, prefix: "sess:" })
    //         : new (connectPgSimple(session))({
    //             pool,
    //             tableName: "session",
    //             createTableIfMissing: !isProd // Only auto-create in dev
    //         })
    // };

    // app.use(session(sessionConfig));
    // app.use(passport.initialize());
    
    // app.use("/api/v1", v1Routes);
    app.use("/api/v1", v1Routes);

    app.get("/api/v1/health", (req, res) => {
        res.status(200).json({
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    });

    // Health check - For Render
    app.get("/", (_req, res) => {
        res.status(200).json({
            success: true,
            message: "BRDGR API is running",
        });
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
        console.warn(`Unmatched route: ${req.method} ${req.path}`);
        res.status(404).json({
            error: true,
            message: "Route not found. Please check the URL or refer to the API documentation.",
        });
        return;
    });

    app.use(errorHandler);

    return { server };
}
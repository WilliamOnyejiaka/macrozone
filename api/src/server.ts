import { PORT } from "./config/env";
import bootstrap from "./config/bootstrap";
import logger from "./config/logger";
import { checkDbConnection, pool } from "./db";

process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

(async () => {
    try {
        logger.info(`Worker ${process.pid} initializing...`);
        logger.info(`Starting standalone BullMQ worker process (PID: ${process.pid})...`);

        await Promise.all([
            checkDbConnection(),
        ]);

        const { server } = await bootstrap();

        const nodeServer = server.listen(PORT, () => {
            logger.info(`🚀 Server ${process.pid} running on port ${PORT}`);
        });

        const shutdown = async (signal: string) => {
            logger.info(
                `Server ${process.pid}: ${signal} received. Shutting down...`,
            );
            nodeServer.close(async () => {
                await Promise.allSettled([
                    pool.end(),
                ]);
                logger.info(`Server ${process.pid} terminated.`);
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        logger.error(`❌ Worker ${process.pid} startup error:`, error);
        process.exit(1);
    }
})();
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_URL } from "../config/env";
import * as schema from "./schema";

export const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    keepAlive: true,
});

pool.on("error", (err: any) => {
    if (err?.code === "ECONNRESET") {
        console.warn("[Postgres] Idle client disconnected (ECONNRESET). Pool will establish a new connection on next query.");
        return;
    }
    console.error("[Postgres] Unexpected idle client error:", err);
});

export const db = drizzle(pool, { schema, logger: true, casing: "snake_case" });
export type Database = typeof db;

export async function checkDbConnection() {
    try {
        await db.execute('select 1');
        console.log("✅ Database connection successful");
    } catch (err) {
        console.error("❌ Database connection failed: ", err);
    }
}

export default db;
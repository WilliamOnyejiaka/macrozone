import { pgTable, text, integer, timestamp, uuid, index, inet, varchar } from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    avatarPublicId: text("avatar_public_id"),
    dailyCalorieGoal: integer("daily_calorie_goal").notNull().default(2000),
    dailyProteinGoal: integer("daily_protein_goal").notNull().default(150),
    dailyCarbsGoal: integer("daily_carbs_goal").notNull().default(250),
    dailyFatGoal: integer("daily_fat_goal").notNull().default(65),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─── Meals ────────────────────────────────────────────────────────────────────

export const meals = pgTable("meals", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    calories: integer("calories").notNull(),
    protein: integer("protein").notNull().default(0),
    carbs: integer("carbs").notNull().default(0),
    fat: integer("fat").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;


export const sessions = pgTable(
    'sessions',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        // SHA-256 hash of the refresh token
        refreshTokenHash: varchar('refresh_token_hash', {
            length: 64,
        }).notNull().unique(),

        deviceId: varchar('device_id', {
            length: 255,
        }),

        deviceName: varchar('device_name', {
            length: 255,
        }),

        deviceType: varchar('device_type', {
            length: 50,
        }),

        userAgent: text('user_agent'),

        ipAddress: inet('ip_address'),

        // Session expiration
        expiresAt: timestamp('expires_at', {
            withTimezone: true,
        }).notNull(),

        // Last successful activity
        lastActiveAt: timestamp('last_active_at', {
            withTimezone: true,
        }).defaultNow().notNull(),

        // Revocation support
        revokedAt: timestamp('revoked_at', {
            withTimezone: true,
        }),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        }).defaultNow().notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        }).defaultNow().notNull(),
    },
    (table) => [
        index('sessions_user_id_idx')
            .on(table.userId),

        index('sessions_expires_at_idx')
            .on(table.expiresAt),

        index('sessions_revoked_at_idx')
            .on(table.revokedAt),
    ],
);
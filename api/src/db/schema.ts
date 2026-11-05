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

export const revokedAccessTokens = pgTable(
    'revoked_access_tokens',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        accessToken: varchar('access_token').notNull().unique(),

        userAgent: text('user_agent'),

        ipAddress: inet('ip_address'),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        }).defaultNow().notNull(),
    },
    (table) => [
        index('revoked_access_tokens_user_id_idx')
            .on(table.userId),

        index('revoked_access_tokens_created_at_idx')
            .on(table.createdAt),
    ],
);

export const userSessions = pgTable(
    'user_sessions',
    {
        id: uuid('id').primaryKey().defaultRandom(),

        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        refreshTokenHash: varchar('refresh_token_hash').notNull().unique(),

        userAgent: text('user_agent'),

        ipAddress: inet('ip_address'),

        expiresAt: timestamp('expires_at', {
            withTimezone: true,
        }).notNull(),

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
        index('user_sessions_user_id_idx')
            .on(table.userId),

        index('user_sessions_expires_at_idx')
            .on(table.expiresAt),

        index('user_sessions_revoked_at_idx')
            .on(table.revokedAt),
    ],
);

export type Session = typeof userSessions.$inferSelect;

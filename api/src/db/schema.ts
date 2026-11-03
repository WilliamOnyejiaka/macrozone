import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
    id: text("id").primaryKey(),
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
    id: text("id").primaryKey(),
    userId: text("user_id")
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
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;


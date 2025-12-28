import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // GitHub user ID
  login: text("login").notNull(), // GitHub username
  name: text("name"),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token").notNull(),
  email: text("email"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastLoginAt: text("last_login_at"),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(), // 'export', 'email', 'report'
  key: text("key").notNull(), // 'user-123:export'
  status: text("status").notNull(), // 'queued', 'started', 'completed', 'error'
  payload: text("payload"),
  result: text("result"),
  error: text("error"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
});

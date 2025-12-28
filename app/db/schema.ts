import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull(), // User email (required)

  // OAuth provider info
  provider: text("provider"), // 'github', 'google', 'auth0' (nullable for migration)
  remoteId: text("remote_id"), // Provider's user ID
  accessToken: text("access_token").notNull(), // OAuth access token

  // Profile data
  login: text("login"), // GitHub username (optional)
  name: text("name"),
  avatarUrl: text("avatar_url"),

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

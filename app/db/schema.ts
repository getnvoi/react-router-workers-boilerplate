import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull(), // User email (required)

  // Email/Password auth
  passwordHash: text("password_hash"), // bcrypt hash (nullable - for email/password users)

  // OAuth provider info (optional - for OAuth users)
  provider: text("provider"), // 'github', 'google', 'auth0'
  remoteId: text("remote_id"), // Provider's user ID
  accessToken: text("access_token"), // OAuth access token (nullable)

  // Profile data
  login: text("login"), // GitHub username (optional)
  name: text("name"),
  avatarUrl: text("avatar_url"),

  // Anthropic/Claude OAuth (secondary authentication)
  anthropicAccessToken: text("anthropic_access_token"),
  anthropicRefreshToken: text("anthropic_refresh_token"),
  anthropicExpiresAt: text("anthropic_expires_at"),
  anthropicScopes: text("anthropic_scopes"), // JSON array of scopes

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastLoginAt: text("last_login_at"),
});

export const systemUsers = sqliteTable("system_users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull(), // Email (unique)
  passwordHash: text("password_hash").notNull(), // bcrypt hash (required)
  name: text("name"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(), // UUID
  label: text("label").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const workspaceUsers = sqliteTable("workspace_users", {
  id: text("id").primaryKey(), // UUID
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const workspaceInvites = sqliteTable("workspace_invites", {
  id: text("id").primaryKey(), // UUID
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }), // If invitee has account
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  role: text("role").notNull(), // 'member' or 'admin'
  status: text("status").notNull(), // 'pending', 'accepted', 'declined', 'expired'
  expiresAt: text("expires_at").notNull(),
  acceptedAt: text("accepted_at"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
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

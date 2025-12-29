import { Miniflare } from "miniflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/db/schema";

let mf: Miniflare | null = null;

/**
 * Get or create shared Miniflare instance for tests
 */
export async function getMiniflare(): Promise<Miniflare> {
  if (!mf) {
    mf = new Miniflare({
      modules: true,
      script: "",
      d1Databases: ["DB"],
    });
  }
  return mf;
}

/**
 * Get D1 database instance for tests
 */
export async function getTestDb() {
  const miniflare = await getMiniflare();
  const d1 = await miniflare.getD1Database("DB");
  return { d1, db: drizzle(d1, { schema }) };
}

/**
 * Initialize test database schema
 */
export async function initTestDb(d1: D1Database) {
  await d1.batch([
    d1.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      provider TEXT,
      remote_id TEXT,
      access_token TEXT NOT NULL,
      login TEXT,
      name TEXT,
      avatar_url TEXT,
      anthropic_access_token TEXT,
      anthropic_refresh_token TEXT,
      anthropic_expires_at TEXT,
      anthropic_scopes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspace_users (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS workspace_users_workspace_id_user_id_unique
      ON workspace_users (workspace_id, user_id);

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      key TEXT NOT NULL,
      status TEXT NOT NULL,
      payload TEXT,
      result TEXT,
      error TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`),
  ]);
}

/**
 * Clean all data from test database (TRUNCATE equivalent for SQLite)
 */
export async function truncateTestDb(d1: D1Database) {
  // SQLite doesn't have TRUNCATE, so we DELETE all rows
  // Order matters due to foreign keys
  await d1.batch([
    d1.prepare("DELETE FROM workspace_users"),
    d1.prepare("DELETE FROM workspaces"),
    d1.prepare("DELETE FROM jobs"),
    d1.prepare("DELETE FROM users"),
  ]);
}

/**
 * Dispose Miniflare instance (call in global teardown)
 */
export async function disposeMiniflare() {
  if (mf) {
    await mf.dispose();
    mf = null;
  }
}

-- Add password_hash to users table for email/password auth
ALTER TABLE `users` ADD COLUMN `password_hash` text;

-- Make access_token nullable (not needed for email/password users)
-- Note: SQLite doesn't support ALTER COLUMN, so we accept it's already nullable in new schema

-- Create system_users table
CREATE TABLE `system_users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `name` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX `system_users_email_unique` ON `system_users` (`email`);

-- Create workspace_invites table
CREATE TABLE `workspace_invites` (
  `id` text PRIMARY KEY NOT NULL,
  `workspace_id` text NOT NULL,
  `email` text NOT NULL,
  `user_id` text,
  `invited_by_user_id` text NOT NULL,
  `token` text NOT NULL,
  `role` text NOT NULL,
  `status` text NOT NULL,
  `expires_at` text NOT NULL,
  `accepted_at` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade,
  FOREIGN KEY (`invited_by_user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX `workspace_invites_token_unique` ON `workspace_invites` (`token`);
CREATE UNIQUE INDEX `workspace_invites_workspace_email_pending_unique` ON `workspace_invites` (`workspace_id`, `email`) WHERE `status` = 'pending';

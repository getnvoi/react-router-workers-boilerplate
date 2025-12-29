-- Create workspaces table
CREATE TABLE `workspaces` (
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create workspace_users join table
CREATE TABLE `workspace_users` (
  `id` text PRIMARY KEY NOT NULL,
  `workspace_id` text NOT NULL,
  `user_id` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

-- Create unique index on workspace_id + user_id
CREATE UNIQUE INDEX `workspace_users_workspace_id_user_id_unique` ON `workspace_users` (`workspace_id`, `user_id`);

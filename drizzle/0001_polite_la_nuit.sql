CREATE TABLE `ai_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`hits` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`sender` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL
);

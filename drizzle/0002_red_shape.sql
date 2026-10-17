CREATE TABLE `privacy_choices` (
	`owner` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `provider_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`encrypted` text NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text NOT NULL,
	`tested_at` text,
	`test_status` text,
	`test_detail` text
);

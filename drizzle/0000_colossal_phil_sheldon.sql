CREATE TABLE `profiles` (
	`owner` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`owner` text PRIMARY KEY NOT NULL,
	`doctor` text NOT NULL
);

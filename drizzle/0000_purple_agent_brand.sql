CREATE TABLE `y_docs` (
	`name` text PRIMARY KEY NOT NULL,
	`state` blob NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('profiles', {owner:text('owner').primaryKey(), data:text('data').notNull()});
export const records = sqliteTable('records', {id:text('id').primaryKey(), owner:text('owner').notNull(), data:text('data').notNull(), created:text('created').notNull()});
export const shares = sqliteTable('shares', {owner:text('owner').primaryKey(), doctor:text('doctor').notNull()});

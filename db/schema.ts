import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const profiles = sqliteTable('profiles', {owner:text('owner').primaryKey(), data:text('data').notNull()});
export const records = sqliteTable('records', {id:text('id').primaryKey(), owner:text('owner').notNull(), data:text('data').notNull(), created:text('created').notNull()});
export const shares = sqliteTable('shares', {owner:text('owner').primaryKey(), doctor:text('doctor').notNull()});

export const aiUsage = sqliteTable('ai_usage', {id:text('id').primaryKey(),hits:integer('hits').notNull(),expires:integer('expires').notNull()});
export const messages = sqliteTable('messages', {id:text('id').primaryKey(),owner:text('owner').notNull(),sender:text('sender').notNull(),body:text('body').notNull(),created:text('created').notNull()});

export const providerSettings = sqliteTable('provider_settings',{id:text('id').primaryKey(),encrypted:text('encrypted').notNull(),updatedBy:text('updated_by').notNull(),updatedAt:text('updated_at').notNull(),testedAt:text('tested_at'),testStatus:text('test_status'),testDetail:text('test_detail')});
export const privacyChoices = sqliteTable('privacy_choices',{owner:text('owner').primaryKey(),data:text('data').notNull(),updated:text('updated').notNull()});

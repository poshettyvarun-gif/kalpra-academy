import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cmsEntries = sqliteTable('cms_entries', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const loginAttempts = sqliteTable(
  'login_attempts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    fingerprint: text('fingerprint').notNull(),
    attemptedAt: integer('attempted_at').notNull(),
    succeeded: integer('succeeded', { mode: 'boolean' }).notNull(),
  },
  (table) => [
    index('idx_login_attempts_fingerprint_time').on(
      table.fingerprint,
      table.attemptedAt,
    ),
  ],
);

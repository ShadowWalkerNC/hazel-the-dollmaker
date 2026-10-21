import {sql} from 'drizzle-orm';
import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const interests=sqliteTable('interests',{id:integer('id').primaryKey({autoIncrement:true}),kind:text('kind').notNull(),name:text('name').notNull(),email:text('email').notNull(),details:text('details').notNull(),createdAt:text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)});

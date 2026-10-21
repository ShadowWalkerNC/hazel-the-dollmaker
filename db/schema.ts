import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

// 1. Existing Interests table (Preserved untouched from 2c0ca4d)
export const interests = sqliteTable('interests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kind: text('kind').notNull(), // 'collector' | 'wrestler' | 'nomination'
  name: text('name').notNull(),
  email: text('email').notNull(),
  details: text('details').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// 2. Drops table for manageable side-business drops
export const drops = sqliteTable('drops', {
  id: text('id').primaryKey(),
  wrestlerName: text('wrestler_name').notNull(),
  title: text('title').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  heroImageUrl: text('hero_image_url').notNull().default('/hazel-logo.jpg'),
  capacityLimit: integer('capacity_limit').notNull().default(15), // total doll slots available
  dollsClaimed: integer('dolls_claimed').notNull().default(0),
  orderingWindowStart: text('ordering_window_start').notNull(),
  orderingWindowEnd: text('ordering_window_end').notNull(),
  estimatedShipByDate: text('estimated_ship_by_date').notNull(),
  status: text('status').notNull().default('preview'), // 'preview' | 'open' | 'paused' | 'sold_out' | 'closed'
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// 3. Products table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  originalPrice: real('original_price'),
  category: text('category').notNull(), // 'custom-doll' | 'limited' | 'bundle' | 'signature' | 'apparel' | 'accessories' | 'stickers'
  state: text('state').notNull().default('available'), // 'preview' | 'inquiry_only' | 'available' | 'sold_out' | 'archived'
  badge: text('badge'),
  mockupType: text('mockup_type'), // 'tee' | 'hoodie' | 'sticker' | 'pin' | 'tote' | 'doll'
  imageUrl: text('image_url').notNull().default('/hazel-logo.jpg'),
  dropId: text('drop_id'), // optional FK to drops.id
  dollCapacityUsage: integer('doll_capacity_usage').notNull().default(0), // 0 for apparel/stickers, 1 for doll, 2 for bundle with 2 dolls
  productionHours: real('production_hours').notNull().default(0), // approx 2-6h for handmade items
  hasSizes: integer('has_sizes', { mode: 'boolean' }).notNull().default(false),
  sizesJson: text('sizes_json').notNull().default('[]'),
  requiresCustomNotes: integer('requires_custom_notes', { mode: 'boolean' }).notNull().default(false),
  customNotesPlaceholder: text('custom_notes_placeholder'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// 4. Inquiries / Orders review table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // e.g. HDM-102938
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerInstagram: text('customer_instagram'),
  customerPhone: text('customer_phone'),
  preferredContact: text('preferred_contact').notNull().default('instagram'), // 'instagram' | 'whatsapp' | 'email'
  shippingAddress: text('shipping_address').notNull(),
  itemsJson: text('items_json').notNull(),
  dollSlotsReserved: integer('doll_slots_reserved').notNull().default(0),
  subtotal: real('subtotal').notNull(),
  discount: real('discount').notNull().default(0),
  shipping: real('shipping').notNull().default(0),
  total: real('total').notNull(),
  promoCode: text('promo_code'),
  status: text('status').notNull().default('pending_review'), // 'pending_review' | 'discussing' | 'confirmed' | 'crafted' | 'shipped' | 'cancelled'
  notesToHazel: text('notes_to_hazel'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

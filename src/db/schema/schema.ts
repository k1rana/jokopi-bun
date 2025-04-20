import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  date,
  numeric,
  uuid,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});



// deliveries
export const deliveries = pgTable('deliveries', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  fee: integer('fee').notNull().default(0),
});

// payments
export const payments = pgTable(
  'payments',
  {
    code: varchar('code', { length: 10 }).primaryKey(),
    id: serial('id').unique(),
    name: varchar('name', { length: 255 }),
    minAmount: integer('min_amount').notNull().default(0),
    maxAmount: integer('max_amount').notNull().default(0),
    fee: integer('fee').notNull().default(0),
  },
);

// product sizes
export const productSize = pgTable('product_size', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 4 }).notNull(),
  price: numeric('price', { precision: 3, scale: 2 }).notNull().default('0'),
});

// roles
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// status
export const status = pgTable('status', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

// products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 55 }),
  price: integer('price').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  categoryId: integer('category_id').notNull().default(0).references(() => categories.id),
  img: varchar('img', { length: 255 }),
  desc: text('desc'),
});

// promos
export const promo = pgTable(
  'promo',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    desc: text('desc').notNull(),
    discount: integer('discount'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    couponCode: varchar('coupon_code', { length: 25 }).notNull(),
    productId: integer('product_id')
      .references(() => products.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    img: text('img'),
  },
  (table) => [check(
    'promo_disc_check',
    sql`"discount" >= 1 AND "discount" <= 100`,
  ),
  ],
);

// users
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 50 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 18 }),
    roleId: integer('role_id').notNull().default(1).references(() => roles.id),
  },
  (table) => [
    uniqueIndex('unique_users_email').on(table.email),
    uniqueIndex('phone_number_unique').on(table.phoneNumber),
  ],
);

// carts
export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  sizeId: integer('size_id').notNull().references(() => productSize.id),
  count: integer('count').notNull().default(1),
});

// FCM tokens
export const fcmTokens = pgTable(
  'fcm_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    token: varchar('token').notNull(),
    userId: uuid('user_id').notNull().references(() => users.id),
    expiredTime: timestamp('expired_time', { withTimezone: true })
      .notNull()
      .default(sql`now() + '00:10:00'::interval`),
  },
  (table) => [
    uniqueIndex('no_duplicate_token_in_1_id').on(
      table.token,
      table.userId,
    )
  ],
);

// reset password
export const resetPassword = pgTable('reset_password', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  verify: varchar('verify').notNull(),
  code: varchar('code', { length: 8 }).notNull(),
  expiredAt: timestamp('expired_at').notNull().default(
    sql`CURRENT_TIMESTAMP + '00:10:00'::interval`,
  ),
});

// transactions
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  promoId: integer('promo_id').notNull().default(0).references(() => promo.id),
  shippingAddress: varchar('shipping_address', { length: 255 }),
  transactionTime: timestamp('transaction_time').defaultNow(),
  notes: text('notes'),
  deliveryId: integer('delivery_id').notNull().default(1).references(() => deliveries.id),
  statusId: integer('status_id').notNull().default(1).references(() => status.id),
  paymentId: integer('payment_id').references(() => payments.id),
  grandTotal: integer('grand_total').default(0),
});

// user profiles
export const userProfile = pgTable('user_profile', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id),
  displayName: varchar('display_name', { length: 50 }),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  address: text('address'),
  birthdate: date('birthdate'),
  img: varchar('img', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  gender: integer('gender').notNull().default(1),
});

// transaction product sizes
export const transactionProductSize = pgTable('transaction_product_size', {
  id: serial('id').primaryKey(),
  transactionId: integer('transaction_id')
    .notNull()
    .references(() => transactions.id),
  productId: integer('product_id').notNull().default(0).references(() => products.id),
  sizeId: integer('size_id').notNull().default(0).references(() => productSize.id),
  qty: varchar('qty').notNull().default('1'),
  subtotal: integer('subtotal').notNull().default(0),
});

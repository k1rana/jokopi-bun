CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" integer NOT NULL,
	"size_id" integer NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"fee" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fcm_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"expired_time" timestamp with time zone DEFAULT now() + '00:10:00'::interval NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"code" varchar(10) PRIMARY KEY NOT NULL,
	"id" serial NOT NULL,
	"name" varchar(255),
	"min_amount" integer DEFAULT 0 NOT NULL,
	"max_amount" integer DEFAULT 0 NOT NULL,
	"fee" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "payments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "product_size" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(4) NOT NULL,
	"price" numeric(3, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(55),
	"price" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"category_id" integer DEFAULT 0 NOT NULL,
	"img" varchar(255),
	"desc" text
);
--> statement-breakpoint
CREATE TABLE "promo" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"desc" text NOT NULL,
	"discount" integer,
	"start_date" date,
	"end_date" date,
	"coupon_code" varchar(25) NOT NULL,
	"product_id" integer,
	"img" text,
	CONSTRAINT "promo_disc_check" CHECK ("discount" >= 1 AND "discount" <= 100)
);
--> statement-breakpoint
CREATE TABLE "reset_password" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"verify" varchar NOT NULL,
	"code" varchar(8) NOT NULL,
	"expired_at" timestamp DEFAULT CURRENT_TIMESTAMP + '00:10:00'::interval NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "transaction_product_size" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer NOT NULL,
	"product_id" integer DEFAULT 0 NOT NULL,
	"size_id" integer DEFAULT 0 NOT NULL,
	"qty" varchar DEFAULT '1' NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"promo_id" integer DEFAULT 0 NOT NULL,
	"shipping_address" varchar(255),
	"transaction_time" timestamp DEFAULT now(),
	"notes" text,
	"delivery_id" integer DEFAULT 1 NOT NULL,
	"status_id" integer DEFAULT 1 NOT NULL,
	"payment_id" integer,
	"grand_total" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(50),
	"first_name" varchar(50),
	"last_name" varchar(50),
	"address" text,
	"birthdate" date,
	"img" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"gender" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone_number" varchar(18),
	"role_id" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_size_id_product_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."product_size"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fcm_tokens" ADD CONSTRAINT "fcm_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promo" ADD CONSTRAINT "promo_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_product_size" ADD CONSTRAINT "transaction_product_size_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_product_size" ADD CONSTRAINT "transaction_product_size_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_product_size" ADD CONSTRAINT "transaction_product_size_size_id_product_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."product_size"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_promo_id_promo_id_fk" FOREIGN KEY ("promo_id") REFERENCES "public"."promo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_status_id_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "no_duplicate_token_in_1_id" ON "fcm_tokens" USING btree ("token","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "phone_number_unique" ON "users" USING btree ("phone_number");
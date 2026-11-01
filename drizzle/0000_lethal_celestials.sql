CREATE TYPE "public"."article_kind" AS ENUM('article', 'biography', 'sponsored');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'pending_review', 'approved', 'scheduled', 'published', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('person', 'company', 'organization', 'market', 'product');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'rejected', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."payment_kind" AS ENUM('creator_plus', 'sponsored');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'successful', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."sponsored_proposal_status" AS ENUM('awaiting_payment', 'payment_failed', 'pending_review', 'accepted', 'rejected', 'refunding', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('inactive', 'pending', 'active', 'past_due', 'canceled');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_entities" (
	"article_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"role" varchar(32) DEFAULT 'mentions' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_likes" (
	"article_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"editor_id" text NOT NULL,
	"revision" jsonb NOT NULL,
	"note" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"publisher" varchar(120),
	"url" text NOT NULL,
	"accessed_at" timestamp with time zone,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"kind" "article_kind" DEFAULT 'article' NOT NULL,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"title" varchar(180) NOT NULL,
	"standfirst" varchar(360) NOT NULL,
	"body_markdown" text NOT NULL,
	"category" varchar(64) NOT NULL,
	"locale" varchar(12) DEFAULT 'pt-AO' NOT NULL,
	"person_country" varchar(100),
	"person_field" varchar(100),
	"person_role" varchar(160),
	"author_id" text NOT NULL,
	"editorial_author" varchar(120),
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_sponsored" boolean DEFAULT false NOT NULL,
	"sponsor_disclosure" varchar(180),
	"seo_title" varchar(70),
	"seo_description" varchar(180),
	"canonical_url" text,
	"cover_image_url" text,
	"no_index" boolean DEFAULT false NOT NULL,
	"reading_minutes" integer DEFAULT 1 NOT NULL,
	"submitted_with_plan" varchar(32) DEFAULT 'free' NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "articles_reading_minutes_positive" CHECK ("articles"."reading_minutes" > 0),
	CONSTRAINT "articles_sponsor_disclosure" CHECK ("articles"."is_sponsored" = false OR "articles"."sponsor_disclosure" IS NOT NULL),
	CONSTRAINT "articles_published_at_required" CHECK ("articles"."status" <> 'published' OR "articles"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"author_id" text NOT NULL,
	"parent_id" uuid,
	"body" varchar(2000) NOT NULL,
	"status" "moderation_status" DEFAULT 'pending' NOT NULL,
	"moderated_by" text,
	"moderated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(254) NOT NULL,
	"subject" varchar(140) NOT NULL,
	"message" varchar(4000) NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"slug" varchar(96) NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"biography" varchar(1000) DEFAULT '' NOT NULL,
	"country_code" varchar(2),
	"website_url" text,
	"image_url" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creator_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "creator_profiles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "creator_profiles_slug_format" CHECK ("creator_profiles"."slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"type" "entity_type" NOT NULL,
	"name" varchar(180) NOT NULL,
	"description" varchar(500) NOT NULL,
	"country_code" varchar(2),
	"website_url" text,
	"image_url" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "moderation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"comment_id" uuid,
	"moderator_id" text NOT NULL,
	"action" varchar(32) NOT NULL,
	"note" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(254) NOT NULL,
	"consented_at" timestamp with time zone NOT NULL,
	"unsubscribe_email_sent_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" "payment_kind" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"provider" varchar(24) DEFAULT 'flutterwave' NOT NULL,
	"tx_ref" varchar(240) NOT NULL,
	"provider_transaction_id" varchar(64),
	"amount_cents" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"provider_plan_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_tx_ref_unique" UNIQUE("tx_ref"),
	CONSTRAINT "payments_provider_transaction_id_unique" UNIQUE("provider_transaction_id"),
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sponsored_proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"package_id" varchar(64) NOT NULL,
	"payment_ref" varchar(240) NOT NULL,
	"provider_transaction_id" varchar(64),
	"amount_cents" integer NOT NULL,
	"contact_name" varchar(100) NOT NULL,
	"contact_email" varchar(254) NOT NULL,
	"title" varchar(140) NOT NULL,
	"idea" varchar(4000) NOT NULL,
	"status" "sponsored_proposal_status" DEFAULT 'awaiting_payment' NOT NULL,
	"reviewed_by" text,
	"review_note" varchar(1000),
	"paid_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"provider_refund_id" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsored_proposals_payment_ref_unique" UNIQUE("payment_ref"),
	CONSTRAINT "sponsored_proposals_provider_transaction_id_unique" UNIQUE("provider_transaction_id"),
	CONSTRAINT "sponsored_proposals_amount_positive" CHECK ("sponsored_proposals"."amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"plan" varchar(32) DEFAULT 'creator_plus' NOT NULL,
	"status" "subscription_status" DEFAULT 'inactive' NOT NULL,
	"provider" varchar(24) DEFAULT 'flutterwave' NOT NULL,
	"provider_plan_id" text NOT NULL,
	"provider_subscription_id" text,
	"customer_email" text NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscriptions_provider_subscription_id_unique" UNIQUE("provider_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_role_valid" CHECK ("user"."role" IN ('user', 'editor', 'admin'))
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"event_hash" varchar(64) PRIMARY KEY NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_entities" ADD CONSTRAINT "article_entities_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_entities" ADD CONSTRAINT "article_entities_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_editor_id_user_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_sources" ADD CONSTRAINT "article_sources_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_events" ADD CONSTRAINT "moderation_events_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_events" ADD CONSTRAINT "moderation_events_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_events" ADD CONSTRAINT "moderation_events_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_proposals" ADD CONSTRAINT "sponsored_proposals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_proposals" ADD CONSTRAINT "sponsored_proposals_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "article_entities_unique" ON "article_entities" USING btree ("article_id","entity_id");--> statement-breakpoint
CREATE INDEX "article_entities_entity_idx" ON "article_entities" USING btree ("entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "article_likes_unique" ON "article_likes" USING btree ("article_id","user_id");--> statement-breakpoint
CREATE INDEX "article_likes_user_created_idx" ON "article_likes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "article_revisions_article_created_idx" ON "article_revisions" USING btree ("article_id","created_at");--> statement-breakpoint
CREATE INDEX "article_sources_article_position_idx" ON "article_sources" USING btree ("article_id","position");--> statement-breakpoint
CREATE INDEX "articles_public_feed_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_author_status_idx" ON "articles" USING btree ("author_id","status","updated_at");--> statement-breakpoint
CREATE INDEX "articles_category_status_idx" ON "articles" USING btree ("category","status","published_at");--> statement-breakpoint
CREATE INDEX "comments_public_thread_idx" ON "comments" USING btree ("article_id","status","created_at");--> statement-breakpoint
CREATE INDEX "comments_author_created_idx" ON "comments" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "contact_messages_status_created_idx" ON "contact_messages" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "entities_type_name_idx" ON "entities" USING btree ("type","name");--> statement-breakpoint
CREATE INDEX "moderation_events_article_created_idx" ON "moderation_events" USING btree ("article_id","created_at");--> statement-breakpoint
CREATE INDEX "moderation_events_moderator_created_idx" ON "moderation_events" USING btree ("moderator_id","created_at");--> statement-breakpoint
CREATE INDEX "newsletter_subscribers_active_idx" ON "newsletter_subscribers" USING btree ("unsubscribed_at","created_at");--> statement-breakpoint
CREATE INDEX "payments_user_created_idx" ON "payments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "payments_status_created_idx" ON "payments" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sponsored_proposals_status_created_idx" ON "sponsored_proposals" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "sponsored_proposals_email_created_idx" ON "sponsored_proposals" USING btree ("contact_email","created_at");--> statement-breakpoint
CREATE INDEX "subscriptions_status_period_idx" ON "subscriptions" USING btree ("status","current_period_end");--> statement-breakpoint
CREATE INDEX "subscriptions_customer_email_idx" ON "subscriptions" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "user_role_created_idx" ON "user" USING btree ("role","created_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "webhook_events_created_idx" ON "webhook_events" USING btree ("created_at");
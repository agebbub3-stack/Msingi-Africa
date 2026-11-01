import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  type AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

export const articleStatus = pgEnum("article_status", [
  "draft",
  "pending_review",
  "approved",
  "scheduled",
  "published",
  "rejected",
  "archived",
]);
export const articleKind = pgEnum("article_kind", ["article", "biography", "sponsored"]);
export const moderationStatus = pgEnum("moderation_status", ["pending", "approved", "rejected", "hidden"]);
export const entityType = pgEnum("entity_type", ["person", "company", "organization", "market", "product"]);
export const subscriptionStatus = pgEnum("subscription_status", [
  "inactive",
  "pending",
  "active",
  "past_due",
  "canceled",
]);
export const paymentStatus = pgEnum("payment_status", ["pending", "successful", "failed", "refunded"]);
export const paymentKind = pgEnum("payment_kind", ["creator_plus", "sponsored"]);
export const sponsoredProposalStatus = pgEnum("sponsored_proposal_status", [
  "awaiting_payment",
  "payment_failed",
  "pending_review",
  "accepted",
  "rejected",
  "refunding",
  "refunded",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  banned: boolean("banned").notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("user_role_created_idx").on(table.role, table.createdAt),
  check("user_role_valid", sql`${table.role} IN ('user', 'editor', 'admin')`),
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("session_user_id_idx").on(table.userId),
  index("session_expires_at_idx").on(table.expiresAt),
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId),
  index("account_user_id_idx").on(table.userId),
]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("verification_identifier_idx").on(table.identifier),
  index("verification_expires_at_idx").on(table.expiresAt),
]);

export const creatorProfiles = pgTable("creator_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  biography: varchar("biography", { length: 1000 }).notNull().default(""),
  countryCode: varchar("country_code", { length: 2 }),
  websiteUrl: text("website_url"),
  imageUrl: text("image_url"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  check("creator_profiles_slug_format", sql`${table.slug} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`),
]);

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  kind: articleKind("kind").notNull().default("article"),
  status: articleStatus("status").notNull().default("draft"),
  title: varchar("title", { length: 180 }).notNull(),
  standfirst: varchar("standfirst", { length: 360 }).notNull(),
  bodyMarkdown: text("body_markdown").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  locale: varchar("locale", { length: 12 }).notNull().default("pt-AO"),
  personCountry: varchar("person_country", { length: 100 }),
  personField: varchar("person_field", { length: 100 }),
  personRole: varchar("person_role", { length: 160 }),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  editorialAuthor: varchar("editorial_author", { length: 120 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isSponsored: boolean("is_sponsored").notNull().default(false),
  sponsorDisclosure: varchar("sponsor_disclosure", { length: 180 }),
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 180 }),
  seoKeywords: text("seo_keywords").array().notNull().default(sql`'{}'::text[]`),
  canonicalUrl: text("canonical_url"),
  coverImageUrl: text("cover_image_url"),
  noIndex: boolean("no_index").notNull().default(false),
  readingMinutes: integer("reading_minutes").notNull().default(1),
  submittedWithPlan: varchar("submitted_with_plan", { length: 32 }).notNull().default("free"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("articles_public_feed_idx").on(table.status, table.publishedAt),
  index("articles_author_status_idx").on(table.authorId, table.status, table.updatedAt),
  index("articles_category_status_idx").on(table.category, table.status, table.publishedAt),
  check("articles_reading_minutes_positive", sql`${table.readingMinutes} > 0`),
  check("articles_sponsor_disclosure", sql`${table.isSponsored} = false OR ${table.sponsorDisclosure} IS NOT NULL`),
  check("articles_published_at_required", sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`),
]);

export const articleSources = pgTable("article_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  publisher: varchar("publisher", { length: 120 }),
  url: text("url").notNull(),
  accessedAt: timestamp("accessed_at", { withTimezone: true }),
  position: integer("position").notNull().default(0),
  createdAt: createdAt(),
}, (table) => [
  index("article_sources_article_position_idx").on(table.articleId, table.position),
]);

export const articleRevisions = pgTable("article_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  editorId: text("editor_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  revision: jsonb("revision").$type<Record<string, unknown>>().notNull(),
  note: varchar("note", { length: 1000 }),
  createdAt: createdAt(),
}, (table) => [
  index("article_revisions_article_created_idx").on(table.articleId, table.createdAt),
]);

export const entities = pgTable("entities", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  type: entityType("type").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  countryCode: varchar("country_code", { length: 2 }),
  websiteUrl: text("website_url"),
  imageUrl: text("image_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("entities_type_name_idx").on(table.type, table.name),
]);

export const articleEntities = pgTable("article_entities", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  entityId: uuid("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 32 }).notNull().default("mentions"),
  createdAt: createdAt(),
}, (table) => [
  uniqueIndex("article_entities_unique").on(table.articleId, table.entityId),
  index("article_entities_entity_idx").on(table.entityId),
]);

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): AnyPgColumn => comments.id, { onDelete: "set null" }),
  body: varchar("body", { length: 2000 }).notNull(),
  status: moderationStatus("status").notNull().default("pending"),
  moderatedBy: text("moderated_by").references(() => user.id, { onDelete: "set null" }),
  moderatedAt: timestamp("moderated_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (table) => [
  index("comments_public_thread_idx").on(table.articleId, table.status, table.createdAt),
  index("comments_author_created_idx").on(table.authorId, table.createdAt),
]);

export const moderationEvents = pgTable("moderation_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: "set null" }),
  moderatorId: text("moderator_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  action: varchar("action", { length: 32 }).notNull(),
  note: varchar("note", { length: 1000 }),
  createdAt: createdAt(),
}, (table) => [
  index("moderation_events_article_created_idx").on(table.articleId, table.createdAt),
  index("moderation_events_moderator_created_idx").on(table.moderatorId, table.createdAt),
]);

export const articleLikes = pgTable("article_likes", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: createdAt(),
}, (table) => [
  uniqueIndex("article_likes_unique").on(table.articleId, table.userId),
  index("article_likes_user_created_idx").on(table.userId, table.createdAt),
]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  plan: varchar("plan", { length: 32 }).notNull().default("creator_plus"),
  status: subscriptionStatus("status").notNull().default("inactive"),
  provider: varchar("provider", { length: 24 }).notNull().default("flutterwave"),
  providerPlanId: text("provider_plan_id").notNull(),
  providerSubscriptionId: text("provider_subscription_id").unique(),
  customerEmail: text("customer_email").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("subscriptions_status_period_idx").on(table.status, table.currentPeriodEnd),
  index("subscriptions_customer_email_idx").on(table.customerEmail),
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  kind: paymentKind("kind").notNull(),
  status: paymentStatus("status").notNull().default("pending"),
  provider: varchar("provider", { length: 24 }).notNull().default("flutterwave"),
  txRef: varchar("tx_ref", { length: 240 }).notNull().unique(),
  providerTransactionId: varchar("provider_transaction_id", { length: 64 }).unique(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  providerPlanId: text("provider_plan_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("payments_user_created_idx").on(table.userId, table.createdAt),
  index("payments_status_created_idx").on(table.status, table.createdAt),
  check("payments_amount_positive", sql`${table.amountCents} > 0`),
]);

export const sponsoredProposals = pgTable("sponsored_proposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  packageId: varchar("package_id", { length: 64 }).notNull(),
  paymentRef: varchar("payment_ref", { length: 240 }).notNull().unique(),
  providerTransactionId: varchar("provider_transaction_id", { length: 64 }).unique(),
  amountCents: integer("amount_cents").notNull(),
  contactName: varchar("contact_name", { length: 100 }).notNull(),
  contactEmail: varchar("contact_email", { length: 254 }).notNull(),
  title: varchar("title", { length: 140 }).notNull(),
  idea: varchar("idea", { length: 4000 }).notNull(),
  status: sponsoredProposalStatus("status").notNull().default("awaiting_payment"),
  reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
  reviewNote: varchar("review_note", { length: 1000 }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  refundedAt: timestamp("refunded_at", { withTimezone: true }),
  providerRefundId: varchar("provider_refund_id", { length: 64 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("sponsored_proposals_status_created_idx").on(table.status, table.createdAt),
  index("sponsored_proposals_email_created_idx").on(table.contactEmail, table.createdAt),
  check("sponsored_proposals_amount_positive", sql`${table.amountCents} > 0`),
]);

export const webhookEvents = pgTable("webhook_events", {
  eventHash: varchar("event_hash", { length: 64 }).primaryKey(),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (table) => [
  index("webhook_events_created_idx").on(table.createdAt),
]);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  subject: varchar("subject", { length: 140 }).notNull(),
  message: varchar("message", { length: 4000 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: createdAt(),
}, (table) => [
  index("contact_messages_status_created_idx").on(table.status, table.createdAt),
]);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  consentedAt: timestamp("consented_at", { withTimezone: true }).notNull(),
  unsubscribeEmailSentAt: timestamp("unsubscribe_email_sent_at", { withTimezone: true }),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (table) => [
  index("newsletter_subscribers_active_idx").on(table.unsubscribedAt, table.createdAt),
]);

export const userRelations = relations(user, ({ many, one }) => ({
  authoredArticles: many(articles),
  comments: many(comments),
  subscription: one(subscriptions),
  profile: one(creatorProfiles),
}));

export const articleRelations = relations(articles, ({ many, one }) => ({
  author: one(user, { fields: [articles.authorId], references: [user.id] }),
  sources: many(articleSources),
  comments: many(comments),
  likes: many(articleLikes),
  entities: many(articleEntities),
}));

export const creatorRelations = relations(creatorProfiles, ({ one }) => ({
  user: one(user, { fields: [creatorProfiles.userId], references: [user.id] }),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, { fields: [subscriptions.userId], references: [user.id] }),
}));

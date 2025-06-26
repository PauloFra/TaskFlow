import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  avatar: text("avatar"),
  provider: varchar("provider", { length: 50 }),
  providerId: varchar("provider_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: boolean("email_verified").default(false),
});

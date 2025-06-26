import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { users } from "./users";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  taskId: integer("task_id")
    .references(() => tasks.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const yDocs = sqliteTable("y_docs", {
    name: text("name").primaryKey(),
    state: blob("state", { mode: "buffer" }).$type<Uint8Array>().notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`(unixepoch() * 1000)`),
});

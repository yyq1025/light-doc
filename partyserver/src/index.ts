import { eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { routePartykitRequest } from "partyserver";
import { YServer } from "y-partyserver";
import * as Y from "yjs";
import { yDocs } from "./db/schema";

export class MyYServer extends YServer {
	private db: DrizzleD1Database | null = null;

	private getDb() {
		if (!this.db) this.db = drizzle(this.env.DB);
		return this.db;
	}

	async onLoad() {
		const db = this.getDb();
		const row = await db
			.select()
			.from(yDocs)
			.where(eq(yDocs.name, this.name))
			.get();
		if (row) {
			Y.applyUpdate(this.document, row.state);
		}
	}

	async onSave() {
		const db = this.getDb();
		const update = Y.encodeStateAsUpdate(this.document);
		await db
			.insert(yDocs)
			.values({ name: this.name, state: update, updatedAt: new Date() })
			.onConflictDoUpdate({
				target: yDocs.name,
				set: { state: update, updatedAt: new Date() },
			});
	}
}

export default {
	// Set up your fetch handler to use configured Servers
	fetch(request: Request, env: Env) {
		return (
			routePartykitRequest(request, env) ||
			new Response("Not Found", { status: 404 })
		);
	},
};

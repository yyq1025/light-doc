import { routePartykitRequest } from "partyserver";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as Y from "yjs";
import { yDocs } from "./db/schema";
import { YServer } from "y-partyserver";

export class MyYServer extends YServer {

	private db!: DrizzleD1Database;

	async onStart() {
		this.db = drizzle(this.env.DB);
	}

	async onLoad() {
		const row = await this.db.select().from(yDocs).where(eq(yDocs.name, this.name)).get();
		if (row) {
			Y.applyUpdate(this.document, row.state);
		}
	}

	async onSave() {
		const update = Y.encodeStateAsUpdate(this.document);
		await this.db.insert(yDocs).values({ name: this.name, state: update, updatedAt: new Date() })
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

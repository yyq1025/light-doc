import { eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { routePartykitRequest } from "partyserver";
import { YServer } from "y-partyserver";
import * as Y from "yjs";
import { yDocs } from "./db/schema";

export class MyYServer extends YServer {
	static callbackOptions = {
		debounceWait: 2000,
		debounceMaxWait: 10000,
		timeout: 5000,
	};

	private db!: DrizzleD1Database;

	async onStart() {
		this.db = drizzle(this.env.DB);
	}

	async onLoad() {
		const row = await this.db
			.select()
			.from(yDocs)
			.where(eq(yDocs.name, this.name))
			.get();
		if (row) {
			Y.applyUpdate(this.document, row.state);
		}
	}

	async onSave() {
		const update = Y.encodeStateAsUpdate(this.document);
		await this.db
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

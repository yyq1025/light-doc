export { YServer as MyYServer } from "y-partyserver";
import { routePartykitRequest } from "partyserver";

type Env = {
	MyYServer: DurableObjectNamespace;
};

export default {
	// Set up your fetch handler to use configured Servers
	fetch(request: Request, env: Env) {
		return (
			routePartykitRequest(request, env) ||
			new Response("Not Found", { status: 404 })
		);
	},
};

import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { routePartykitRequest } from "partyserver";

export const Route = createFileRoute("/parties/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return (
          (await routePartykitRequest(request, env)) ||
          new Response("Not Found", { status: 404 })
        );
      },
    },
  },
});

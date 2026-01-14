import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import Tiptap from "@/components/tiptap";

const rootSearchSchema = z.object({
	room: z.nanoid().optional().catch(undefined),
});

export const Route = createFileRoute("/")({
	component: App,
	validateSearch: rootSearchSchema,
});

function App() {
	const { room } = Route.useSearch();
	return (
		<div className="w-screen h-screen overflow-auto p-4">
			<Tiptap room={room} />
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import Tiptap from "@/components/tiptap";

type RootSearch = {
  room?: string;
};

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: (search: RootSearch) => {
    return {
      room: search.room?.toString(),
    };
  },
});

function App() {
  const { room } = Route.useSearch();
  return (
    <div className="w-screen h-screen overflow-auto p-4">
      <Tiptap room={room} />
    </div>
  );
}

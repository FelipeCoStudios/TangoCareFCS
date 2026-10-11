import { createFileRoute } from "@tanstack/react-router";
import TangoApp from "@/game/TangoApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TangoApp />;
}

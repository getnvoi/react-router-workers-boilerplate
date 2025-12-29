import type { Route } from "./+types/system";
import { SystemView } from "~/views/system/dashboard/system-view";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "System Dashboard - nvoi" },
    { name: "description", content: "Internal system dashboard" },
  ];
}

export default function SystemDashboard() {
  return <SystemView />;
}

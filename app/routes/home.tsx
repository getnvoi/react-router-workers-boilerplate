import type { Route } from "./+types/home";
import { getUserFromSession } from "~/services/auth.server";
import { getConfiguredProviders } from "~/services/oauth/handler";
import { HomeView } from "~/views/public/home/home-view";

export function meta() {
  return [
    { title: "nvoi - Multi-Provider OAuth" },
    { name: "description", content: "Welcome to nvoi!" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  const providers = getConfiguredProviders(context.cloudflare.env);
  return { user, providers };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomeView {...loaderData} />;
}

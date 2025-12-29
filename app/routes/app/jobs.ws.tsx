import type { Route } from "./+types/jobs.ws";
import { getAuthenticatedUser } from "~/services/auth.server";
import { proxyToDurableObject } from "~/services/durable-object";

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getAuthenticatedUser(request);

  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }

  return proxyToDurableObject(
    request,
    context.cloudflare.env.JOB_RUNNER,
    user.id
  );
}

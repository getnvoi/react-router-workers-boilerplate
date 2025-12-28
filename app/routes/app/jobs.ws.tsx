import type { Route } from "./+types/jobs.ws";
import { getAuthenticatedUser } from "~/services/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getAuthenticatedUser(request);

  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }

  const doId = context.cloudflare.env.JOB_RUNNER.idFromName(user.id);
  const jobRunner = context.cloudflare.env.JOB_RUNNER.get(doId);

  return jobRunner.fetch(request);
}

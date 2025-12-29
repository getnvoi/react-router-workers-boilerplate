import type { Route } from "./+types/oauth.github";
import { buildAuthorizationUrl } from "~/services/oauth/handler";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { getSession, commitSession } = await import("~/sessions.server");

  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16));
  const stateB64 = btoa(String.fromCharCode(...state));

  // Store state in session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("oauth_state", stateB64);

  // Build OAuth URL using shared handler
  const redirectUri = new URL(request.url);
  redirectUri.pathname = "/oauth/github/callback";
  const authUrl = buildAuthorizationUrl(
    "github",
    stateB64,
    redirectUri.toString(),
    context.cloudflare.env,
  );

  // Redirect to GitHub with state cookie
  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": await commitSession(session),
    },
  });
}

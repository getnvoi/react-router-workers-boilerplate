import type { Route } from "./+types/oauth.github";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { getSession, commitSession } = await import("~/sessions.server");

  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16));
  const stateB64 = btoa(String.fromCharCode(...state));

  // Store state in session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("oauth_state", stateB64);

  // Build GitHub OAuth URL
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", context.cloudflare.env.GITHUB_CLIENT_ID);
  url.searchParams.set("state", stateB64);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set(
    "redirect_uri",
    context.cloudflare.env.OAUTH_REDIRECT_URI,
  );

  // Redirect to GitHub with state cookie
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": await commitSession(session),
    },
  });
}

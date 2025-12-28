import type { Route } from "./+types/oauth.google.callback";
import { redirect } from "react-router";
import { getSession } from "~/sessions.server";
import { handleOAuthCallback } from "~/services/oauth/handler";
import { createUserSession } from "~/services/auth.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Get state from session
  const session = await getSession(request.headers.get("Cookie"));
  const sessionState = session.get("oauth_state");

  // Validate state (CSRF protection)
  if (!code || !state || !sessionState || state !== sessionState) {
    return redirect("/?error=invalid_oauth_state");
  }

  try {
    // Build redirect URI
    const redirectUri = new URL(request.url);
    redirectUri.search = ""; // Remove query params

    // Handle OAuth callback with shared handler
    const user = await handleOAuthCallback(
      "google",
      code,
      redirectUri.toString(),
      context.cloudflare.env
    );

    // Create user session and redirect to app
    return createUserSession(user, "/app");
  } catch (error) {
    console.error("Google OAuth error:", error);
    return redirect("/?error=oauth_failed");
  }
}

import type { Route } from "./+types/oauth.github.callback";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { redirect } = await import("react-router");
  const { getSession } = await import("~/sessions.server");
  const { exchangeGitHubCode, fetchGitHubUser, upsertUser, createUserSession } =
    await import("~/services/auth.server");
  const { getDb } = await import("~/db");

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
    // Exchange code for access token
    const accessToken = await exchangeGitHubCode(
      code,
      context.cloudflare.env.GITHUB_CLIENT_ID,
      context.cloudflare.env.GITHUB_CLIENT_SECRET,
      context.cloudflare.env.OAUTH_REDIRECT_URI,
    );

    // Fetch GitHub user
    const ghUser = await fetchGitHubUser(accessToken);

    // Upsert user in database
    const db = getDb(context.cloudflare.env.DB);
    const user = await upsertUser(db, ghUser, accessToken);

    // Create user session and redirect to app
    return createUserSession(user, "/app");
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return redirect("/?error=oauth_failed");
  }
}

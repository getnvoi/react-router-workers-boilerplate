import type { Route } from "./+types/app.settings.anthropic";
import { Form, redirect } from "react-router";
import { getSession, commitSession } from "~/sessions.server";
import { getUserFromSession } from "~/services/auth.server";
import {
  buildAnthropicAuthUrl,
  exchangeAnthropicToken,
} from "~/services/oauth/providers/anthropic";
import { getDb, users } from "~/db";
import { eq } from "drizzle-orm";
import { Check, ExternalLink, Info } from "lucide-react";

/**
 * GET: Generate and display Anthropic OAuth URL
 * User must be authenticated first
 */
export async function loader({ request, context }: Route.LoaderArgs) {
  // Check if user is authenticated
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect("/?error=authentication_required");
  }

  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16));
  const stateB64 = btoa(String.fromCharCode(...state));

  // Generate PKCE parameters and build auth URL
  const { url: authUrl, verifier } = await buildAnthropicAuthUrl(stateB64);

  // Store state and verifier in session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("oauth_state", stateB64);
  session.set("oauth_verifier", verifier);

  // Get current Anthropic connection status
  const db = getDb(context.cloudflare.env.DB);
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const currentUser = userRows[0];
  const isConnected = !!(
    currentUser?.anthropicAccessToken &&
    currentUser?.anthropicExpiresAt &&
    new Date(currentUser.anthropicExpiresAt) > new Date()
  );

  // Return session cookie and auth URL
  return {
    authUrl,
    isConnected,
    user,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

/**
 * POST: Exchange authorization code for access token
 */
export async function action({ request, context }: Route.ActionArgs) {
  // Check if user is authenticated
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect("/?error=authentication_required");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const sessionState = session.get("oauth_state");
  const sessionVerifier = session.get("oauth_verifier");

  if (!sessionState || !sessionVerifier) {
    return redirect("/app/settings/anthropic?error=invalid_session");
  }

  try {
    const formData = await request.formData();
    const code = formData.get("code") as string;
    const state = formData.get("state") as string;

    // Validate state (CSRF protection)
    if (!code || state !== sessionState) {
      return redirect("/app/settings/anthropic?error=invalid_state");
    }

    // Exchange code for access token using PKCE verifier
    const tokenData = await exchangeAnthropicToken(code, sessionVerifier);

    // Save Anthropic tokens to current user's account
    const db = getDb(context.cloudflare.env.DB);
    await db
      .update(users)
      .set({
        anthropicAccessToken: tokenData.access_token,
        anthropicRefreshToken: tokenData.refresh_token,
        anthropicExpiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        anthropicScopes: JSON.stringify(["org:create_api_key", "user:profile", "user:inference"]),
      })
      .where(eq(users.id, user.id));

    // Clear OAuth session data
    session.unset("oauth_state");
    session.unset("oauth_verifier");

    // Redirect back to settings with success
    return redirect("/app/settings/anthropic?success=true", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Anthropic OAuth error:", error);
    return redirect("/app/settings/anthropic?error=token_exchange_failed");
  }
}

/**
 * Component: Anthropic OAuth Settings Page
 */
export default function AnthropicSettings({ loaderData }: Route.ComponentProps) {
  const { authUrl, isConnected, user } = loaderData;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Claude Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Claude account to enable AI-powered features
          </p>
        </div>

        {/* Connection Status */}
        <div className="rounded-lg bg-white px-6 py-8 shadow">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Claude Connected
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your Claude account is connected and ready to use
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900">Account Info</h4>
                <dl className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">User:</dt>
                    <dd className="font-medium text-gray-900">{user.name || user.login}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Disconnect Claude
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Authorization URL */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Step 1: Authorize with Claude
                </h3>
                <p className="text-sm text-gray-600">
                  Click the button below to open the Claude authorization page:
                </p>
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Open Claude Authorization
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </div>

              {/* Step 2: Manual code entry */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Step 2: Enter Authorization Code
                </h3>
                <p className="text-sm text-gray-600">
                  After authorizing, copy the code shown by Claude and paste it below:
                </p>

                <Form method="post" className="space-y-4">
                  {/* Hidden state field */}
                  <input
                    type="hidden"
                    name="state"
                    value={new URL(authUrl).searchParams.get("state") || ""}
                  />

                  {/* Code input */}
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Authorization Code
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      placeholder="Paste code here (e.g., abc123#xyz789)"
                      className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The code may include a # symbol - paste the entire string
                    </p>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Connect Claude Account
                  </button>
                </Form>
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Claude OAuth
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This connection uses OAuth with PKCE (Proof Key for Code Exchange)
                  for secure authentication. The authorization code must be manually
                  entered because Anthropic redirects to their console, not directly
                  back to this application.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to app */}
        <div className="text-center">
          <a
            href="/app"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to app
          </a>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "react-router";
import { type getDb, users } from "~/db";
import { getSession, commitSession, destroySession } from "~/sessions.server";
import type { SessionUser } from "~/sessions.server";

type GitHubUser = {
  id: number;
  login: string;
  name?: string;
  avatar_url?: string;
  email?: string;
};

type GitHubTokenResponse = {
  access_token?: string;
  token_type?: string;
  error?: string;
};

export async function exchangeGitHubCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<string> {
  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResp.ok) {
    const errorText = await tokenResp.text();
    throw new Error(`OAuth token exchange failed: ${errorText}`);
  }

  const text = await tokenResp.text();
  if (!text) {
    throw new Error("Empty response from GitHub OAuth");
  }

  const tokenData = JSON.parse(text) as GitHubTokenResponse;

  if (!tokenData.access_token) {
    throw new Error("No access token received");
  }

  return tokenData.access_token;
}

export async function fetchGitHubUser(
  accessToken: string,
): Promise<GitHubUser> {
  const ghUserResp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "nvoi-app",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!ghUserResp.ok) {
    const errorText = await ghUserResp.text();
    throw new Error(`Failed to fetch GitHub user: ${errorText}`);
  }

  const text = await ghUserResp.text();
  if (!text) {
    throw new Error("Empty response from GitHub API");
  }

  return JSON.parse(text) as GitHubUser;
}

export async function upsertUser(
  db: ReturnType<typeof getDb>,
  ghUser: GitHubUser,
  accessToken: string,
): Promise<SessionUser> {
  await db
    .insert(users)
    .values({
      id: String(ghUser.id),
      login: ghUser.login,
      name: ghUser.name,
      avatarUrl: ghUser.avatar_url,
      accessToken: accessToken,
      email: ghUser.email,
      lastLoginAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        login: ghUser.login,
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        accessToken: accessToken,
        email: ghUser.email,
        lastLoginAt: new Date().toISOString(),
      },
    });

  return {
    id: String(ghUser.id),
    login: ghUser.login,
    name: ghUser.name,
    avatarUrl: ghUser.avatar_url,
  };
}

export async function getUserFromSession(
  request: Request,
): Promise<SessionUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user || null;
}

export async function requireUser(request: Request): Promise<SessionUser> {
  const user = await getUserFromSession(request);
  if (!user) {
    throw redirect("/");
  }
  return user;
}

export async function getAuthenticatedUser(
  request: Request,
): Promise<SessionUser> {
  const user = await getUserFromSession(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}

export async function createUserSession(
  user: SessionUser,
  redirectTo: string,
): Promise<Response> {
  const session = await getSession();
  session.set("user", user);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function logout(request: Request): Promise<Response> {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

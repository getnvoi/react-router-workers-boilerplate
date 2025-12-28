import { createCookieSessionStorage } from "react-router";

export type SessionUser = {
  id: string;
  login: string;
  name?: string;
  avatarUrl?: string;
};

type SessionData = {
  user: SessionUser;
  oauth_state?: string; // For CSRF protection during OAuth
};

type SessionFlashData = {
  error: string;
};

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [
      process.env.SESSION_SECRET || "default-secret-change-in-production",
    ],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

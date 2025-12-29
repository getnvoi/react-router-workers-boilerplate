import { vi } from "vitest";

export function createMockCloudflareContext() {
  // Mock D1 database with all methods needed by Drizzle
  const mockPreparedStatement = {
    bind: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue({ results: [], success: true }),
    first: vi.fn().mockResolvedValue(null),
    run: vi.fn().mockResolvedValue({ success: true }),
    raw: vi.fn().mockResolvedValue([]),
  };

  const mockDb = {
    prepare: vi.fn().mockReturnValue(mockPreparedStatement),
    batch: vi.fn().mockResolvedValue([]),
    exec: vi.fn().mockResolvedValue({ count: 0, duration: 0 }),
  } as any;

  return {
    cloudflare: {
      env: {
        DB: mockDb as any,
        GITHUB_CLIENT_ID: "test-github-client-id",
        GITHUB_CLIENT_SECRET: "test-github-secret",
        GOOGLE_CLIENT_ID: "test-google-client-id",
        GOOGLE_CLIENT_SECRET: "test-google-secret",
        AUTH0_CLIENT_ID: "test-auth0-client-id",
        AUTH0_CLIENT_SECRET: "test-auth0-secret",
        AUTH0_DOMAIN: "test.auth0.com",
        OAUTH_REDIRECT_URI: "http://localhost:3000",
        SESSION_SECRET: "test-session-secret",
        JOB_QUEUE: {} as any,
        JOB_RUNNER: {} as any,
      },
      cf: {} as any,
      ctx: {
        waitUntil: vi.fn(),
        passThroughOnException: vi.fn(),
      },
    },
  };
}

export function createMockUser() {
  return {
    id: "test-user-id",
    email: "test@example.com",
    login: "testuser",
    name: "Test User",
    avatarUrl: "https://example.com/avatar.jpg",
    provider: "github" as const,
    providerId: "123456",
    accessToken: "test-access-token",
  };
}

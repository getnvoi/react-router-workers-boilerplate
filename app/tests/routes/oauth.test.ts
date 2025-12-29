import { describe, test, expect } from "vitest";
import { loader as githubLoader } from "~/routes/oauth.github";
import { loader as googleLoader } from "~/routes/oauth.google";
import { loader as auth0Loader } from "~/routes/oauth.auth0";
import { createMockRequest } from "../utils/test-helpers";
import { createMockCloudflareContext } from "../utils/mock-context";

describe("OAuth Routes", () => {
  describe("GET /oauth/github", () => {
    test("returns redirect response", async () => {
      const request = createMockRequest("/oauth/github");
      const context = createMockCloudflareContext();

      const response = await githubLoader({
        request,
        context,
        params: {},
      } as any);

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toContain("github.com");
    });
  });

  describe("GET /oauth/google", () => {
    test("returns redirect response", async () => {
      const request = createMockRequest("/oauth/google");
      const context = createMockCloudflareContext();

      const response = await googleLoader({
        request,
        context,
        params: {},
      } as any);

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toContain("google.com");
    });
  });

  describe("GET /oauth/auth0", () => {
    test("returns redirect response", async () => {
      const request = createMockRequest("/oauth/auth0");
      const context = createMockCloudflareContext();

      const response = await auth0Loader({
        request,
        context,
        params: {},
      } as any);

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toContain("auth0.com");
    });
  });
});

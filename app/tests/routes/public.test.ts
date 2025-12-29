import { describe, test, expect } from "vitest";
import { loader } from "~/routes/home";
import { createMockRequest } from "../utils/test-helpers";
import { createMockCloudflareContext } from "../utils/mock-context";

describe("Public Routes", () => {
  describe("GET /home", () => {
    test("returns 200 status", async () => {
      const request = createMockRequest("/home");
      const context = createMockCloudflareContext();

      const response = await loader({
        request,
        context,
        params: {},
      } as any);

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.providers).toBeDefined();
      expect(Array.isArray(response.providers)).toBe(true);
    });

    test("returns configured providers", async () => {
      const request = createMockRequest("/home");
      const context = createMockCloudflareContext();

      const response = await loader({
        request,
        context,
        params: {},
      } as any);

      expect(response.providers).toContain("github");
    });

    test("returns null user when not authenticated", async () => {
      const request = createMockRequest("/home");
      const context = createMockCloudflareContext();

      const response = await loader({
        request,
        context,
        params: {},
      } as any);

      expect(response.user).toBeNull();
    });
  });
});

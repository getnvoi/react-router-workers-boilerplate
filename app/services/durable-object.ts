/**
 * Durable Object Proxy Utilities
 *
 * Generic utilities for proxying requests to user-scoped Durable Objects.
 * This pattern is reusable across different namespaces (app, system, etc.)
 * for any WebSocket or HTTP request that needs to be handled by a Durable Object.
 */

/**
 * Proxies a request to a user-specific Durable Object instance.
 *
 * Each user gets their own isolated Durable Object instance, identified by their user ID.
 * This ensures:
 * - State isolation between users
 * - Consistent routing to the same instance for a given user
 * - Automatic instance creation on first access
 *
 * @param request - The incoming request (typically a WebSocket upgrade request)
 * @param namespace - The Durable Object namespace (e.g., JOB_RUNNER, CHAT_ROOM)
 * @param userId - The user's unique identifier (used to create a deterministic DO ID)
 *
 * @returns The response from the Durable Object's fetch handler
 *
 * @example
 * ```typescript
 * // In a WebSocket route (e.g., routes/app/jobs.ws.tsx)
 * export async function loader({ request, context }: Route.LoaderArgs) {
 *   const user = await getAuthenticatedUser(request);
 *
 *   if (request.headers.get("Upgrade") !== "websocket") {
 *     return new Response("Expected websocket", { status: 426 });
 *   }
 *
 *   return proxyToDurableObject(
 *     request,
 *     context.cloudflare.env.JOB_RUNNER,
 *     user.id
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In another namespace (e.g., routes/system/monitoring.ws.tsx)
 * return proxyToDurableObject(
 *   request,
 *   context.cloudflare.env.MONITORING_RUNNER,
 *   adminUser.id
 * );
 * ```
 *
 * How it works:
 * 1. `idFromName(userId)` - Creates a deterministic Durable Object ID from the user ID
 *    - Same userId always maps to the same DO instance
 *    - Enables consistent state per user
 *
 * 2. `get(doId)` - Gets or creates the Durable Object instance
 *    - Returns a "stub" (proxy) to communicate with the DO
 *    - If instance doesn't exist, Cloudflare creates it automatically
 *    - If it exists, connects to the running instance
 *
 * 3. `fetch(request)` - Forwards the request to the Durable Object
 *    - The DO's fetch() method handles the actual logic
 *    - For WebSockets: DO returns status 101 (Switching Protocols)
 *    - For HTTP: DO can return any response
 */
export async function proxyToDurableObject(
  request: Request,
  namespace: DurableObjectNamespace,
  userId: string
): Promise<Response> {
  const doId = namespace.idFromName(userId);
  const stub = namespace.get(doId);
  return stub.fetch(request);
}

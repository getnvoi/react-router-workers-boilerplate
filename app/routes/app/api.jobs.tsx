import type { Route } from "./+types/api.jobs";
import { getAuthenticatedUser } from "~/services/auth.server";
import { getDb, jobs } from "~/db";
import { eq } from "drizzle-orm";

export async function action({ request, context }: Route.ActionArgs) {
  const user = await getAuthenticatedUser(request);
  const { type, key, payload } = await request.json();

  const db = getDb(context.cloudflare.env.DB);
  const jobId = crypto.randomUUID();
  const fullKey = `${user.id}:${key}`;

  // INSERT to DB (status = queued)
  await db.insert(jobs).values({
    id: jobId,
    userId: user.id,
    type,
    key: fullKey,
    status: "queued",
    payload: JSON.stringify(payload),
  });

  // Fetch full job from DB
  const [createdJob] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  // Notify WebSocket with COMPLETE job object from DB
  const doId = context.cloudflare.env.JOB_RUNNER.idFromName(user.id);
  const jobRunner = context.cloudflare.env.JOB_RUNNER.get(doId);
  await jobRunner.notify(fullKey, createdJob);

  // Enqueue to worker
  await context.cloudflare.env.JOB_QUEUE.send({
    type,
    payload: { ...payload, key: fullKey, jobId },
  });

  return { success: true, jobId };
}

import { getDb, jobs as jobsTable } from "~/db";
import { eq } from "drizzle-orm";

async function notifyJobUpdate(env: Env, jobId: string) {
  const db = getDb(env.DB);

  // Fetch COMPLETE job from DB
  const [job] = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, jobId))
    .limit(1);

  if (!job) return;

  // Notify with complete job object
  const userId = job.key.split(":")[0];
  const doId = env.JOB_RUNNER.idFromName(userId);
  const jobRunner = env.JOB_RUNNER.get(doId);
  await jobRunner.notify(job.key, job);
}

export const jobs = {
  export: async (payload: any, env: Env) => {
    const db = getDb(env.DB);

    try {
      // STARTED
      await db
        .update(jobsTable)
        .set({ status: "started", startedAt: new Date().toISOString() })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);

      // DO WORK
      await new Promise((r) => setTimeout(r, 3000));
      const result = { file: "export.csv", rows: 1000 };

      // COMPLETED
      await db
        .update(jobsTable)
        .set({
          status: "completed",
          result: JSON.stringify(result),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    } catch (error) {
      // ERROR
      await db
        .update(jobsTable)
        .set({
          status: "error",
          error: String(error),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    }
  },

  email: async (payload: any, env: Env) => {
    const db = getDb(env.DB);

    try {
      await db
        .update(jobsTable)
        .set({ status: "started", startedAt: new Date().toISOString() })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);

      await new Promise((r) => setTimeout(r, 2000));
      const result = { sent: true, to: payload.to };

      await db
        .update(jobsTable)
        .set({
          status: "completed",
          result: JSON.stringify(result),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    } catch (error) {
      await db
        .update(jobsTable)
        .set({
          status: "error",
          error: String(error),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    }
  },

  report: async (payload: any, env: Env) => {
    const db = getDb(env.DB);

    try {
      await db
        .update(jobsTable)
        .set({ status: "started", startedAt: new Date().toISOString() })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);

      await new Promise((r) => setTimeout(r, 4000));
      const result = { report: "sales-report.pdf", pages: 25 };

      await db
        .update(jobsTable)
        .set({
          status: "completed",
          result: JSON.stringify(result),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    } catch (error) {
      await db
        .update(jobsTable)
        .set({
          status: "error",
          error: String(error),
          completedAt: new Date().toISOString(),
        })
        .where(eq(jobsTable.id, payload.jobId));
      await notifyJobUpdate(env, payload.jobId);
    }
  },
} as const;

export type JobType = keyof typeof jobs;

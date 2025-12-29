import { createRequestHandler } from "react-router";
import { jobs } from "~/jobs";

export { JobRunner } from "~/durable-objects/job-runner";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env & {
        DB: D1Database;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
        OAUTH_REDIRECT_URI: string;
        JOB_QUEUE: Queue;
        JOB_RUNNER: DurableObjectNamespace;
      };
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },

  async queue(batch, env) {
    // Process all jobs in parallel
    await Promise.allSettled(
      batch.messages.map(async (msg) => {
        try {
          const { type, payload } = msg.body;
          const handler = jobs[type as keyof typeof jobs];

          if (handler) {
            await handler(payload, env);
            msg.ack();
          } else {
            console.error(`Unknown job: ${type}`);
            msg.ack();
          }
        } catch (error) {
          console.error("Job error:", error);
          msg.retry();
        }
      }),
    );
  },
} satisfies ExportedHandler<Env>;

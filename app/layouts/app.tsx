import type { Route } from "./+types/app";
import { Outlet, Link, Form } from "react-router";
import { requireUser } from "~/services/auth.server";
import { JobsProvider } from "~/contexts/jobs";
import { getDb, jobs as jobsTable } from "~/db";
import { eq, desc } from "drizzle-orm";

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const db = getDb(context.cloudflare.env.DB);

  // Load user's jobs from DB
  const userJobs = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.userId, user.id))
    .orderBy(desc(jobsTable.createdAt))
    .limit(50);

  return { user, initialJobs: userJobs };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user, initialJobs } = loaderData;

  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                nvoi
              </Link>
              <Link to="/app" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.login}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.login}
                </span>
              </div>
              <Form method="post" action="/oauth/logout">
                <button
                  type="submit"
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        </div>
      </nav>
      <JobsProvider initialJobs={initialJobs}>
        <Outlet context={{ user }} />
      </JobsProvider>
    </>
  );
}

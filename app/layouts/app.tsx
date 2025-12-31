import type { Route } from "./+types/app";
import { Outlet, Link, Form } from "react-router";
import { requireUser } from "~/services/auth.server";
import { JobsProvider } from "~/contexts/jobs";
import { getDb, jobs as jobsTable } from "~/db";
import { eq, desc } from "drizzle-orm";
import { Button, Avatar } from "~/components";

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
      <nav >
        <div >
          <div >
            <div >
              <Link to="/" >
                nvoi
              </Link>
              <Link to="/app" >
                Dashboard
              </Link>
            </div>

            <div >
              <div >
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name || user.login}
                  size="md"
                />
                <span >
                  {user.name || user.login}
                </span>
              </div>
              <Form method="post" action="/oauth/logout">
                <Button variant="secondary" size="md" type="submit">
                  Logout
                </Button>
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

import type { SessionUser } from "~/sessions.server";
import { useJobs } from "~/contexts/jobs";
import { Button, Avatar } from "~/components";
import { JobCard } from "./job-card";

interface DashboardViewProps {
  user: SessionUser;
}

export function DashboardView({ user }: DashboardViewProps) {
  const {
    jobs: exportJobs,
    enqueueJob: queueExport,
    isConnected,
  } = useJobs("export");
  const { jobs: emailJobs, enqueueJob: queueEmail } = useJobs("email");
  const { jobs: reportJobs, enqueueJob: queueReport } = useJobs("report");

  return (
    <main >
      <div >
        <div >
          <div >
            <Avatar
              src={user.avatarUrl}
              alt={user.name || user.login}
              size="xl"
            />
            <div>
              <h1 >Background Jobs Demo</h1>
              <p >
                WebSocket: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </p>
            </div>
          </div>

          <div >
            {/* Export Jobs */}
            <div >
              <Button
                variant="primary"
                size="md"
                onClick={() => queueExport({ format: "csv" })}
                
              >
                Export Data
              </Button>
              <div >
                {exportJobs.map((job) => (
                  <JobCard key={job.id} job={job} type="export" />
                ))}
              </div>
            </div>

            {/* Email Jobs */}
            <div >
              <Button
                variant="primary"
                size="md"
                onClick={() => queueEmail({ to: "user@example.com" })}
                
                style={{ background: "var(--color-green-600)" }}
              >
                Send Email
              </Button>
              <div >
                {emailJobs.map((job) => (
                  <JobCard key={job.id} job={job} type="email" />
                ))}
              </div>
            </div>

            {/* Report Jobs */}
            <div >
              <Button
                variant="primary"
                size="md"
                onClick={() => queueReport({ period: "monthly" })}
                
                style={{ background: "var(--color-purple-600)" }}
              >
                Generate Report
              </Button>
              <div >
                {reportJobs.map((job) => (
                  <JobCard key={job.id} job={job} type="report" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

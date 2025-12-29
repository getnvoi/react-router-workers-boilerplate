import type { SessionUser } from "~/sessions.server";
import { useJobs } from "~/contexts/jobs";
import { Button, Avatar } from "~/components";
import { JobCard } from "./job-card";
import styles from "./dashboard-view.module.css";

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
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Avatar
              src={user.avatarUrl}
              alt={user.name || user.login}
              size="xl"
            />
            <div>
              <h1 className={styles.title}>Background Jobs Demo</h1>
              <p className={styles.subtitle}>
                WebSocket: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </p>
            </div>
          </div>

          <div className={styles.sections}>
            {/* Export Jobs */}
            <div className={styles.section}>
              <Button
                variant="primary"
                size="md"
                onClick={() => queueExport({ format: "csv" })}
                className={styles.actionButton}
              >
                Export Data
              </Button>
              <div className={styles.jobList}>
                {exportJobs.map((job) => (
                  <JobCard key={job.id} job={job} type="export" />
                ))}
              </div>
            </div>

            {/* Email Jobs */}
            <div className={styles.section}>
              <Button
                variant="primary"
                size="md"
                onClick={() => queueEmail({ to: "user@example.com" })}
                className={styles.actionButton}
                style={{ background: "var(--color-green-600)" }}
              >
                Send Email
              </Button>
              <div className={styles.jobList}>
                {emailJobs.map((job) => (
                  <JobCard key={job.id} job={job} type="email" />
                ))}
              </div>
            </div>

            {/* Report Jobs */}
            <div className={styles.section}>
              <Button
                variant="primary"
                size="md"
                onClick={() => queueReport({ period: "monthly" })}
                className={styles.actionButton}
                style={{ background: "var(--color-purple-600)" }}
              >
                Generate Report
              </Button>
              <div className={styles.jobList}>
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

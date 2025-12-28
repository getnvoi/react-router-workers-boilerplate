import { useOutletContext } from "react-router";
import type { SessionUser } from "~/sessions.server";
import { useJobs } from "~/contexts/jobs";

export default function AppDashboard() {
  const { user } = useOutletContext<{ user: SessionUser }>();

  // Each section gets filtered jobs + bound enqueueJob
  const { jobs: exportJobs, enqueueJob: queueExport, isConnected } = useJobs("export");
  const { jobs: emailJobs, enqueueJob: queueEmail } = useJobs("email");
  const { jobs: reportJobs, enqueueJob: queueReport } = useJobs("report");

  console.log("Export jobs:", JSON.stringify(exportJobs, null, 2));
  console.log("Email jobs:", JSON.stringify(emailJobs, null, 2));
  console.log("Report jobs:", JSON.stringify(reportJobs, null, 2));

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name || user.login}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Background Jobs Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                WebSocket: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Export Jobs */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => queueExport({ format: "csv" })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
              >
                Export Data
              </button>
              <div className="space-y-2">
                {exportJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    {job.status === "queued" && "⏳ Queued..."}
                    {job.status === "started" && "⚙️ Exporting..."}
                    {job.status === "completed" &&
                      `✅ Done: ${JSON.parse(job.result || "{}").file || "export.csv"}`}
                    {job.status === "error" && `❌ Error: ${job.error}`}
                    <span className="ml-2 text-xs text-gray-500">
                      ({new Date(job.createdAt).toLocaleTimeString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Jobs */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => queueEmail({ to: "user@example.com" })}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
              >
                Send Email
              </button>
              <div className="space-y-2">
                {emailJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    {job.status === "queued" && "⏳ Queued..."}
                    {job.status === "started" && "⚙️ Sending..."}
                    {job.status === "completed" && "✅ Sent"}
                    {job.status === "error" && `❌ Failed: ${job.error}`}
                    <span className="ml-2 text-xs text-gray-500">
                      ({new Date(job.createdAt).toLocaleTimeString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Jobs */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => queueReport({ period: "monthly" })}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-4"
              >
                Generate Report
              </button>
              <div className="space-y-2">
                {reportJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    {job.status === "queued" && "⏳ Queued..."}
                    {job.status === "started" && "⚙️ Generating..."}
                    {job.status === "completed" &&
                      `✅ Ready: ${JSON.parse(job.result || "{}").report || "report.pdf"}`}
                    {job.status === "error" && `❌ Failed: ${job.error}`}
                    <span className="ml-2 text-xs text-gray-500">
                      ({new Date(job.createdAt).toLocaleTimeString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

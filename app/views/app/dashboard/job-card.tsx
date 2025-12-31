
interface Job {
  id: string;
  status: "queued" | "started" | "completed" | "error";
  createdAt: string;
  result?: string | null;
  error?: string | null;
}

interface JobCardProps {
  job: Job;
  type: "export" | "email" | "report";
}

const statusMessages = {
  export: {
    queued: "⏳ Queued...",
    started: "⚙️ Exporting...",
    completed: (result: string | null) =>
      `✅ Done: ${JSON.parse(result || "{}").file || "export.csv"}`,
    error: (error: string | null) => `❌ Error: ${error}`,
  },
  email: {
    queued: "⏳ Queued...",
    started: "⚙️ Sending...",
    completed: () => "✅ Sent",
    error: (error: string | null) => `❌ Failed: ${error}`,
  },
  report: {
    queued: "⏳ Queued...",
    started: "⚙️ Generating...",
    completed: (result: string | null) =>
      `✅ Ready: ${JSON.parse(result || "{}").report || "report.pdf"}`,
    error: (error: string | null) => `❌ Failed: ${error}`,
  },
};

export function JobCard({ job, type }: JobCardProps) {
  const messages = statusMessages[type];

  let statusContent: string;
  if (job.status === "completed") {
    statusContent = messages.completed(job.result || null);
  } else if (job.status === "error") {
    statusContent = messages.error(job.error || null);
  } else {
    statusContent = messages[job.status] as string;
  }

  return (
    <div  data-status={job.status}>
      <span >{statusContent}</span>
      <span >
        ({new Date(job.createdAt).toLocaleTimeString()})
      </span>
    </div>
  );
}

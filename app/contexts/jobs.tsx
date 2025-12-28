import { createContext, useContext, useEffect, useRef, useState } from "react";

type Job = {
  id: string;
  userId: string;
  type: string;
  key: string;
  status: "queued" | "started" | "completed" | "error";
  payload?: string;
  result?: string;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

type Callback = (key: string, data: any) => void;

type JobsContextType = {
  jobs: Job[];
  enqueueJob: (type: string, key: string, payload: any) => Promise<void>;
  subscribe: (key: string, callback: Callback) => () => void;
  isConnected: boolean;
};

const JobsContext = createContext<JobsContextType | null>(null);

export function JobsProvider({
  children,
  initialJobs = [],
}: {
  children: React.ReactNode;
  initialJobs?: Job[];
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Map<string, Set<Callback>>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(
        `${protocol}//${window.location.host}/app/jobs/ws`,
      );

      ws.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected, reconnecting in 3s...");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => console.error("WebSocket error:", error);

      ws.onmessage = (e) => {
        try {
          const message = JSON.parse(e.data);
          const job = message.data || message; // Unwrap if wrapped

          // Update global jobs list - REPLACE job data
          setJobs((prev) => {
            const index = prev.findIndex((j) => j.id === job.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = job; // Replace with complete job
              return updated;
            }
            return [job, ...prev];
          });

          // Notify key-specific listeners
          const key = message.key || job.key;
          listenersRef.current.get(key)?.forEach((cb) => cb(key, job));
          listenersRef.current.get("*")?.forEach((cb) => cb(key, job));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, []);

  const subscribe = (key: string, callback: Callback) => {
    if (!listenersRef.current.has(key)) {
      listenersRef.current.set(key, new Set());
    }
    listenersRef.current.get(key)!.add(callback);

    return () => {
      const listeners = listenersRef.current.get(key);
      listeners?.delete(callback);
      if (listeners?.size === 0) listenersRef.current.delete(key);
    };
  };

  const enqueueJob = async (type: string, key: string, payload: any) => {
    const response = await fetch("/app/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, key, payload }),
    });

    if (!response.ok) {
      throw new Error(`Failed to enqueue job: ${response.statusText}`);
    }
  };

  return (
    <JobsContext.Provider value={{ jobs, enqueueJob, subscribe, isConnected }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs(filterKey?: string) {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be within JobsProvider");

  const filteredJobs = filterKey
    ? context.jobs.filter((job) => job.key.includes(filterKey))
    : context.jobs;

  // Bind key and type to enqueueJob (key = type!)
  const boundEnqueueJob = filterKey
    ? (payload: any) => context.enqueueJob(filterKey, filterKey, payload)
    : context.enqueueJob;

  return {
    jobs: filteredJobs,
    enqueueJob: boundEnqueueJob,
    isConnected: context.isConnected,
  };
}

export function useSocket<T = any>(key: string) {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useSocket must be within JobsProvider");

  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    return context.subscribe(key, (_, data) => setData(data));
  }, [key, context]);

  return data;
}

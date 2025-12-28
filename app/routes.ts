import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  // Public routes
  layout("layouts/public.tsx", [index("routes/home.tsx")]),

  // Protected app routes (all nested under /app)
  layout("layouts/app.tsx", [
    route("app", "routes/app/index.tsx"),
    route("app/api/jobs", "routes/app/api.jobs.tsx"),
    route("app/jobs/ws", "routes/app/jobs.ws.tsx"),
    // Add more protected routes here as needed
    // route("app/settings", "routes/app/settings.tsx"),
  ]),

  // OAuth routes (no layout)
  route("oauth/github", "routes/oauth.github.tsx"),
  route("oauth/github/callback", "routes/oauth.github.callback.tsx"),
  route("oauth/logout", "routes/oauth.logout.tsx"),
] satisfies RouteConfig;

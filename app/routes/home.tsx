import type { Route } from "./+types/home";
import { Link } from "react-router";
import { getUserFromSession } from "~/services/auth.server";
import { getConfiguredProviders } from "~/services/oauth/handler";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "nvoi - Multi-Provider OAuth" },
    { name: "description", content: "Welcome to nvoi!" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  const providers = getConfiguredProviders(context.cloudflare.env);
  return { user, providers };
}

const providerConfig = {
  github: {
    name: "GitHub",
    bgColor: "bg-gray-900 hover:bg-gray-800",
    icon: "🐙",
  },
  google: {
    name: "Google",
    bgColor: "bg-blue-600 hover:bg-blue-700",
    icon: "🔍",
  },
  auth0: {
    name: "Auth0",
    bgColor: "bg-orange-600 hover:bg-orange-700",
    icon: "🔐",
  },
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, providers } = loaderData;

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to nvoi
          </h1>
          <p className="text-gray-600 mb-8">
            {user
              ? `You're logged in as ${user.login || user.name}`
              : "Please login to continue"}
          </p>

          {user ? (
            <Link
              to="/app"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to App
            </Link>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => {
                const config = providerConfig[provider as keyof typeof providerConfig];
                return (
                  <Link
                    key={provider}
                    to={`/oauth/${provider}`}
                    className={`flex items-center justify-center gap-3 px-6 py-3 ${config.bgColor} text-white font-medium rounded-lg transition-colors w-full`}
                  >
                    <span className="text-xl">{config.icon}</span>
                    <span>Login with {config.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

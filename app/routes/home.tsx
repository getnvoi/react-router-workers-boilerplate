import type { Route } from "./+types/home";
import { Link } from "react-router";
import { getUserFromSession } from "~/services/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "nvoi - GitHub OAuth" },
    { name: "description", content: "Welcome to nvoi!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  return { user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to nvoi
          </h1>
          <p className="text-gray-600 mb-8">
            {user
              ? `You're logged in as ${user.login}`
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
            <Link
              to="/oauth/github"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login with GitHub
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

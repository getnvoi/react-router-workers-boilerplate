import { Link } from "react-router";
import { Github, Globe, Lock } from "lucide-react";
import { Button } from "~/components";
import type { SessionUser } from "~/sessions.server";

interface HomeViewProps {
  user: SessionUser | null;
  providers: string[];
}

const providerConfig = {
  github: {
    name: "GitHub",
    icon: <Github />,
  },
  google: {
    name: "Google",
    icon: <Globe />,
  },
  auth0: {
    name: "Auth0",
    icon: <Lock />,
  },
};

export function HomeView({ user, providers }: HomeViewProps) {
  return (
    <main>
      <div>
        <div>
          <h1>Welcome to nvoi</h1>
          <p>
            {user
              ? `You're logged in as ${user.login || user.name}`
              : "Please login to continue"}
          </p>

          {user ? (
            <Button size="lg" asChild>
              <Link to="/app">Go to App</Link>
            </Button>
          ) : (
            <div>
              {providers.map((provider) => {
                const config =
                  providerConfig[provider as keyof typeof providerConfig];
                return (
                  <Button key={provider} size="lg" asChild>
                    <Link to={`/oauth/${provider}`}>
                      {config.icon}
                      <span>Login with {config.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

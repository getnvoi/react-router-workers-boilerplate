import { LinkButton } from "~/components";
import type { SessionUser } from "~/sessions.server";
import styles from "./home-view.module.css";

interface HomeViewProps {
  user: SessionUser | null;
  providers: string[];
}

const providerConfig = {
  github: {
    name: "GitHub",
    icon: "🐙",
  },
  google: {
    name: "Google",
    icon: "🔍",
  },
  auth0: {
    name: "Auth0",
    icon: "🔐",
  },
};

export function HomeView({ user, providers }: HomeViewProps) {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textCenter}>
          <h1 className={styles.title}>Welcome to nvoi</h1>
          <p className={styles.description}>
            {user
              ? `You're logged in as ${user.login || user.name}`
              : "Please login to continue"}
          </p>

          {user ? (
            <LinkButton variant="primary" size="lg" href="/app">
              Go to App
            </LinkButton>
          ) : (
            <div className={styles.buttonGroup}>
              {providers.map((provider) => {
                const config =
                  providerConfig[provider as keyof typeof providerConfig];
                return (
                  <LinkButton
                    key={provider}
                    variant="primary"
                    size="lg"
                    href={`/oauth/${provider}`}
                    className={styles.providerButton}
                  >
                    <span className={styles.icon}>{config.icon}</span>
                    <span>Login with {config.name}</span>
                  </LinkButton>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

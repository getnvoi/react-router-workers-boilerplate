import { Form } from "react-router";
import { Button, LinkButton, Input, Field } from "~/components";
import { Check, ExternalLink, Info } from "lucide-react";
import type { SessionUser } from "~/sessions.server";
import styles from "./anthropic-view.module.css";

interface AnthropicViewProps {
  authUrl: string;
  isConnected: boolean;
  user: SessionUser;
}

export function AnthropicView({
  authUrl,
  isConnected,
  user,
}: AnthropicViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Claude Settings</h1>
          <p className={styles.subtitle}>
            Connect your Claude account to enable AI-powered features
          </p>
        </div>

        <div className={styles.card}>
          {isConnected ? (
            <div className={styles.connected}>
              <div className={styles.statusHeader}>
                <div className={styles.iconWrapper}>
                  <Check className={styles.checkIcon} />
                </div>
                <div>
                  <h3 className={styles.statusTitle}>Claude Connected</h3>
                  <p className={styles.statusText}>
                    Your Claude account is connected and ready to use
                  </p>
                </div>
              </div>

              <div className={styles.divider}>
                <h4 className={styles.sectionTitle}>Account Info</h4>
                <dl className={styles.accountInfo}>
                  <div className={styles.infoRow}>
                    <dt className={styles.infoLabel}>User:</dt>
                    <dd className={styles.infoValue}>
                      {user.name || user.login}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={styles.divider}>
                <Button variant="secondary" size="md">
                  Disconnect Claude
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.disconnected}>
              <div className={styles.step}>
                <h3 className={styles.stepTitle}>
                  Step 1: Authorize with Claude
                </h3>
                <p className={styles.stepText}>
                  Click the button below to open the Claude authorization page:
                </p>
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <Button variant="primary" size="md">
                    Open Claude Authorization
                    <ExternalLink className={styles.linkIcon} />
                  </Button>
                </a>
              </div>

              <div className={styles.step}>
                <h3 className={styles.stepTitle}>
                  Step 2: Enter Authorization Code
                </h3>
                <p className={styles.stepText}>
                  After authorizing, copy the code shown by Claude and paste it
                  below:
                </p>

                <Form method="post" className={styles.form}>
                  <input
                    type="hidden"
                    name="state"
                    value={new URL(authUrl).searchParams.get("state") || ""}
                  />

                  <Field.Root name="code">
                    <Field.Label>Authorization Code</Field.Label>
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      required
                      placeholder="Paste code here (e.g., abc123#xyz789)"
                    />
                    <Field.Description>
                      The code may include a # symbol - paste the entire string
                    </Field.Description>
                  </Field.Root>

                  <Button variant="primary" size="md" type="submit">
                    Connect Claude Account
                  </Button>
                </Form>
              </div>
            </div>
          )}
        </div>

        <div className={styles.helpCard}>
          <div className={styles.helpContent}>
            <div className={styles.helpIcon}>
              <Info />
            </div>
            <div>
              <h3 className={styles.helpTitle}>About Claude OAuth</h3>
              <p className={styles.helpText}>
                This connection uses OAuth with PKCE (Proof Key for Code
                Exchange) for secure authentication. The authorization code must
                be manually entered because Anthropic redirects to their console,
                not directly back to this application.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <LinkButton href="/app" variant="ghost" size="sm">
            ← Back to app
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

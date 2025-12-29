import { Button } from "~/components";
import type { SessionUser } from "~/sessions.server";
import styles from "./accept-invite-view.module.css";

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

interface AcceptInviteViewProps {
  invite: Invite;
  user: SessionUser | null;
  error?: string;
}

export function AcceptInviteView({ invite, user, error }: AcceptInviteViewProps) {
  // User not logged in
  if (!user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>You've been invited!</h1>
        <p className={styles.description}>
          You need to create an account or login to accept this invitation.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => window.location.href = `/auth/register?email=${encodeURIComponent(invite.email)}`}
          >
            Sign Up
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = "/auth/login"}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Invite already processed
  if (invite.status !== "pending") {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Invite {invite.status}</h1>
        <p className={styles.description}>
          This invitation has already been {invite.status}.
        </p>
        <Button onClick={() => window.location.href = "/app"} className={styles.button}>
          Go to App
        </Button>
      </div>
    );
  }

  // Invite expired
  if (new Date(invite.expiresAt) < new Date()) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Invite Expired</h1>
        <p className={styles.description}>This invitation has expired.</p>
      </div>
    );
  }

  // Valid invite - show accept/decline
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workspace Invitation</h1>
      <p className={styles.description}>
        You've been invited to join a workspace as a <strong>{invite.role}</strong>.
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form method="post" className={styles.form}>
        <div className={styles.actions}>
          <Button type="submit" name="action" value="accept" variant="primary">
            Accept Invitation
          </Button>
          <Button type="submit" name="action" value="decline" variant="secondary">
            Decline
          </Button>
        </div>
      </form>
    </div>
  );
}

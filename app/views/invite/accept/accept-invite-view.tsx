import { Button } from "~/components";
import type { SessionUser } from "~/sessions.server";

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
  userEmail?: string;
  error?: string;
}

export function AcceptInviteView({ invite, user, userEmail, error }: AcceptInviteViewProps) {
  // Email mismatch - block screen
  if (user && userEmail && invite.email.toLowerCase() !== userEmail.toLowerCase()) {
    return (
      <div >
        <h1 >Wrong Account</h1>
        <p >
          This invitation was sent to <strong>{invite.email}</strong>, but you're
          logged in as <strong>{userEmail}</strong>.
        </p>
        <p  style={{ marginTop: "1rem" }}>
          Please login with the correct account or ask for a new invitation.
        </p>
        <Button onClick={() => window.location.href = "/oauth/logout"} >
          Logout and try again
        </Button>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <div >
        <h1 >You've been invited!</h1>
        <p >
          You need to create an account or login to accept this invitation.
        </p>
        <div >
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
      <div >
        <h1 >Invite {invite.status}</h1>
        <p >
          This invitation has already been {invite.status}.
        </p>
        <Button onClick={() => window.location.href = "/app"} >
          Go to App
        </Button>
      </div>
    );
  }

  // Invite expired
  if (new Date(invite.expiresAt) < new Date()) {
    return (
      <div >
        <h1 >Invite Expired</h1>
        <p >This invitation has expired.</p>
      </div>
    );
  }

  // Valid invite - show accept/decline
  return (
    <div >
      <h1 >Workspace Invitation</h1>
      <p >
        You've been invited to join a workspace as a <strong>{invite.role}</strong>.
      </p>

      {error && <div >{error}</div>}

      <form method="post" >
        <div >
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

import { data } from "react-router";
import type { Route } from "./+types/app.workspace.invites";
import { getDb } from "~/db";
import { requireUser } from "~/services/auth.server";
import { createWorkspaceInvite, getWorkspaceInvites } from "~/services/workspace-invite.server";
import { getUserWorkspaces } from "~/services/workspace.server";
import { sendInviteEmail } from "~/services/email.server";
import { Field, Button, RadioGroup, Radio } from "~/components";

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = await requireUser(request);
  const db = getDb(context.cloudflare.env.DB);

  // Get user's first workspace (for simplicity)
  const workspaces = await getUserWorkspaces(db, user.id);
  if (workspaces.length === 0) {
    throw new Response("No workspace found", { status: 404 });
  }

  const workspace = workspaces[0];
  const invites = await getWorkspaceInvites(db, workspace.id);

  return { workspace, invites, user };
}

export async function action({ request, context }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const role = formData.get("role")?.toString() as "member" | "admin";

  if (!email || !role) {
    return data({ error: "Email and role are required" }, { status: 400 });
  }

  const db = getDb(context.cloudflare.env.DB);

  // Get user's workspace
  const workspaces = await getUserWorkspaces(db, user.id);
  if (workspaces.length === 0) {
    return data({ error: "No workspace found" }, { status: 404 });
  }

  try {
    const workspace = workspaces[0];
    const token = await createWorkspaceInvite(
      db,
      workspace.id,
      email,
      user.id,
      role
    );

    // Send invite email
    const postmarkApiKey = context.cloudflare.env.POSTMARK_API_KEY;
    if (postmarkApiKey) {
      const baseUrl = new URL(request.url).origin;
      await sendInviteEmail(
        postmarkApiKey,
        email,
        user.name || user.login || "Someone",
        workspace.label,
        token,
        baseUrl
      );
    }

    return data({ success: true, message: "Invitation sent!" });
  } catch (error) {
    return data(
      { error: error instanceof Error ? error.message : "Failed to send invite" },
      { status: 400 }
    );
  }
}

export default function WorkspaceInvites({ loaderData, actionData }: Route.ComponentProps) {
  const { workspace, invites } = loaderData;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
      <h1>Invite to {workspace.label}</h1>

      <form method="post" style={{ marginTop: "2rem" }}>
        <Field.Root name="email">
          <Field.Label>Email Address</Field.Label>
          <Field.Control type="email" required placeholder="colleague@example.com" />
        </Field.Root>

        <Field.Root name="role">
          <Field.Label>Role</Field.Label>
          <RadioGroup name="role" defaultValue="member">
            <label>
              <Radio value="member" />
              Member - Can view and edit
            </label>
            <label>
              <Radio value="admin" />
              Admin - Full access
            </label>
          </RadioGroup>
        </Field.Root>

        {actionData?.error && (
          <div style={{ color: "var(--color-red-600)", marginTop: "1rem" }}>
            {actionData.error}
          </div>
        )}

        {actionData?.success && (
          <div style={{ color: "var(--color-green-600)", marginTop: "1rem" }}>
            {actionData.message}
          </div>
        )}

        <Button type="submit" style={{ marginTop: "1.5rem" }}>
          Send Invitation
        </Button>
      </form>

      <div style={{ marginTop: "3rem" }}>
        <h2>Pending Invitations</h2>
        {invites.filter(i => i.status === "pending").length === 0 ? (
          <p style={{ color: "var(--color-gray-600)", marginTop: "1rem" }}>
            No pending invitations
          </p>
        ) : (
          <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
            {invites
              .filter(i => i.status === "pending")
              .map(invite => (
                <li key={invite.id} style={{ padding: "1rem", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-md)", marginBottom: "0.5rem" }}>
                  <div>{invite.email} - {invite.role}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-gray-600)" }}>
                    Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

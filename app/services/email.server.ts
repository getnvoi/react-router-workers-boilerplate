import { ServerClient } from "postmark";

/**
 * Send workspace invite email via Postmark
 */
export async function sendInviteEmail(
  apiKey: string,
  inviteEmail: string,
  inviterName: string,
  workspaceLabel: string,
  inviteToken: string,
  baseUrl: string
): Promise<void> {
  const client = new ServerClient(apiKey);

  const inviteUrl = `${baseUrl}/invite/${inviteToken}`;

  await client.sendEmail({
    From: "invites@nvoi.app", // Configure in Postmark
    To: inviteEmail,
    Subject: `${inviterName} invited you to ${workspaceLabel}`,
    HtmlBody: `
      <h2>You've been invited to join ${workspaceLabel}</h2>
      <p>${inviterName} has invited you to collaborate in their workspace.</p>
      <p><a href="${inviteUrl}">Accept Invitation</a></p>
      <p>This invitation expires in 7 days.</p>
      <p>If you don't have an account yet, you'll be able to create one when you accept.</p>
    `,
    TextBody: `
      You've been invited to join ${workspaceLabel}

      ${inviterName} has invited you to collaborate in their workspace.

      Accept invitation: ${inviteUrl}

      This invitation expires in 7 days.
    `,
    MessageStream: "outbound",
  });
}

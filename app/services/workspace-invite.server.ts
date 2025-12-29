import { eq, and } from "drizzle-orm";
import { type getDb, workspaceInvites, users, workspaceUsers } from "~/db";

const INVITE_EXPIRY_DAYS = 7;

/**
 * Create a workspace invite
 */
export async function createWorkspaceInvite(
  db: ReturnType<typeof getDb>,
  workspaceId: string,
  email: string,
  invitedByUserId: string,
  role: "member" | "admin" = "member"
): Promise<string> {
  // Check if user with email exists
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const userId = existingUser.length > 0 ? existingUser[0].id : null;

  // Check for existing pending invite
  const existingInvite = await db
    .select()
    .from(workspaceInvites)
    .where(
      and(
        eq(workspaceInvites.workspaceId, workspaceId),
        eq(workspaceInvites.email, email),
        eq(workspaceInvites.status, "pending")
      )
    )
    .limit(1);

  if (existingInvite.length > 0) {
    throw new Error("Invite already pending for this email");
  }

  // Create invite
  const inviteId = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

  await db.insert(workspaceInvites).values({
    id: inviteId,
    workspaceId,
    email,
    userId,
    invitedByUserId,
    token,
    role,
    status: "pending",
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return token;
}

/**
 * Get invite by token
 */
export async function getInviteByToken(
  db: ReturnType<typeof getDb>,
  token: string
) {
  const invites = await db
    .select()
    .from(workspaceInvites)
    .where(eq(workspaceInvites.token, token))
    .limit(1);

  return invites[0] || null;
}

/**
 * Accept a workspace invite
 */
export async function acceptInvite(
  db: ReturnType<typeof getDb>,
  token: string,
  userId: string
): Promise<void> {
  const invite = await getInviteByToken(db, token);

  if (!invite) {
    throw new Error("Invite not found");
  }

  if (invite.status !== "pending") {
    throw new Error("Invite is no longer pending");
  }

  // Check if expired
  if (new Date(invite.expiresAt) < new Date()) {
    // Mark as expired
    await db
      .update(workspaceInvites)
      .set({ status: "expired", updatedAt: new Date().toISOString() })
      .where(eq(workspaceInvites.id, invite.id));
    throw new Error("Invite has expired");
  }

  // Add user to workspace
  await db.insert(workspaceUsers).values({
    id: crypto.randomUUID(),
    workspaceId: invite.workspaceId,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Mark invite as accepted
  await db
    .update(workspaceInvites)
    .set({
      status: "accepted",
      acceptedAt: new Date().toISOString(),
      userId, // Link to user who accepted
      updatedAt: new Date().toISOString(),
    })
    .where(eq(workspaceInvites.id, invite.id));
}

/**
 * Decline a workspace invite
 */
export async function declineInvite(
  db: ReturnType<typeof getDb>,
  token: string
): Promise<void> {
  const invite = await getInviteByToken(db, token);

  if (!invite) {
    throw new Error("Invite not found");
  }

  if (invite.status !== "pending") {
    throw new Error("Invite is no longer pending");
  }

  await db
    .update(workspaceInvites)
    .set({ status: "declined", updatedAt: new Date().toISOString() })
    .where(eq(workspaceInvites.id, invite.id));
}

/**
 * Get all pending invites for a workspace
 */
export async function getWorkspaceInvites(
  db: ReturnType<typeof getDb>,
  workspaceId: string
) {
  return db
    .select()
    .from(workspaceInvites)
    .where(eq(workspaceInvites.workspaceId, workspaceId));
}

/**
 * Cancel/delete an invite
 */
export async function cancelInvite(
  db: ReturnType<typeof getDb>,
  inviteId: string
): Promise<void> {
  await db.delete(workspaceInvites).where(eq(workspaceInvites.id, inviteId));
}

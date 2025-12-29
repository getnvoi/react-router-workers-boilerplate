import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import { eq } from "drizzle-orm";
import * as schema from "~/db/schema";
import {
  createWorkspaceInvite,
  getInviteByToken,
  acceptInvite,
  declineInvite,
  getWorkspaceInvites,
  cancelInvite,
} from "~/services/workspace-invite.server";
import {
  getTestDb,
  initTestDb,
  truncateTestDb,
  disposeMiniflare,
} from "../helpers/miniflare";

describe("Workspace Invite Service", () => {
  let db: Awaited<ReturnType<typeof getTestDb>>["db"];
  let d1: D1Database;
  let workspaceId: string;
  let inviterId: string;
  let inviteeId: string;

  beforeEach(async () => {
    const testDb = await getTestDb();
    db = testDb.db;
    d1 = testDb.d1;
    await initTestDb(d1);

    // Create inviter user
    inviterId = crypto.randomUUID();
    await db.insert(schema.users).values({
      id: inviterId,
      email: "inviter@example.com",
      accessToken: "token",
      provider: "github",
      remoteId: "123",
      name: "Inviter",
      createdAt: new Date().toISOString(),
    });

    // Create workspace
    workspaceId = crypto.randomUUID();
    await db.insert(schema.workspaces).values({
      id: workspaceId,
      label: "Test Workspace",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add inviter to workspace
    await db.insert(schema.workspaceUsers).values({
      id: crypto.randomUUID(),
      workspaceId,
      userId: inviterId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create potential invitee user
    inviteeId = crypto.randomUUID();
    await db.insert(schema.users).values({
      id: inviteeId,
      email: "invitee@example.com",
      accessToken: "token2",
      provider: "google",
      remoteId: "456",
      name: "Invitee",
      createdAt: new Date().toISOString(),
    });
  });

  afterEach(async () => {
    await truncateTestDb(d1);
  });

  afterAll(async () => {
    await disposeMiniflare();
  });

  describe("createWorkspaceInvite", () => {
    it("should create invite with null userId (not prepopulated)", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "newuser@example.com",
        inviterId,
        "member"
      );

      expect(token).toBeDefined();

      // Verify invite in database
      const invite = await getInviteByToken(db, token);
      expect(invite).toBeDefined();
      expect(invite!.email).toBe("newuser@example.com");
      expect(invite!.userId).toBeNull(); // userId is null at creation
      expect(invite!.role).toBe("member");
      expect(invite!.status).toBe("pending");
    });

    it("should reject duplicate pending invite for same email", async () => {
      await createWorkspaceInvite(
        db,
        workspaceId,
        "test@example.com",
        inviterId
      );

      await expect(
        createWorkspaceInvite(db, workspaceId, "test@example.com", inviterId)
      ).rejects.toThrow("Invite already pending");
    });

    it("should set expiry to 7 days from now", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "test@example.com",
        inviterId
      );

      const invite = await getInviteByToken(db, token);
      const expiresAt = new Date(invite!.expiresAt);
      const now = new Date();
      const diffDays = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      expect(diffDays).toBeGreaterThan(6.9);
      expect(diffDays).toBeLessThan(7.1);
    });
  });

  describe("acceptInvite", () => {
    it("should accept invite when email matches", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "invitee@example.com",
        inviterId
      );

      await acceptInvite(db, token, inviteeId, "invitee@example.com");

      // Verify invite marked as accepted
      const invite = await getInviteByToken(db, token);
      expect(invite!.status).toBe("accepted");
      expect(invite!.acceptedAt).toBeDefined();
      expect(invite!.userId).toBe(inviteeId);

      // Verify user added to workspace
      const workspaceUsers = await db
        .select()
        .from(schema.workspaceUsers)
        .where(eq(schema.workspaceUsers.userId, inviteeId));

      expect(workspaceUsers).toHaveLength(1);
      expect(workspaceUsers[0].workspaceId).toBe(workspaceId);
    });

    it("should reject if email doesn't match (block scenario)", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "invited@example.com",
        inviterId
      );

      // Try to accept with wrong email
      await expect(
        acceptInvite(db, token, inviteeId, "wrongemail@example.com")
      ).rejects.toThrow("different email address");

      // Verify invite still pending
      const invite = await getInviteByToken(db, token);
      expect(invite!.status).toBe("pending");
    });

    it("should reject expired invite", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "invitee@example.com",
        inviterId
      );

      // Manually expire the invite
      const invite = await getInviteByToken(db, token);
      await db
        .update(schema.workspaceInvites)
        .set({ expiresAt: new Date(Date.now() - 1000).toISOString() })
        .where(eq(schema.workspaceInvites.id, invite!.id));

      await expect(
        acceptInvite(db, token, inviteeId, "invitee@example.com")
      ).rejects.toThrow("expired");

      // Verify marked as expired
      const updatedInvite = await getInviteByToken(db, token);
      expect(updatedInvite!.status).toBe("expired");
    });

    it("should reject if already accepted", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "invitee@example.com",
        inviterId
      );

      await acceptInvite(db, token, inviteeId, "invitee@example.com");

      // Try to accept again
      await expect(
        acceptInvite(db, token, inviteeId, "invitee@example.com")
      ).rejects.toThrow("no longer pending");
    });

    it("should work for OAuth users", async () => {
      // OAuth user (no password_hash)
      const oauthUserId = crypto.randomUUID();
      await db.insert(schema.users).values({
        id: oauthUserId,
        email: "oauth@example.com",
        provider: "github",
        remoteId: "789",
        accessToken: "oauth-token",
        createdAt: new Date().toISOString(),
      });

      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "oauth@example.com",
        inviterId
      );

      await acceptInvite(db, token, oauthUserId, "oauth@example.com");

      const invite = await getInviteByToken(db, token);
      expect(invite!.status).toBe("accepted");
      expect(invite!.userId).toBe(oauthUserId);
    });
  });

  describe("declineInvite", () => {
    it("should mark invite as declined", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "test@example.com",
        inviterId
      );

      await declineInvite(db, token);

      const invite = await getInviteByToken(db, token);
      expect(invite!.status).toBe("declined");
    });

    it("should not add user to workspace", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "invitee@example.com",
        inviterId
      );

      await declineInvite(db, token);

      const workspaceUsers = await db
        .select()
        .from(schema.workspaceUsers)
        .where(eq(schema.workspaceUsers.userId, inviteeId));

      expect(workspaceUsers).toHaveLength(0);
    });
  });

  describe("getWorkspaceInvites", () => {
    it("should return all invites for workspace", async () => {
      await createWorkspaceInvite(db, workspaceId, "user1@example.com", inviterId);
      await createWorkspaceInvite(db, workspaceId, "user2@example.com", inviterId);

      const invites = await getWorkspaceInvites(db, workspaceId);
      expect(invites).toHaveLength(2);
    });
  });

  describe("cancelInvite", () => {
    it("should delete invite", async () => {
      const token = await createWorkspaceInvite(
        db,
        workspaceId,
        "test@example.com",
        inviterId
      );

      const invite = await getInviteByToken(db, token);
      await cancelInvite(db, invite!.id);

      const deletedInvite = await getInviteByToken(db, token);
      expect(deletedInvite).toBeNull();
    });
  });
});

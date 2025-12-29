import { data, redirect } from "react-router";
import { eq } from "drizzle-orm";
import type { Route } from "./+types/invite.$token";
import { getDb } from "~/db";
import * as schema from "~/db/schema";
import { getInviteByToken, acceptInvite, declineInvite } from "~/services/workspace-invite.server";
import { getUserFromSession } from "~/services/auth.server";
import { AcceptInviteView } from "~/views/invite/accept/accept-invite-view";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const { token } = params;
  const db = getDb(context.cloudflare.env.DB);

  const invite = await getInviteByToken(db, token);

  if (!invite) {
    throw new Response("Invite not found", { status: 404 });
  }

  const user = await getUserFromSession(request);

  // Get user's email if logged in
  let userEmail: string | undefined;
  if (user) {
    const dbUser = await db
      .select({ email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))
      .limit(1);
    userEmail = dbUser[0]?.email;
  }

  return { invite, user, userEmail };
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const { token } = params;
  const formData = await request.formData();
  const action = formData.get("action")?.toString();

  const user = await getUserFromSession(request);
  if (!user) {
    return redirect(`/auth/register?invite=${token}`);
  }

  const db = getDb(context.cloudflare.env.DB);

  try {
    if (action === "accept") {
      // Get user's email from database
      const dbUser = await db
        .select({ email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.id, user.id))
        .limit(1);

      if (dbUser.length === 0) {
        throw new Error("User not found");
      }

      await acceptInvite(db, token, user.id, dbUser[0].email);
      return redirect("/app");
    } else if (action === "decline") {
      await declineInvite(db, token);
      return redirect("/");
    }
  } catch (error) {
    return data(
      { error: error instanceof Error ? error.message : "Failed to process invite" },
      { status: 400 }
    );
  }

  return redirect("/");
}

export default function InviteAccept({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <AcceptInviteView
      invite={loaderData.invite}
      user={loaderData.user}
      userEmail={loaderData.userEmail}
      error={actionData?.error}
    />
  );
}

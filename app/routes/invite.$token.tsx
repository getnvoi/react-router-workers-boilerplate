import { data, redirect } from "react-router";
import type { Route } from "./+types/invite.$token";
import { getDb } from "~/db";
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

  return { invite, user };
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
      await acceptInvite(db, token, user.id);
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
      error={actionData?.error}
    />
  );
}

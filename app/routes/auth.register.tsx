import { data } from "react-router";
import type { Route } from "./+types/auth.register";
import { getDb } from "~/db";
import { registerWithEmail } from "~/services/auth-email.server";
import { createUserSession } from "~/services/auth.server";
import { RegisterView } from "~/views/auth/register/register-view";

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();

  if (!email || !password) {
    return data({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const db = getDb(context.cloudflare.env.DB);
    const user = await registerWithEmail(db, email, password, name);
    return createUserSession(user, "/app");
  } catch (error) {
    return data(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 }
    );
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  return <RegisterView error={actionData?.error} />;
}

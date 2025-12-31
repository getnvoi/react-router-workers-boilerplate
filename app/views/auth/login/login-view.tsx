import { Field, Button } from "~/components";

interface LoginViewProps {
  error?: string;
}

export function LoginView({ error }: LoginViewProps) {
  return (
    <div >
      <h1 >Login</h1>

      <form method="post" >
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" required placeholder="you@example.com" />
        </Field.Root>

        <Field.Root name="password">
          <Field.Label>Password</Field.Label>
          <Field.Control type="password" required />
        </Field.Root>

        {error && <div >{error}</div>}

        <Button type="submit" >
          Login
        </Button>
      </form>

      <p >
        Don't have an account?{" "}
        <a href="/auth/register" >
          Sign up
        </a>
      </p>
    </div>
  );
}

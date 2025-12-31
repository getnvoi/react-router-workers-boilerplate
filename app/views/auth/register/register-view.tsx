import { Field, Button } from "~/components";

interface RegisterViewProps {
  error?: string;
}

export function RegisterView({ error }: RegisterViewProps) {
  return (
    <div >
      <h1 >Create Account</h1>

      <form method="post" >
        <Field.Root name="name">
          <Field.Label>Name (optional)</Field.Label>
          <Field.Control type="text" placeholder="John Doe" />
        </Field.Root>

        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" required placeholder="you@example.com" />
        </Field.Root>

        <Field.Root name="password">
          <Field.Label>Password</Field.Label>
          <Field.Control type="password" required minLength={12} />
          <Field.Description>At least 12 characters</Field.Description>
        </Field.Root>

        {error && <div >{error}</div>}

        <Button type="submit" >
          Create Account
        </Button>
      </form>

      <p >
        Already have an account?{" "}
        <a href="/auth/login" >
          Login
        </a>
      </p>
    </div>
  );
}

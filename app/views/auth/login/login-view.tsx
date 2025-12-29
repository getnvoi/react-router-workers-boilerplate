import { Field, Button } from "~/components";
import styles from "./login-view.module.css";

interface LoginViewProps {
  error?: string;
}

export function LoginView({ error }: LoginViewProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      <form method="post" className={styles.form}>
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" required placeholder="you@example.com" />
        </Field.Root>

        <Field.Root name="password">
          <Field.Label>Password</Field.Label>
          <Field.Control type="password" required />
        </Field.Root>

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" className={styles.submitButton}>
          Login
        </Button>
      </form>

      <p className={styles.footer}>
        Don't have an account?{" "}
        <a href="/auth/register" className={styles.link}>
          Sign up
        </a>
      </p>
    </div>
  );
}

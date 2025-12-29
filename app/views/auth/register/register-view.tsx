import { Field, Button } from "~/components";
import styles from "./register-view.module.css";

interface RegisterViewProps {
  error?: string;
}

export function RegisterView({ error }: RegisterViewProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>

      <form method="post" className={styles.form}>
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

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" className={styles.submitButton}>
          Create Account
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <a href="/auth/login" className={styles.link}>
          Login
        </a>
      </p>
    </div>
  );
}

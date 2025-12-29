import { Outlet, Link } from "react-router";
import { LinkButton } from "~/components";
import styles from "./public.module.css";

export default function PublicLayout() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Link to="/" className={styles.logo}>
              nvoi
            </Link>
            <LinkButton variant="primary" size="md" href="/oauth/github">
              Login with GitHub
            </LinkButton>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

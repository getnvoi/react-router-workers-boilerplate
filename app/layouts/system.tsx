import { Outlet, Link } from "react-router";
import styles from "./system.module.css";

export default function SystemLayout() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navContent}>
            <Link to="/system" className={styles.logo}>
              nvoi <span className={styles.badge}>System</span>
            </Link>
            <div className={styles.navLinks}>
              <Link to="/system" className={styles.navLink}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

import styles from "./system-view.module.css";

export function SystemView() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>System Dashboard</h1>
          <p className={styles.description}>
            Internal system monitoring and management dashboard.
          </p>
          <div className={styles.placeholder}>
            <p>System auth and features will be added here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

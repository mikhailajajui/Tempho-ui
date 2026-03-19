import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.loadingScreen} aria-busy="true" aria-live="polite">
      <div className={styles.panel}>
        <div className={styles.logoWrap}>
          <img
            className={styles.logo}
            src="/loading-logo.svg"
            alt="Tempho"
            width="190"
            height="107"
          />
        </div>
        <p className={styles.caption}>
          Loading
          <span className={styles.dots} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </p>
      </div>
    </main>
  );
}

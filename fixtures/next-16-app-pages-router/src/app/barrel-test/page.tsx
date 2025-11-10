import * as styles from '../../styles/barrel-import.css';

export default function BarrelTestPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Barrel Import Test</h1>
      <p>
        This page imports from a barrel that re-exports Next.js APIs. The stubs
        prevent AsyncLocalStorage errors during CSS evaluation.
      </p>
    </div>
  );
}

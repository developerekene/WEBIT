import { useEffect } from "react";
import styles from "../styles/Loading.module.css";

interface LoadingScreenProps {
  progress?: number;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({
  progress = 0,
  onLoadingComplete,
}: LoadingScreenProps) {
  useEffect(() => {
    if (progress >= 100 && onLoadingComplete) {
      const timer = setTimeout(() => {
        onLoadingComplete();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoadingComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h1 className={styles.brand}>WEBIT</h1>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className={styles.progressText}>{Math.floor(progress)}%</p>
      </div>
    </div>
  );
}

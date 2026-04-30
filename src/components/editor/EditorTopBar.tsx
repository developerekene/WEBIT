import { Link } from "react-router-dom";
import styles from "../../styles/EditorPage.module.css";

type ViewMode = "desktop" | "tablet" | "mobile";

interface EditorTopBarProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

export default function EditorTopBar({
  viewMode,
  setViewMode,
}: EditorTopBarProps) {
  return (
    <header className={styles.topBar}>
      <Link to="/" className={styles.brand}>
        WEBIT
      </Link>
      <div className={styles.deviceControls}>
        <button
          className={`${styles.deviceBtn} ${viewMode === "desktop" ? styles.active : ""}`}
          onClick={() => setViewMode("desktop")}
        >
          Desktop
        </button>
        <button
          className={`${styles.deviceBtn} ${viewMode === "tablet" ? styles.active : ""}`}
          onClick={() => setViewMode("tablet")}
        >
          Tablet
        </button>
        <button
          className={`${styles.deviceBtn} ${viewMode === "mobile" ? styles.active : ""}`}
          onClick={() => setViewMode("mobile")}
        >
          Mobile
        </button>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSecondary}>{"< / >"} Export JSON</button>
        <button className={styles.btnPrimary}>Publish</button>
      </div>
    </header>
  );
}

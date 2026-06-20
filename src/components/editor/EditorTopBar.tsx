import { Link } from "react-router-dom";
import styles from "../../styles/EditorPage.module.css";

type ViewMode = "desktop" | "tablet" | "mobile";

interface EditorTopBarProps {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function EditorTopBar({
  viewMode,
  setViewMode,
  onPreview,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
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
      <div
        className={styles.actions}
        style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
      >
        <button
          className={styles.btnSecondary}
          onClick={onUndo}
          disabled={!canUndo}
          style={{ padding: "6px 10px", opacity: canUndo ? 1 : 0.4 }}
          title="Undo"
        >
          ↩ Undo
        </button>
        <button
          className={styles.btnSecondary}
          onClick={onRedo}
          disabled={!canRedo}
          style={{ padding: "6px 10px", opacity: canRedo ? 1 : 0.4 }}
          title="Redo"
        >
          ↪ Redo
        </button>
        <div
          style={{
            width: "1px",
            height: "24px",
            background: "#cbd5e1",
            margin: "0 0.25rem",
          }}
        />
        <button className={styles.btnSecondary} onClick={onPreview}>
          ▶ Preview
        </button>
        <button className={styles.btnSecondary}>{"< / >"} Export JSON</button>
        <button className={styles.btnPrimary}>Publish</button>
      </div>
    </header>
  );
}

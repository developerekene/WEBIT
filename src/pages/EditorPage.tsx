import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/EditorPage.module.css";
import {
  TemplateRenderer,
  type ElementSchema,
} from "../engine/TemplateRenderer";

type ViewMode = "desktop" | "tablet" | "mobile";

const BASIC_ELEMENTS = [
  { id: "section", label: "Section", icon: "🔲" },
  { id: "grid", label: "Grid", icon: "⊞" },
  { id: "heading", label: "Heading", icon: "T" },
  { id: "text", label: "Text", icon: "📄" },
  { id: "image", label: "Image", icon: "🖼️" },
  { id: "button", label: "Button", icon: "🔘" },
  { id: "video", label: "Video", icon: "▶️" },
  { id: "divider", label: "Divider", icon: "➖" },
];

export default function EditorPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const templateData = location.state?.templateData as ElementSchema[] | null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.editorLayout}>
        <header className={styles.topBar}>
          <div className={`${styles.skeleton} ${styles.skelBrand}`}></div>
          <div className={styles.deviceControls}>
            <div className={`${styles.skeleton} ${styles.skelBtn}`}></div>
            <div className={`${styles.skeleton} ${styles.skelBtn}`}></div>
            <div className={`${styles.skeleton} ${styles.skelBtn}`}></div>
          </div>
          <div className={styles.actions}>
            <div
              className={`${styles.skeleton} ${styles.skelBtn} ${styles.skelBtnWide}`}
            ></div>
            <div className={`${styles.skeleton} ${styles.skelBtn}`}></div>
          </div>
        </header>

        <aside className={styles.leftPanel}>
          <div className={`${styles.skeleton} ${styles.skelPanelHeader}`}></div>
          <div className={styles.elementGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skelIconBlock}`}
              ></div>
            ))}
          </div>
        </aside>

        <main className={styles.canvasArea}>
          <div className={`${styles.canvasFrame} ${styles[`${viewMode}View`]}`}>
            <div className={styles.skeletonCanvas}>
              <div className={`${styles.skeleton} ${styles.skelNav}`}></div>
              <div className={`${styles.skeleton} ${styles.skelHero}`}></div>
              <div className={styles.skelRow}>
                <div className={`${styles.skeleton} ${styles.skelCol}`}></div>
                <div className={`${styles.skeleton} ${styles.skelCol}`}></div>
                <div className={`${styles.skeleton} ${styles.skelCol}`}></div>
              </div>
            </div>
          </div>
        </main>

        <aside className={styles.rightPanel}>
          <div className={`${styles.skeleton} ${styles.skelPanelHeader}`}></div>

          <div className={styles.skelSettingsGroup}>
            <div className={`${styles.skeleton} ${styles.skelTitle}`}></div>
            <div className={styles.skelCircleWrapper}>
              <div className={`${styles.skeleton} ${styles.skelCircle}`}></div>
              <div className={`${styles.skeleton} ${styles.skelCircle}`}></div>
              <div className={`${styles.skeleton} ${styles.skelCircle}`}></div>
            </div>
          </div>

          <div className={styles.skelSettingsGroup}>
            <div className={`${styles.skeleton} ${styles.skelTitle}`}></div>
            <div className={`${styles.skeleton} ${styles.skelInput}`}></div>
          </div>

          <div className={styles.skelSettingsGroup}>
            <div className={`${styles.skeleton} ${styles.skelTextLine}`}></div>
            <div
              className={`${styles.skeleton} ${styles.skelTextLine} ${styles.skelTextLineShort}`}
            ></div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className={styles.editorLayout}>
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

      <aside className={styles.leftPanel}>
        <div className={styles.panelHeader}>Add Elements</div>
        <div className={styles.elementGrid}>
          {BASIC_ELEMENTS.map((el) => (
            <div key={el.id} className={styles.elementItem} draggable>
              <span style={{ fontSize: "1.5rem" }}>{el.icon}</span>
              {el.label}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.canvasArea}>
        <div className={`${styles.canvasFrame} ${styles[`${viewMode}View`]}`}>
          {templateData ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                background: "#ffffff",
              }}
            >
              <TemplateRenderer schema={templateData} />
            </div>
          ) : (
            <div
              style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}
            >
              <h2>Drag elements here</h2>
              <p>Your site schema will render in this frame.</p>
            </div>
          )}
        </div>
      </main>

      <aside className={styles.rightPanel}>
        <div className={styles.panelHeader}>Inspector</div>

        <div className={styles.settingsGroup}>
          <h4>Global Theme</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                width: 30,
                height: 30,
                background: "#4f46e5",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
            <div
              style={{
                width: 30,
                height: 30,
                background: "#0f172a",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
            <div
              style={{
                width: 30,
                height: 30,
                background: "#ec4899",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            ></div>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <h4>Typography</h4>
          <select
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <option>Inter</option>
            <option>Roboto</option>
            <option>Playfair Display</option>
          </select>
        </div>

        <div className={styles.settingsGroup}>
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.85rem",
            }}
          >
            Select an element on the canvas to edit its specific properties
            here.
          </div>
        </div>
      </aside>
    </div>
  );
}

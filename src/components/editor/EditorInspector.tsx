import styles from "../../styles/EditorPage.module.css";
import type { ElementSchema } from "../../engine/TemplateRenderer";

type BackgroundMode = "transparent" | "solid" | "gradient";

interface EditorInspectorProps {
  selectedElement: ElementSchema | null;
  selectedIdsCount: number;
  onUpdateStyle: (id: string, property: string, value: string) => void;
  onDeleteSelected: () => void;
}

export default function EditorInspector({
  selectedElement,
  selectedIdsCount,
  onUpdateStyle,
  onDeleteSelected,
}: EditorInspectorProps) {
  const bg = String(selectedElement?.styles?.background || "transparent");

  let bgMode: BackgroundMode = "transparent";
  let solidColor = "#ffffff";
  let gradientStart = "#4f46e5";
  let gradientEnd = "#ec4899";

  if (bg.includes("gradient")) {
    bgMode = "gradient";
    const matches = bg.match(/#[a-zA-Z0-9]{6}/g);
    if (matches && matches.length >= 2) {
      [gradientStart, gradientEnd] = matches;
    }
  } else if (bg !== "transparent") {
    bgMode = "solid";
    solidColor = bg;
  }

  const applyBackground = (
    mode: BackgroundMode,
    color1: string,
    color2: string,
  ) => {
    if (!selectedElement) return;
    let bgValue = "transparent";
    if (mode === "solid") bgValue = color1;
    if (mode === "gradient")
      bgValue = `linear-gradient(90deg, ${color1}, ${color2})`;
    onUpdateStyle(selectedElement.id, "background", bgValue);
  };

  if (selectedIdsCount === 0)
    return (
      <aside className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>Inspector</div>
        <div className={styles.settingsGroup}>
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.85rem",
            }}
          >
            Select an element to configure styles.
          </div>
        </div>
      </aside>
    );

  if (selectedIdsCount > 1)
    return (
      <aside className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>Inspector</div>
        <div className={styles.settingsGroup}>
          <h4>Multiple Selected ({selectedIdsCount})</h4>
          <button
            onClick={onDeleteSelected}
            className={styles.btnSecondary}
            style={{
              width: "100%",
              background: "#fee2e2",
              color: "#ef4444",
              borderColor: "#f87171",
            }}
          >
            Delete Selected
          </button>
        </div>
      </aside>
    );

  return (
    <aside className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.panelHeader}>Inspector</div>
      <div className={styles.settingsGroup}>
        <h4>Editing: {selectedElement?.type.toUpperCase()}</h4>
        <button
          onClick={onDeleteSelected}
          className={styles.btnSecondary}
          style={{
            width: "100%",
            background: "#fee2e2",
            color: "#ef4444",
            borderColor: "#f87171",
            marginBottom: "1rem",
          }}
        >
          Delete Element
        </button>
      </div>

      {(selectedElement?.type === "section" ||
        selectedElement?.type === "container") && (
        <div className={styles.settingsGroup}>
          <h4>Layout (Flexbox)</h4>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}
            >
              Direction
            </label>
            <select
              value={selectedElement.styles?.flexDirection || "column"}
              onChange={(e) =>
                onUpdateStyle(
                  selectedElement.id,
                  "flexDirection",
                  e.target.value,
                )
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="column">Vertical (Column)</option>
              <option value="row">Horizontal (Row)</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}
            >
              Align Items
            </label>
            <select
              value={selectedElement.styles?.alignItems || "stretch"}
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "alignItems", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.settingsGroup}>
        <h4>Background</h4>
        <select
          value={bgMode}
          onChange={(e) => {
            const newMode = e.target.value as BackgroundMode;
            applyBackground(newMode, solidColor, gradientEnd);
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            marginBottom: "1rem",
          }}
        >
          <option value="transparent">Transparent</option>
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
        </select>
        {bgMode === "solid" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="color"
              value={solidColor}
              onChange={(e) => {
                applyBackground("solid", e.target.value, gradientEnd);
              }}
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                border: "none",
              }}
            />
            <input
              type="text"
              value={solidColor}
              onChange={(e) => {
                applyBackground("solid", e.target.value, gradientEnd);
              }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>
        )}
        {bgMode === "gradient" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="color"
                value={gradientStart}
                onChange={(e) =>
                  applyBackground("gradient", e.target.value, gradientEnd)
                }
                style={{
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  border: "none",
                }}
              />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Start
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) =>
                  applyBackground("gradient", gradientStart, e.target.value)
                }
                style={{
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  border: "none",
                }}
              />
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>End</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

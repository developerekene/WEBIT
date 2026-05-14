import { useState } from "react";
import styles from "../../styles/EditorPage.module.css";
import type { ElementSchema } from "../../engine/TemplateRenderer";

type BackgroundMode = "transparent" | "solid" | "gradient";

interface ExtendedElement extends ElementSchema {
  src?: string;
  href?: string;
  content?: string;
}

interface EditorInspectorProps {
  selectedElement: ElementSchema | null;
  selectedIdsCount: number;
  onUpdateStyle: (id: string, property: string, value: string) => void;
  onUpdateProp: (id: string, property: string, value: unknown) => void;
  onDeleteSelected: () => void;
  onAddNavbarLink: () => void;
}

export default function EditorInspector({
  selectedElement,
  selectedIdsCount,
  onUpdateStyle,
  onUpdateProp,
  onDeleteSelected,
  onAddNavbarLink,
}: EditorInspectorProps) {
  const [customCSS, setCustomCSS] = useState("");
  const [prevId, setPrevId] = useState<string | undefined>(selectedElement?.id);

  if (selectedElement?.id !== prevId) {
    setPrevId(selectedElement?.id);
    setCustomCSS("");
  }

  if (selectedIdsCount === 0 || !selectedElement) {
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
  }

  if (selectedIdsCount > 1) {
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
  }

  const bg = String(selectedElement.styles?.background || "transparent");
  const elemData = selectedElement as ExtendedElement;

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
    let bgValue = "transparent";
    if (mode === "solid") bgValue = color1;
    if (mode === "gradient")
      bgValue = `linear-gradient(90deg, ${color1}, ${color2})`;
    onUpdateStyle(selectedElement.id, "background", bgValue);
  };

  const handleApplyCSS = () => {
    if (!customCSS.trim()) return;
    const rules = customCSS.split(";");
    rules.forEach((rule) => {
      const colonIndex = rule.indexOf(":");
      if (colonIndex !== -1) {
        const key = rule.slice(0, colonIndex).trim();
        const value = rule.slice(colonIndex + 1).trim();
        if (key && value) {
          const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          onUpdateStyle(selectedElement.id, camelKey, value);
        }
      }
    });
    setCustomCSS("");
  };

  const type = selectedElement.type;
  const isLayout = type === "section" || type === "container";
  const isText = type === "text" || type === "heading" || type === "button";
  const isImage = type === "image";
  const hasBackground =
    type === "section" || type === "container" || type === "button";

  return (
    <aside className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.panelHeader}>Inspector</div>
      <div className={styles.settingsGroup}>
        <h4>Editing: {selectedElement.type.toUpperCase()}</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
          <button
            onClick={onDeleteSelected}
            className={styles.btnSecondary}
            style={{
              flex: 1,
              background: "#fee2e2",
              color: "#ef4444",
              borderColor: "#f87171",
            }}
          >
            Delete
          </button>
        </div>

        {(selectedElement.id.includes("links") ||
          selectedElement.id.includes("text-l") ||
          selectedElement.id.includes("group") ||
          selectedElement.id.includes("utils")) && (
          <button
            onClick={onAddNavbarLink}
            className={styles.btnSecondary}
            style={{
              width: "100%",
              background: "#f1f5f9",
              color: "#0f172a",
              borderColor: "#cbd5e1",
              marginTop: "0.5rem",
            }}
          >
            + Add Navbar Link
          </button>
        )}
      </div>

      {(isText || isImage) && (
        <div className={styles.settingsGroup}>
          <h4>Content & Link</h4>

          {isText && (
            <textarea
              value={elemData.content || ""}
              onChange={(e) =>
                onUpdateProp(selectedElement.id, "content", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                minHeight: "80px",
                marginBottom: "1rem",
              }}
            />
          )}

          {isImage && (
            <input
              type="text"
              value={elemData.src || ""}
              placeholder="https://..."
              onChange={(e) =>
                onUpdateProp(selectedElement.id, "src", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                marginBottom: "1rem",
              }}
            />
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Link to (URL or Page ID)
            </label>
            <input
              type="text"
              value={elemData.href || ""}
              placeholder="https://... or page-1"
              onChange={(e) =>
                onUpdateProp(selectedElement.id, "href", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>

          {selectedElement.id.includes("logo") && (
            <>
              {isText && (
                <button
                  onClick={() =>
                    onUpdateProp(selectedElement.id, "type", "image")
                  }
                  className={styles.btnSecondary}
                  style={{ width: "100%", fontSize: "0.8rem" }}
                >
                  Convert Logo to Image
                </button>
              )}
              {isImage && (
                <button
                  onClick={() =>
                    onUpdateProp(selectedElement.id, "type", "heading")
                  }
                  className={styles.btnSecondary}
                  style={{ width: "100%", fontSize: "0.8rem" }}
                >
                  Convert Logo to Text
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className={styles.settingsGroup}>
        <h4>Size</h4>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Width
          </label>
          <input
            type="text"
            value={selectedElement.styles?.width || ""}
            placeholder="e.g., 100%, 200px, auto"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "width", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Height
          </label>
          <input
            type="text"
            value={selectedElement.styles?.height || ""}
            placeholder="e.g., 100vh, 200px, auto"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "height", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        {isImage && (
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Object Fit
            </label>
            <select
              value={selectedElement.styles?.objectFit || "fill"}
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "objectFit", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="fill">Fill</option>
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="scale-down">Scale Down</option>
              <option value="none">None</option>
            </select>
          </div>
        )}
      </div>

      {isText && (
        <div className={styles.settingsGroup}>
          <h4>Typography</h4>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Text Color
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="color"
                value={selectedElement.styles?.color || "#0f172a"}
                onChange={(e) =>
                  onUpdateStyle(selectedElement.id, "color", e.target.value)
                }
                style={{
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  border: "none",
                }}
              />
              <input
                type="text"
                value={selectedElement.styles?.color || "#0f172a"}
                onChange={(e) =>
                  onUpdateStyle(selectedElement.id, "color", e.target.value)
                }
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Font Size
            </label>
            <input
              type="text"
              value={selectedElement.styles?.fontSize || ""}
              placeholder="e.g., 1rem, 16px"
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "fontSize", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Font Weight
            </label>
            <select
              value={selectedElement.styles?.fontWeight || "normal"}
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "fontWeight", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="normal">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="bold">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Text Align
            </label>
            <select
              value={selectedElement.styles?.textAlign || "left"}
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "textAlign", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.settingsGroup}>
        <h4>Spacing & Borders</h4>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Margin
          </label>
          <input
            type="text"
            value={selectedElement.styles?.margin || ""}
            placeholder="e.g., 10px, 0 auto"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "margin", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Padding
          </label>
          <input
            type="text"
            value={selectedElement.styles?.padding || ""}
            placeholder="e.g., 10px 20px"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "padding", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Border Radius
          </label>
          <input
            type="text"
            value={selectedElement.styles?.borderRadius || ""}
            placeholder="e.g., 8px, 50%"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "borderRadius", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Border
          </label>
          <input
            type="text"
            value={selectedElement.styles?.border || ""}
            placeholder="e.g., 1px solid #e2e8f0"
            onChange={(e) =>
              onUpdateStyle(selectedElement.id, "border", e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>
      </div>

      {isLayout && (
        <div className={styles.settingsGroup}>
          <h4>Layout (Flexbox)</h4>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
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
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
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
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Justify Content
            </label>
            <select
              value={selectedElement.styles?.justifyContent || "flex-start"}
              onChange={(e) =>
                onUpdateStyle(
                  selectedElement.id,
                  "justifyContent",
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
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Gap
            </label>
            <input
              type="text"
              value={selectedElement.styles?.gap || ""}
              placeholder="e.g., 1rem, 16px"
              onChange={(e) =>
                onUpdateStyle(selectedElement.id, "gap", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>
        </div>
      )}

      {hasBackground && (
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
                onChange={(e) =>
                  applyBackground("solid", e.target.value, gradientEnd)
                }
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
                onChange={(e) =>
                  applyBackground("solid", e.target.value, gradientEnd)
                }
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
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
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
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
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
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  End
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.settingsGroup}>
        <h4>Custom CSS (Inline)</h4>
        <textarea
          value={customCSS}
          onChange={(e) => setCustomCSS(e.target.value)}
          placeholder="color: red;&#10;padding: 10px;"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            minHeight: "80px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
            fontSize: "0.8rem",
          }}
        />
        <button
          onClick={handleApplyCSS}
          className={styles.btnSecondary}
          style={{ width: "100%", fontSize: "0.8rem" }}
        >
          Apply CSS
        </button>
      </div>
    </aside>
  );
}

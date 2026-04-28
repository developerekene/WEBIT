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
  const location = useLocation();
  const initialData = location.state?.templateData as ElementSchema[] | null;

  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [schema, setSchema] = useState<ElementSchema[]>(initialData || []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("element-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const elementType = e.dataTransfer.getData(
      "element-type",
    ) as ElementSchema["type"];
    if (!elementType) return;

    const newElement: ElementSchema = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      content: `New ${elementType}`,
      styles: {
        padding:
          elementType === "section" || elementType === "container"
            ? "2rem"
            : "0.5rem",
        margin: "0.5rem 0",
        minHeight: elementType === "section" ? "100px" : "auto",
        background: elementType === "section" ? "#f8fafc" : "transparent",
      },
    };

    setSchema((prev) => [...prev, newElement]);
    setSelectedIds([newElement.id]);
  };

  const handleSelectElement = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((selectedId) => selectedId !== id)
          : [...prev, id],
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDeselect = () => {
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    const recursivelyDelete = (
      elements: ElementSchema[],
      targetIds: string[],
    ): ElementSchema[] => {
      return elements
        .filter((el) => !targetIds.includes(el.id))
        .map((el) => ({
          ...el,
          children: el.children
            ? recursivelyDelete(el.children, targetIds)
            : undefined,
        }));
    };

    setSchema((prev) => recursivelyDelete(prev, selectedIds));
    setSelectedIds([]);
  };

  if (isLoading) {
    return <div className={styles.editorLayout}>Loading...</div>;
  }

  return (
    <div className={styles.editorLayout} onClick={handleDeselect}>
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

      <aside className={styles.leftPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>Add Elements</div>
        <div className={styles.elementGrid}>
          {BASIC_ELEMENTS.map((el) => (
            <div
              key={el.id}
              className={styles.elementItem}
              draggable
              onDragStart={(e) => handleDragStart(e, el.id)}
            >
              <span style={{ fontSize: "1.5rem" }}>{el.icon}</span>
              {el.label}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.canvasArea}>
        <div
          className={`${styles.canvasFrame} ${styles[`${viewMode}View`]}`}
          style={{
            border: isDraggingOver ? "2px dashed #4f46e5" : "none",
            transition: "border 0.2s ease",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {schema.length > 0 ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                background: "#ffffff",
                paddingBottom: "10rem",
              }}
            >
              <TemplateRenderer
                schema={schema}
                selectedIds={selectedIds}
                onSelect={handleSelectElement}
              />
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

      <aside className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>Inspector</div>

        {selectedIds.length > 0 ? (
          <>
            <div className={styles.settingsGroup}>
              <h4>
                {selectedIds.length === 1
                  ? `Editing: ${selectedIds[0].split("-")[0]}`
                  : `Multiple Elements Selected (${selectedIds.length})`}
              </h4>
              <button
                onClick={handleDeleteSelected}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#fee2e2",
                  color: "#ef4444",
                  border: "1px solid #f87171",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                {selectedIds.length === 1
                  ? "Delete Element"
                  : "Delete Selected Elements"}
              </button>
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
                (Content and style editing coming next)
              </div>
            </div>
          </>
        ) : (
          <div className={styles.settingsGroup}>
            <div
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.85rem",
              }}
            >
              Select one or more elements on the canvas (Shift+Click for
              multi-select).
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

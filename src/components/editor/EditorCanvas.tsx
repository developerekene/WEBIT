import { useState, useEffect, useRef } from "react";
import styles from "../../styles/EditorPage.module.css";
import {
  TemplateRenderer,
  type ElementSchema,
} from "../../engine/TemplateRenderer";

type ViewMode = "desktop" | "tablet" | "mobile";

export type PageSchema = {
  id: string;
  name: string;
  elements: ElementSchema[];
};

interface EditorCanvasProps {
  pages: PageSchema[];
  activePageId: string;
  viewMode: ViewMode;
  isDraggingOver: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selectedIds: string[];
  onSetActivePage: (id: string) => void;
  onUpdatePageName: (id: string, name: string) => void;
  onAddPage: () => void;
  onDragOver: (pageId: string, e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDropCanvas: (pageId: string, e: React.DragEvent) => void;
  onSelectElement: (id: string, e: React.MouseEvent) => void;
  onDragStartCanvas: (id: string, e: React.DragEvent) => void;
  onDropOnElement: (targetId: string, e: React.DragEvent) => void;
}

export default function EditorCanvas({
  pages,
  activePageId,
  viewMode,
  isDraggingOver,
  canvasRef,
  selectedIds,
  onSetActivePage,
  onUpdatePageName,
  onAddPage,
  onDragOver,
  onDragLeave,
  onDropCanvas,
  onSelectElement,
  onDragStartCanvas,
  onDropOnElement,
}: EditorCanvasProps) {
  const [viewport, setViewport] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const wrapperRef = useRef<HTMLElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number; dist?: number } | null>(
    null,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setViewport((prev) => {
        if (e.ctrlKey || e.metaKey) {
          const zoomSensitivity = 0.01;
          const delta = -e.deltaY * zoomSensitivity;
          const newScale = Math.min(Math.max(0.1, prev.scale + delta), 5);
          if (newScale === prev.scale) return prev;
          const rect = wrapper.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          return {
            scale: newScale,
            x: x - (x - prev.x) * (newScale / prev.scale),
            y: y - (y - prev.y) * (newScale / prev.scale),
          };
        } else {
          const isShiftHorizontal = e.shiftKey && e.deltaX === 0;
          return {
            ...prev,
            x: prev.x - (isShiftHorizontal ? e.deltaY : e.deltaX),
            y: prev.y - (isShiftHorizontal ? 0 : e.deltaY),
          };
        }
      });
    };
    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <main
      ref={wrapperRef}
      className={styles.canvasArea}
      onPointerDown={(e) => {
        if (e.button === 1 || isSpacePressed) {
          e.preventDefault();
          setIsPanning(true);
        }
      }}
      onPointerMove={(e) => {
        if (isPanning && e.pointerType !== "touch")
          setViewport((prev) => ({
            ...prev,
            x: prev.x + e.movementX,
            y: prev.y + e.movementY,
          }));
      }}
      onPointerUp={() => setIsPanning(false)}
      onPointerLeave={() => setIsPanning(false)}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          lastTouchRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          lastTouchRef.current = { x: cx, y: cy, dist };
        }
      }}
      onTouchMove={(e) => {
        if (
          e.touches.length === 1 &&
          lastTouchRef.current &&
          !lastTouchRef.current.dist
        ) {
          const dx = e.touches[0].clientX - lastTouchRef.current.x;
          const dy = e.touches[0].clientY - lastTouchRef.current.y;
          setViewport((prev) => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy,
          }));
          lastTouchRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        } else if (e.touches.length === 2 && lastTouchRef.current?.dist) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

          const scaleDiff = dist / lastTouchRef.current.dist;

          setViewport((prev) => {
            const newScale = Math.min(Math.max(0.1, prev.scale * scaleDiff), 5);
            if (newScale === prev.scale || !wrapperRef.current) return prev;
            const rect = wrapperRef.current.getBoundingClientRect();
            const x = cx - rect.left;
            const y = cy - rect.top;
            return {
              scale: newScale,
              x: x - (x - prev.x) * (newScale / prev.scale),
              y: y - (y - prev.y) * (newScale / prev.scale),
            };
          });

          lastTouchRef.current = { x: cx, y: cy, dist };
        }
      }}
      onTouchEnd={(e) => {
        if (e.touches.length === 0) {
          lastTouchRef.current = null;
        } else if (e.touches.length === 1) {
          lastTouchRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      }}
      style={{
        touchAction: "none",
        overflow: "hidden",
        position: "relative",
        cursor: isSpacePressed || isPanning ? "grabbing" : "default",
        backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 0)",
        backgroundSize: `${24 * viewport.scale}px ${24 * viewport.scale}px`,
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
      }}
    >
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: "0 0",
          transition: isPanning ? "none" : "transform 0.05s linear",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div
          style={{ display: "flex", gap: "100px", alignItems: "flex-start" }}
        >
          {pages.map((page) => (
            <div
              key={page.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "4px",
                }}
              >
                <input
                  type="text"
                  value={page.name}
                  onChange={(e) => onUpdatePageName(page.id, e.target.value)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: activePageId === page.id ? "#0f172a" : "#64748b",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    width: "150px",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                </span>
              </div>
              <div
                onClick={() => onSetActivePage(page.id)}
                className={`${styles.canvasFrame} ${styles[`${viewMode}View`]}`}
                style={{
                  border:
                    isDraggingOver === page.id ? "2px dashed #4f46e5" : "none",
                  outline:
                    activePageId === page.id
                      ? "3px solid #4f46e5"
                      : "3px solid transparent",
                  outlineOffset: "4px",
                  transition:
                    "outline 0.2s ease, border 0.2s ease, width 0.4s ease",
                  minHeight: "800px",
                  height: "max-content",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  cursor: isSpacePressed || isPanning ? "grabbing" : "default",
                  pointerEvents: isSpacePressed || isPanning ? "none" : "auto",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                }}
                onDragOver={(e) => onDragOver(page.id, e)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDropCanvas(page.id, e)}
              >
                {page.elements.length > 0 ? (
                  <div
                    ref={activePageId === page.id ? canvasRef : null}
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      height: "max-content",
                      background: "#ffffff",
                      paddingBottom: "10rem",
                    }}
                  >
                    <TemplateRenderer
                      schema={page.elements || []}
                      selectedIds={selectedIds}
                      onSelect={(id, e) => {
                        onSetActivePage(page.id);
                        onSelectElement(id, e);
                      }}
                      onDragStart={onDragStartCanvas}
                      onDrop={onDropOnElement}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "4rem",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    <h2>Empty Canvas</h2>
                    <p>Select this canvas and click elements to add.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={onAddPage}
            style={{
              marginTop: "36px",
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              border: "2px dashed #cbd5e1",
              background: "rgba(255,255,255,0.5)",
              color: "#94a3b8",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => {
            setViewport((prev) => {
              const newScale = Math.max(0.1, prev.scale - 0.1);
              if (newScale === prev.scale || !wrapperRef.current) return prev;
              const rect = wrapperRef.current.getBoundingClientRect();
              const x = rect.width / 2;
              const y = rect.height / 2;
              return {
                scale: newScale,
                x: x - (x - prev.x) * (newScale / prev.scale),
                y: y - (y - prev.y) * (newScale / prev.scale),
              };
            });
          }}
          style={{
            padding: "4px 12px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#64748b",
          }}
        >
          −
        </button>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: "600",
            width: "48px",
            textAlign: "center",
            color: "#0f172a",
            userSelect: "none",
          }}
        >
          {Math.round(viewport.scale * 100)}%
        </span>
        <button
          onClick={() => {
            setViewport((prev) => {
              const newScale = Math.min(5, prev.scale + 0.1);
              if (newScale === prev.scale || !wrapperRef.current) return prev;
              const rect = wrapperRef.current.getBoundingClientRect();
              const x = rect.width / 2;
              const y = rect.height / 2;
              return {
                scale: newScale,
                x: x - (x - prev.x) * (newScale / prev.scale),
                y: y - (y - prev.y) * (newScale / prev.scale),
              };
            });
          }}
          style={{
            padding: "4px 12px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#64748b",
          }}
        >
          +
        </button>
      </div>
    </main>
  );
}

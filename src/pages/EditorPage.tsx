import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/EditorPage.module.css";
import type { ElementSchema } from "../engine/TemplateRenderer";

import EditorTopBar from "../components/editor/EditorTopBar";
import EditorSidebar from "../components/editor/EditorSidebar";
import EditorInspector from "../components/editor/EditorInspector";
import EditorCanvas, {
  type PageSchema,
} from "../components/editor/EditorCanvas";

type ViewMode = "desktop" | "tablet" | "mobile";

const NAVBAR_TEMPLATES = [
  {
    id: "standard",
    name: "Standard Navbar",
    description: "Logo left, links center, button right",
    getSchema: (baseId: number): ElementSchema => ({
      id: `container-nav-${baseId}`,
      type: "container",
      styles: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        margin: "0",
      },
      children: [
        {
          id: `heading-logo-${baseId}`,
          type: "heading",
          content: "BrandLogo",
          styles: {
            margin: "0",
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "#0f172a",
          },
        },
        {
          id: `container-links-${baseId}`,
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            alignItems: "center",
            padding: "0",
            margin: "0",
            background: "transparent",
          },
          children: [
            {
              id: `text-l1-${baseId}`,
              type: "text",
              content: "Home",
              styles: {
                margin: "0",
                fontWeight: "600",
                cursor: "pointer",
                color: "#64748b",
              },
            },
            {
              id: `text-l2-${baseId}`,
              type: "text",
              content: "About",
              styles: {
                margin: "0",
                fontWeight: "600",
                cursor: "pointer",
                color: "#64748b",
              },
            },
            {
              id: `text-l3-${baseId}`,
              type: "text",
              content: "Contact",
              styles: {
                margin: "0",
                fontWeight: "600",
                cursor: "pointer",
                color: "#64748b",
              },
            },
          ],
        },
        {
          id: `button-cta-${baseId}`,
          type: "button",
          content: "Get Started",
          styles: {
            padding: "10px 20px",
            background: "#4f46e5",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            margin: "0",
          },
        },
      ],
    }),
  },
  {
    id: "centered",
    name: "Centered Logo",
    description: "Links left, logo center, button right",
    getSchema: (baseId: number): ElementSchema => ({
      id: `container-nav-${baseId}`,
      type: "container",
      styles: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        width: "100%",
        margin: "0",
      },
      children: [
        {
          id: `container-links-${baseId}`,
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            alignItems: "center",
            padding: "0",
            margin: "0",
            background: "transparent",
            flex: "1",
          },
          children: [
            {
              id: `text-l1-${baseId}`,
              type: "text",
              content: "Shop",
              styles: {
                margin: "0",
                fontWeight: "600",
                cursor: "pointer",
                color: "#64748b",
              },
            },
            {
              id: `text-l2-${baseId}`,
              type: "text",
              content: "Collections",
              styles: {
                margin: "0",
                fontWeight: "600",
                cursor: "pointer",
                color: "#64748b",
              },
            },
          ],
        },
        {
          id: `heading-logo-${baseId}`,
          type: "heading",
          content: "CENTER",
          styles: {
            margin: "0",
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "#0f172a",
            textAlign: "center",
            flex: "1",
          },
        },
        {
          id: `container-cta-${baseId}`,
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0",
            margin: "0",
            background: "transparent",
            flex: "1",
          },
          children: [
            {
              id: `button-cta-${baseId}`,
              type: "button",
              content: "Login",
              styles: {
                padding: "10px 20px",
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "600",
                cursor: "pointer",
                margin: "0",
              },
            },
          ],
        },
      ],
    }),
  },
  {
    id: "dark",
    name: "Dark Minimal",
    description: "Dark background, simple layout",
    getSchema: (baseId: number): ElementSchema => ({
      id: `container-nav-${baseId}`,
      type: "container",
      styles: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem 2rem",
        background: "#0f172a",
        width: "100%",
        margin: "0",
      },
      children: [
        {
          id: `heading-logo-${baseId}`,
          type: "heading",
          content: "Studio.",
          styles: {
            margin: "0",
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "2px",
          },
        },
        {
          id: `container-links-${baseId}`,
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "row",
            gap: "2.5rem",
            alignItems: "center",
            padding: "0",
            margin: "0",
            background: "transparent",
          },
          children: [
            {
              id: `text-l1-${baseId}`,
              type: "text",
              content: "Work",
              styles: {
                margin: "0",
                fontWeight: "400",
                cursor: "pointer",
                color: "#cbd5e1",
              },
            },
            {
              id: `text-l2-${baseId}`,
              type: "text",
              content: "Agency",
              styles: {
                margin: "0",
                fontWeight: "400",
                cursor: "pointer",
                color: "#cbd5e1",
              },
            },
            {
              id: `text-l3-${baseId}`,
              type: "text",
              content: "Contact",
              styles: {
                margin: "0",
                fontWeight: "400",
                cursor: "pointer",
                color: "#cbd5e1",
              },
            },
          ],
        },
      ],
    }),
  },
];

export default function EditorPage() {
  const location = useLocation();
  const initialData = location.state?.templateData as ElementSchema[] | null;

  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [pages, setPages] = useState<PageSchema[]>([
    { id: "page-1", name: "Home", elements: initialData || [] },
  ]);
  const [activePageId, setActivePageId] = useState<string>("page-1");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const findElement = (
    pagesList: PageSchema[],
    id: string,
  ): ElementSchema | null => {
    const searchRecursive = (
      elements: ElementSchema[],
    ): ElementSchema | null => {
      for (const el of elements) {
        if (el.id === id) return el;
        if (el.children) {
          const found = searchRecursive(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    for (const page of pagesList) {
      const found = searchRecursive(page.elements);
      if (found) return found;
    }
    return null;
  };

  const selectedElement =
    selectedIds.length === 1 ? findElement(pages, selectedIds[0]) : null;

  const updateElementStyle = (id: string, property: string, value: string) => {
    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements.map((el) => {
          if (el.id === id)
            return { ...el, styles: { ...el.styles, [property]: value } };
          if (el.children) return { ...el, children: updateRec(el.children) };
          return el;
        });
      };
      return prev.map((page) => ({
        ...page,
        elements: updateRec(page.elements),
      }));
    });
  };

  const removeElementRecursive = (
    elements: ElementSchema[],
    targetId: string,
  ): ElementSchema[] => {
    return elements
      .filter((el) => el.id !== targetId)
      .map((el) => ({
        ...el,
        children: el.children
          ? removeElementRecursive(el.children, targetId)
          : undefined,
      }));
  };

  const insertElementRecursive = (
    elements: ElementSchema[],
    targetId: string,
    elToAdd: ElementSchema,
  ): ElementSchema[] => {
    const targetIdx = elements.findIndex((el) => el.id === targetId);
    if (targetIdx !== -1) {
      const targetEl = elements[targetIdx];
      if (targetEl.type === "section" || targetEl.type === "container") {
        return elements.map((el, i) =>
          i === targetIdx
            ? { ...el, children: [...(el.children || []), elToAdd] }
            : el,
        );
      }
      const newEls = [...elements];
      newEls.splice(targetIdx, 0, elToAdd);
      return newEls;
    }
    return elements.map((el) => ({
      ...el,
      children: el.children
        ? insertElementRecursive(el.children, targetId, elToAdd)
        : undefined,
    }));
  };

  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    setPages((prev) => [
      ...prev,
      { id: newPageId, name: "New Page", elements: [] },
    ]);
    setActivePageId(newPageId);
  };

  const handleUpdatePageName = (id: string, name: string) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleAddSidebarElement = (elementType: ElementSchema["type"]) => {
    const uniqueId = `${elementType}-${crypto.randomUUID()}`;
    const newElement: ElementSchema = {
      id: uniqueId,
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
        display:
          elementType === "section" || elementType === "container"
            ? "flex"
            : "block",
        flexDirection: "column",
        gap: "1rem",
      },
      children:
        elementType === "section" || elementType === "container"
          ? []
          : undefined,
    };

    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? { ...p, elements: [...p.elements, newElement] }
          : p,
      ),
    );
    setSelectedIds([newElement.id]);

    setTimeout(() => {
      canvasRef.current?.scrollTo({
        top: canvasRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleAddTemplate = (template: ElementSchema) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? { ...p, elements: [...p.elements, template] }
          : p,
      ),
    );
    setSelectedIds([template.id]);
    setModalType(null);

    setTimeout(() => {
      canvasRef.current?.scrollTo({
        top: canvasRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setPages((prev) => {
      const delRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements
          .filter((el) => !selectedIds.includes(el.id))
          .map((el) => ({
            ...el,
            children: el.children ? delRec(el.children) : undefined,
          }));
      };
      return prev.map((page) => ({ ...page, elements: delRec(page.elements) }));
    });
    setSelectedIds([]);
  };

  const handleSelectElement = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
      );
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDragStartCanvas = (id: string, e: React.DragEvent) => {
    e.dataTransfer.setData("existing-id", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropCanvas = (pageId: string, e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(null);
    const existingId = e.dataTransfer.getData("existing-id");
    if (!existingId) return;
    const elToMove = findElement(pages, existingId);
    if (!elToMove) return;

    setPages((prev) => {
      const cleanedPages = prev.map((p) => ({
        ...p,
        elements: removeElementRecursive(p.elements, existingId),
      }));
      return cleanedPages.map((p) =>
        p.id === pageId ? { ...p, elements: [...p.elements, elToMove] } : p,
      );
    });
  };

  const handleDropOnElement = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(null);
    const existingId = e.dataTransfer.getData("existing-id");
    if (!existingId) return;
    const elementToAdd = findElement(pages, existingId);
    if (!elementToAdd) return;

    setPages((prev) => {
      const cleanedPages = prev.map((p) => ({
        ...p,
        elements: removeElementRecursive(p.elements, existingId),
      }));
      return cleanedPages.map((p) => ({
        ...p,
        elements: insertElementRecursive(p.elements, targetId, elementToAdd),
      }));
    });
  };

  if (isLoading) {
    return (
      <div className={styles.framerLoader}>
        <div className={styles.framerLogoIcon}></div>
        <div className={styles.framerTrack}>
          <div className={styles.framerProgress}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.editorLayout} onClick={() => setSelectedIds([])}>
        <EditorTopBar viewMode={viewMode} setViewMode={setViewMode} />
        <EditorSidebar
          onAddElement={handleAddSidebarElement}
          onOpenModal={setModalType}
        />
        <EditorCanvas
          pages={pages}
          activePageId={activePageId}
          viewMode={viewMode}
          isDraggingOver={isDraggingOver}
          canvasRef={canvasRef}
          selectedIds={selectedIds}
          onSetActivePage={setActivePageId}
          onUpdatePageName={handleUpdatePageName}
          onAddPage={handleAddPage}
          onDragOver={(pageId, e) => {
            e.preventDefault();
            setIsDraggingOver(pageId);
          }}
          onDragLeave={() => setIsDraggingOver(null)}
          onDropCanvas={handleDropCanvas}
          onSelectElement={handleSelectElement}
          onDragStartCanvas={handleDragStartCanvas}
          onDropOnElement={handleDropOnElement}
        />
        <EditorInspector
          selectedElement={selectedElement}
          selectedIdsCount={selectedIds.length}
          onUpdateStyle={updateElementStyle}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>

      {modalType === "navbar" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setModalType(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "800px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>
                Select a Navbar Template
              </h2>
              <button
                onClick={() => setModalType(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem",
              }}
            >
              {NAVBAR_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() =>
                    handleAddTemplate(template.getSchema(Date.now()))
                  }
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <h3
                    style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}
                  >
                    {template.name}
                  </h3>
                  <p
                    style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}
                  >
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

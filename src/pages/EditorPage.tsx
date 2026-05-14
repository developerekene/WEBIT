import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/EditorPage.module.css";
import type { ElementSchema } from "../engine/TemplateRenderer";
import { NAVBAR_TEMPLATES } from "../templates/navbarTemplates";

import EditorTopBar from "../components/editor/EditorTopBar";
import EditorSidebar from "../components/editor/EditorSidebar";
import EditorInspector from "../components/editor/EditorInspector";
import EditorCanvas, {
  type PageSchema,
} from "../components/editor/EditorCanvas";

type ViewMode = "desktop" | "tablet" | "mobile";

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

  const updateElementProp = (id: string, property: string, value: unknown) => {
    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements.map((el) => {
          if (el.id === id)
            return { ...el, [property]: value } as ElementSchema;
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
      newEls.splice(targetIdx + 1, 0, elToAdd);
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

  const handleAddNavbarLink = () => {
    if (selectedIds.length !== 1) return;
    const targetId = selectedIds[0];
    const newLink: ElementSchema = {
      id: `text-l-${Date.now()}`,
      type: "text",
      content: "New Link",
      styles: {
        margin: "0",
        fontWeight: "600",
        cursor: "pointer",
        color: "#64748b",
      },
    };

    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements.map((el) => {
          if (el.id === targetId && el.type === "container") {
            return { ...el, children: [...(el.children || []), newLink] };
          }
          if (el.children && el.children.some((c) => c.id === targetId)) {
            const targetIdx = el.children.findIndex((c) => c.id === targetId);
            const newChildren = [...el.children];
            newChildren.splice(targetIdx + 1, 0, newLink);
            return { ...el, children: newChildren };
          }
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
          onUpdateProp={updateElementProp}
          onDeleteSelected={handleDeleteSelected}
          onAddNavbarLink={handleAddNavbarLink}
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
                gridTemplateColumns: "1fr 1fr",
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

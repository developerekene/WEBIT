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
    <div className={styles.editorLayout} onClick={() => setSelectedIds([])}>
      <EditorTopBar viewMode={viewMode} setViewMode={setViewMode} />
      <EditorSidebar onAddElement={handleAddSidebarElement} />
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
  );
}

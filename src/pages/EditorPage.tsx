import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/EditorPage.module.css";
import {
  TemplateRenderer,
  type ElementSchema,
} from "../engine/TemplateRenderer";

import EditorTopBar from "../components/editor/EditorTopBar";
import EditorSidebar from "../components/editor/EditorSidebar";
import EditorInspector from "../components/editor/EditorInspector";
import EditorCanvas, {
  type PageSchema,
} from "../components/editor/EditorCanvas";
import { NAVBAR_TEMPLATES } from "../templates/NavbarTemplates";
import { HERO_TEMPLATES } from "../templates/heroTemplates";

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

  // --- NEW PREVIEW STATE ---
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const findElementAndParent = (
    pagesList: PageSchema[],
    id: string,
  ): { element: ElementSchema | null; parent: ElementSchema | null } => {
    let element: ElementSchema | null = null;
    let parent: ElementSchema | null = null;

    const searchRecursive = (
      elements: ElementSchema[],
      currentParent: ElementSchema | null,
    ): boolean => {
      for (const el of elements) {
        if (el.id === id) {
          element = el;
          parent = currentParent;
          return true;
        }
        if (el.children) {
          if (searchRecursive(el.children, el)) return true;
        }
      }
      return false;
    };
    for (const page of pagesList) {
      if (searchRecursive(page.elements, null)) break;
    }
    return { element, parent };
  };

  const { element: selectedElement, parent: parentElement } =
    selectedIds.length === 1
      ? findElementAndParent(pages, selectedIds[0])
      : { element: null, parent: null };

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

    const idsToDelete = new Set(selectedIds);

    const checkAndAddDropdownParent = (
      elements: ElementSchema[],
      parent: ElementSchema | null,
    ) => {
      for (const el of elements) {
        if (
          selectedIds.includes(el.id) &&
          parent &&
          parent.dropdownMode !== undefined
        ) {
          idsToDelete.add(parent.id);
        }
        if (el.children) {
          checkAndAddDropdownParent(el.children, el);
        }
      }
    };
    pages.forEach((page) => checkAndAddDropdownParent(page.elements, null));

    setPages((prev) => {
      const delRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements
          .filter((el) => !idsToDelete.has(el.id))
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

  const handleAddNavbarDropdown = () => {
    if (selectedIds.length !== 1) return;
    const targetId = selectedIds[0];
    const newDropdown: ElementSchema = {
      id: `dropdown-${Date.now()}`,
      type: "container",
      dropdownMode: "hover",
      styles: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
        height: "100%",
      },
      children: [
        {
          id: `dropdown-trigger-${Date.now()}`,
          type: "text",
          content: "Dropdown ▾",
          styles: {
            margin: "0",
            fontWeight: "600",
            color: "#64748b",
          },
        },
        {
          id: `dropdown-menu-${Date.now()}`,
          type: "container",
          styles: {
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "0.5rem 0",
            display: "flex",
            flexDirection: "column",
            minWidth: "150px",
            zIndex: "999",
            borderRadius: "8px",
            marginTop: "0.5rem",
          },
          children: [
            {
              id: `text-l-${Date.now()}-1`,
              type: "text",
              content: "Item 1",
              styles: {
                margin: "0",
                padding: "0.5rem 1.25rem",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "0.95rem",
              },
            },
            {
              id: `text-l-${Date.now()}-2`,
              type: "text",
              content: "Item 2",
              styles: {
                margin: "0",
                padding: "0.5rem 1.25rem",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "0.95rem",
              },
            },
          ],
        },
      ],
    };

    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements.map((el) => {
          if (el.id === targetId && el.type === "container") {
            return { ...el, children: [...(el.children || []), newDropdown] };
          }
          if (el.children && el.children.some((c) => c.id === targetId)) {
            const targetIdx = el.children.findIndex((c) => c.id === targetId);
            const newChildren = [...el.children];
            newChildren.splice(targetIdx + 1, 0, newDropdown);
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

  const handleTurnIntoDropdown = () => {
    if (selectedIds.length !== 1) return;
    const targetId = selectedIds[0];

    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        return elements.map((el) => {
          if (el.id === targetId && el.type === "text") {
            return {
              id: el.id, // keep the same ID so selection highlights remain
              type: "container",
              dropdownMode: "hover",
              styles: {
                display: "flex",
                alignItems: "center",
                position: "relative",
                cursor: "pointer",
                height: "100%",
              },
              children: [
                {
                  ...el,
                  id: `dropdown-trigger-${Date.now()}`,
                  content: `${el.content || "Link"} ▾`,
                  styles: { ...el.styles, margin: "0", padding: "0" },
                },
                {
                  id: `dropdown-menu-${Date.now()}`,
                  type: "container",
                  styles: {
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    padding: "0.5rem 0",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "150px",
                    zIndex: "999",
                    borderRadius: "8px",
                    marginTop: "0.5rem",
                  },
                  children: [
                    {
                      id: `text-l-${Date.now()}-1`,
                      type: "text",
                      content: "Sub Item 1",
                      styles: {
                        margin: "0",
                        padding: "0.5rem 1.25rem",
                        color: "#64748b",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      },
                    },
                    {
                      id: `text-l-${Date.now()}-2`,
                      type: "text",
                      content: "Sub Item 2",
                      styles: {
                        margin: "0",
                        padding: "0.5rem 1.25rem",
                        color: "#64748b",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                      },
                    },
                  ],
                },
              ],
            } as ElementSchema;
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

  const handleRemoveDropdown = (
    dropdownContainerId: string,
    triggerId: string,
  ) => {
    setPages((prev) => {
      const updateRec = (elements: ElementSchema[]): ElementSchema[] => {
        const result: ElementSchema[] = [];
        for (const el of elements) {
          if (el.id === dropdownContainerId && el.children) {
            const trigger = el.children.find((c) => c.id === triggerId);
            if (trigger) {
              result.push({
                ...trigger,
                id: dropdownContainerId,
                content: trigger.content?.replace(" ▾", "") || "Link",
              });
              continue;
            }
          }
          if (el.children) {
            result.push({ ...el, children: updateRec(el.children) });
          } else {
            result.push(el);
          }
        }
        return result;
      };
      return prev.map((page) => ({
        ...page,
        elements: updateRec(page.elements),
      }));
    });
    setSelectedIds([dropdownContainerId]);
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
    const elToMove = findElementAndParent(pages, existingId).element;
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
    const elementToAdd = findElementAndParent(pages, existingId).element;
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

  // --- NEW PREVIEW MODE RENDER ---
  if (isPreviewMode) {
    const activePage = pages.find((p) => p.id === activePageId);
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 99999,
          }}
        >
          <button
            onClick={() => setIsPreviewMode(false)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ✎ Back to Editor
          </button>
        </div>

        {/* Render the components just like a live site! No selectedIds passed means no blue borders */}
        <TemplateRenderer
          schema={activePage?.elements || []}
          selectedIds={[]}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.editorLayout} onClick={() => setSelectedIds([])}>
        <EditorTopBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onPreview={() => {
            setSelectedIds([]);
            setIsPreviewMode(true);
          }}
        />
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
          onUpdateProp={updateElementProp}
        />
        <EditorInspector
          selectedElement={selectedElement}
          parentElement={parentElement}
          selectedIdsCount={selectedIds.length}
          onUpdateStyle={updateElementStyle}
          onUpdateProp={updateElementProp}
          onDeleteSelected={handleDeleteSelected}
          onAddNavbarLink={handleAddNavbarLink}
          onAddNavbarDropdown={handleAddNavbarDropdown}
          onTurnIntoDropdown={handleTurnIntoDropdown}
          onRemoveDropdown={handleRemoveDropdown}
        />
      </div>

      {(modalType === "navbar" || modalType === "hero") && (
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
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                flexShrink: 0,
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>
                Select a {modalType === "navbar" ? "Navbar" : "Hero"} Template
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
                overflowY: "auto",
                paddingRight: "0.5rem",
              }}
            >
              {(modalType === "navbar" ? NAVBAR_TEMPLATES : HERO_TEMPLATES).map(
                (template) => (
                  <div
                    key={template.id}
                    onClick={() =>
                      handleAddTemplate(template.getSchema(Date.now()))
                    }
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
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
                    <img
                      src={template.image}
                      alt={template.name}
                      style={{
                        height: "120px",
                        width: "100%",
                        objectFit: "contain",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    />
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.1rem",
                          color: "#0f172a",
                        }}
                      >
                        {template.name}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#64748b",
                        }}
                      >
                        {template.description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

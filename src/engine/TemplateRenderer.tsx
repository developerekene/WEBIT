import React, { useState } from "react";

export type ElementSchema = {
  id: string;
  type:
    | "section"
    | "container"
    | "heading"
    | "text"
    | "button"
    | "image"
    | "video"
    | "divider"
    | "grid";
  styles?: React.CSSProperties;
  content?: string;
  src?: string;
  children?: ElementSchema[];
  dropdownMode?: "hover" | "click";
};

interface TemplateRendererProps {
  schema: ElementSchema[];
  selectedIds?: string[];
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onDragStart?: (id: string, e: React.DragEvent) => void;
  onDrop?: (targetId: string, e: React.DragEvent) => void;
  onUpdateProp?: (id: string, property: string, value: unknown) => void;
}

export const TemplateRenderer = ({
  schema,
  selectedIds = [],
  onSelect,
  onDragStart,
  onDrop,
  onUpdateProp,
}: TemplateRendererProps) => {
  const [hoveredIds, setHoveredIds] = useState<string[]>([]);
  const [clickedIds, setClickedIds] = useState<string[]>([]);

  const isDescendantSelected = (element: ElementSchema): boolean => {
    return (
      selectedIds.includes(element.id) ||
      !!element.children?.some(isDescendantSelected)
    );
  };

  const renderElement = (el: ElementSchema) => {
    const isSelected = selectedIds.includes(el.id);
    const isTextElement =
      el.type === "heading" || el.type === "text" || el.type === "button";
    const canEdit = isSelected && isTextElement;

    const isDropdownContainer = !!el.dropdownMode;
    const forceShow = isDescendantSelected(el);
    const isHovered = hoveredIds.includes(el.id);
    const isClicked = clickedIds.includes(el.id);
    const isVisible =
      forceShow || (el.dropdownMode === "hover" ? isHovered : isClicked);

    const mergedStyles: React.CSSProperties = {
      position: "relative",
      ...el.styles,
      boxShadow: isSelected
        ? "inset 0 0 0 2px #4f46e5, 0 4px 12px rgba(79, 70, 229, 0.15)"
        : el.styles?.boxShadow || "none",
      cursor: canEdit
        ? "text"
        : onSelect
          ? "pointer"
          : el.styles?.cursor || "default",
      transition: el.styles?.transition || "all 0.15s ease-in-out",
      outline: "none",
    };

    const handleClick = (e: React.MouseEvent) => {
      if (isDropdownContainer && el.dropdownMode === "click") {
        e.stopPropagation();
        setClickedIds((prev) =>
          prev.includes(el.id)
            ? prev.filter((id) => id !== el.id)
            : [...prev, el.id],
        );
      }
      if (onSelect) {
        e.stopPropagation();
        onSelect(el.id, e);
      }
    };

    const handleMouseEnter = () => {
      if (isDropdownContainer && el.dropdownMode === "hover") {
        setHoveredIds((prev) => [...prev, el.id]);
      }
    };

    const handleMouseLeave = () => {
      if (isDropdownContainer && el.dropdownMode === "hover") {
        setHoveredIds((prev) => prev.filter((id) => id !== el.id));
      }
    };

    const handleDragStart = (e: React.DragEvent) => {
      if (onDragStart && !canEdit) {
        e.stopPropagation();
        onDragStart(el.id, e);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      if (onDrop) {
        e.stopPropagation();
        onDrop(el.id, e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      if (onUpdateProp && e.currentTarget.innerText !== el.content) {
        onUpdateProp(el.id, "content", e.currentTarget.innerText);
      }
    };

    const commonProps = {
      key: el.id,
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      draggable: !!onDragStart && !canEdit,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      style: mergedStyles,
    };

    const textEditableProps = isTextElement
      ? {
          contentEditable: canEdit,
          suppressContentEditableWarning: true,
          onBlur: handleBlur,
        }
      : {};

    const renderChildren = () => {
      return el.children?.map((child, index) => {
        if (isDropdownContainer && index === 1) {
          if (!isVisible) return null;
        }
        return renderElement(child);
      });
    };

    switch (el.type) {
      case "section":
        return <section {...commonProps}>{renderChildren()}</section>;
      case "container":
        return <div {...commonProps}>{renderChildren()}</div>;
      case "heading":
        return (
          <h1 {...commonProps} {...textEditableProps}>
            {el.content}
          </h1>
        );
      case "text":
        return (
          <p {...commonProps} {...textEditableProps}>
            {el.content}
          </p>
        );
      case "button":
        return (
          <button {...commonProps} {...textEditableProps}>
            {el.content}
          </button>
        );
      case "image":
        return (
          <img
            {...commonProps}
            src={el.src || "https://placehold.co/600x400"}
            alt=""
          />
        );
      case "divider":
        return (
          <hr
            {...commonProps}
            style={{
              ...mergedStyles,
              width: "100%",
              borderTop: "1px solid #e2e8f0",
            }}
          />
        );
      default:
        return <div {...commonProps}>Unsupported Element</div>;
    }
  };

  return <>{schema.map(renderElement)}</>;
};

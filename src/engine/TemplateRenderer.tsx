import React from "react";

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
};

interface TemplateRendererProps {
  schema: ElementSchema[];
  selectedIds?: string[];
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onDragStart?: (id: string, e: React.DragEvent) => void;
  onDrop?: (targetId: string, e: React.DragEvent) => void;
}

export const TemplateRenderer = ({
  schema,
  selectedIds = [],
  onSelect,
  onDragStart,
  onDrop,
}: TemplateRendererProps) => {
  const renderElement = (el: ElementSchema) => {
    const isSelected = selectedIds.includes(el.id);

    const mergedStyles: React.CSSProperties = {
      ...el.styles,
      boxShadow: isSelected
        ? "inset 0 0 0 2px #4f46e5, 0 4px 12px rgba(79, 70, 229, 0.15)"
        : "none",
      cursor: onSelect ? "pointer" : "default",
      transition: "all 0.15s ease-in-out",
      position: "relative",
    };

    const handleClick = (e: React.MouseEvent) => {
      if (onSelect) {
        e.stopPropagation();
        onSelect(el.id, e);
      }
    };

    const handleDragStart = (e: React.DragEvent) => {
      if (onDragStart) {
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

    const commonProps = {
      key: el.id,
      onClick: handleClick,
      draggable: !!onDragStart,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      style: mergedStyles,
    };

    switch (el.type) {
      case "section":
        return (
          <section {...commonProps}>{el.children?.map(renderElement)}</section>
        );
      case "container":
        return <div {...commonProps}>{el.children?.map(renderElement)}</div>;
      case "heading":
        return <h1 {...commonProps}>{el.content}</h1>;
      case "text":
        return <p {...commonProps}>{el.content}</p>;
      case "button":
        return <button {...commonProps}>{el.content}</button>;
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

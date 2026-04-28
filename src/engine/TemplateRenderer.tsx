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
}

export const TemplateRenderer = ({
  schema,
  selectedIds = [],
  onSelect,
}: TemplateRendererProps) => {
  const renderElement = (el: ElementSchema) => {
    const isSelected = selectedIds.includes(el.id);

    const mergedStyles: React.CSSProperties = {
      ...el.styles,
      boxShadow: isSelected
        ? "inset 0 0 0 2px #4f46e5, 0 4px 12px rgba(79, 70, 229, 0.15)"
        : "none",
      backgroundColor: isSelected
        ? "rgba(79, 70, 229, 0.03)"
        : (el.styles?.backgroundColor as string) || "transparent",
      borderRadius: el.styles?.borderRadius || (isSelected ? "4px" : "0"),
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

    switch (el.type) {
      case "section":
        return (
          <section key={el.id} onClick={handleClick} style={mergedStyles}>
            {el.children?.map(renderElement)}
          </section>
        );
      case "container":
        return (
          <div key={el.id} onClick={handleClick} style={mergedStyles}>
            {el.children?.map(renderElement)}
          </div>
        );
      case "heading":
        return (
          <h1 key={el.id} onClick={handleClick} style={mergedStyles}>
            {el.content}
          </h1>
        );
      case "text":
        return (
          <p key={el.id} onClick={handleClick} style={mergedStyles}>
            {el.content}
          </p>
        );
      case "button":
        return (
          <button key={el.id} onClick={handleClick} style={mergedStyles}>
            {el.content}
          </button>
        );
      case "image":
        return (
          <img
            key={el.id}
            onClick={handleClick}
            src={el.src || "https://placehold.co/600x400"}
            style={mergedStyles}
            alt=""
          />
        );
      case "divider":
        return (
          <hr
            key={el.id}
            onClick={handleClick}
            style={{
              ...mergedStyles,
              width: "100%",
              borderTop: "1px solid #e2e8f0",
            }}
          />
        );
      default:
        return (
          <div key={el.id} onClick={handleClick} style={mergedStyles}>
            Unsupported Element
          </div>
        );
    }
  };

  return <>{schema.map(renderElement)}</>;
};

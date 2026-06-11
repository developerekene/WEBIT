/* eslint-disable @typescript-eslint/no-explicit-any */
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
    | "grid"
    | "carousel";
  styles?: React.CSSProperties;
  content?: string;
  src?: string;
  children?: ElementSchema[];
  dropdownMode?: string;
  carouselSettings?: {
    images: string[];
    arrows: boolean;
    indicators: boolean;
    animationMode: "slide" | "fade" | "wipe";
  };
};

interface TemplateRendererProps {
  schema: ElementSchema[];
  selectedIds?: string[];
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onDragStart?: (id: string, e: React.DragEvent) => void;
  onDrop?: (targetId: string, e: React.DragEvent) => void;
  onUpdateProp?: (id: string, property: string, value: unknown) => void;
}

const CarouselBlock = ({
  el,
  commonProps,
  renderElement,
}: {
  el: ElementSchema;
  commonProps: any;
  renderElement: (e: ElementSchema) => React.ReactNode;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const settings = el.carouselSettings || {
    images: [],
    arrows: true,
    indicators: true,
    animationMode: "fade",
  };
  const images =
    settings.images.length > 0
      ? settings.images
      : [
          "https://placehold.co/1200x600/e2e8f0/64748b?text=Add+Images+in+Inspector",
        ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getAnimationStyles = (idx: number): React.CSSProperties => {
    if (settings.animationMode === "fade") {
      return {
        opacity: idx === currentIndex ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
        zIndex: idx === currentIndex ? 2 : 1,
      };
    }
    if (settings.animationMode === "slide") {
      return {
        transform: `translateX(${(idx - currentIndex) * 100}%)`,
        transition: "transform 0.6s ease-in-out",
        zIndex: 1,
      };
    }
    if (settings.animationMode === "wipe") {
      return {
        clipPath:
          idx === currentIndex
            ? "inset(0 0 0 0)"
            : idx < currentIndex
              ? "inset(0 100% 0 0)"
              : "inset(0 0 0 100%)",
        transition: "clip-path 0.6s ease-in-out",
        zIndex: idx === currentIndex ? 2 : 1,
      };
    }
    return {};
  };

  return (
    <div
      {...commonProps}
      style={{
        ...commonProps.style,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            ...getAnimationStyles(idx),
          }}
        />
      ))}

      {/* Subtle Dark Overlay to Ensure Text is Readable */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 5,
        }}
      />

      {/* Editor Content / Children Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: el.styles?.flexDirection || "column",
          justifyContent: el.styles?.justifyContent || "center",
          alignItems: el.styles?.alignItems || "center",
          gap: el.styles?.gap,
        }}
      >
        {el.children?.map(renderElement)}
      </div>

      {/* Left/Right Arrows */}
      {settings.arrows && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor: "pointer",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor: "pointer",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Bottom Indicators */}
      {settings.indicators && (
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            gap: "10px",
          }}
        >
          {images.map((_, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background:
                  idx === currentIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TemplateRenderer = ({
  schema,
  selectedIds = [],
  onSelect,
  onDragStart,
  onDrop,
  onUpdateProp,
}: TemplateRendererProps) => {
  const renderElement = (el: ElementSchema) => {
    const isSelected = selectedIds.includes(el.id);
    const isTextElement =
      el.type === "heading" || el.type === "text" || el.type === "button";
    const canEdit = isSelected && isTextElement;

    const mergedStyles: React.CSSProperties = {
      position: "relative",
      ...el.styles,
      boxShadow: isSelected
        ? "inset 0 0 0 2px #4f46e5, 0 4px 12px rgba(79, 70, 229, 0.15)"
        : el.styles?.boxShadow || "none",
      cursor: canEdit ? "text" : onSelect ? "pointer" : "default",
      transition: "all 0.15s ease-in-out",
      outline: "none",
    };

    const handleClick = (e: React.MouseEvent) => {
      if (onSelect) {
        e.stopPropagation();
        onSelect(el.id, e);
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

    switch (el.type) {
      case "section":
        return (
          <section {...commonProps}>{el.children?.map(renderElement)}</section>
        );
      case "container":
        return <div {...commonProps}>{el.children?.map(renderElement)}</div>;
      case "carousel":
        return (
          <CarouselBlock
            el={el}
            commonProps={commonProps}
            renderElement={renderElement}
          />
        );
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

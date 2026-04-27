import React from "react";

export type ElementSchema = {
  id: string;
  type: "section" | "container" | "heading" | "text" | "button" | "image";
  styles?: React.CSSProperties;
  content?: string;
  src?: string;
  children?: ElementSchema[];
};

export const TemplateRenderer = ({ schema }: { schema: ElementSchema[] }) => {
  const renderElement = (el: ElementSchema) => {
    switch (el.type) {
      case "section":
        return (
          <section key={el.id} style={el.styles}>
            {el.children?.map(renderElement)}
          </section>
        );
      case "container":
        return (
          <div key={el.id} style={el.styles}>
            {el.children?.map(renderElement)}
          </div>
        );
      case "heading":
        return (
          <h1 key={el.id} style={el.styles}>
            {el.content}
          </h1>
        );
      case "text":
        return (
          <p key={el.id} style={el.styles}>
            {el.content}
          </p>
        );
      case "button":
        return (
          <button key={el.id} style={el.styles}>
            {el.content}
          </button>
        );
      case "image":
        return <img key={el.id} src={el.src} style={el.styles} alt="" />;
      default:
        return null;
    }
  };

  return <>{schema.map(renderElement)}</>;
};

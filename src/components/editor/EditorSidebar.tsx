import styles from "../../styles/EditorPage.module.css";
import type { ElementSchema } from "../../engine/TemplateRenderer";

const BASIC_ELEMENTS = [
  { id: "section", label: "Section", icon: "🔲" },
  { id: "container", label: "Container", icon: "📦" },
  { id: "heading", label: "Heading", icon: "T" },
  { id: "text", label: "Text", icon: "📄" },
  { id: "image", label: "Image", icon: "🖼️" },
  { id: "button", label: "Button", icon: "🔘" },
  { id: "divider", label: "Divider", icon: "➖" },
];

export default function EditorSidebar({
  onAddElement,
}: {
  onAddElement: (t: ElementSchema["type"]) => void;
}) {
  return (
    <aside className={styles.leftPanel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.panelHeader}>Add Elements</div>
      <div className={styles.elementGrid}>
        {BASIC_ELEMENTS.map((el) => (
          <div
            key={el.id}
            className={styles.elementItem}
            onClick={() => onAddElement(el.id as ElementSchema["type"])}
            style={{ cursor: "pointer" }}
          >
            <span style={{ fontSize: "1.5rem" }}>{el.icon}</span>
            {el.label}
          </div>
        ))}
      </div>
    </aside>
  );
}

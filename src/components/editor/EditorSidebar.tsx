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
  onOpenModal,
}: {
  onAddElement: (t: ElementSchema["type"]) => void;
  onOpenModal: (type: string) => void;
}) {
  return (
    <aside className={styles.leftPanel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.panelHeader}>Basic Elements</div>
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

      <div className={styles.panelHeader} style={{ marginTop: "1rem" }}>
        Pre-built Blocks
      </div>
      <div className={styles.elementGrid}>
        <div
          className={styles.elementItem}
          onClick={() => onOpenModal("navbar")}
          style={{
            cursor: "pointer",
            gridColumn: "1 / -1",
            flexDirection: "row",
            padding: "1rem",
            justifyContent: "flex-start",
            gap: "1rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🧭</span>
          <div>
            <div style={{ color: "#0f172a", fontWeight: "bold" }}>Navbars</div>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: "normal",
                marginTop: "4px",
              }}
            >
              Browse navbar templates
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

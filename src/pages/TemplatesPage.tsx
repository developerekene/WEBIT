import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/TemplatesPage.module.css";
import { TemplateRenderer } from "../engine/TemplateRenderer";
import { TEMPLATE_DATA, CATEGORIES, type Template } from "../data/templates";

type ViewMode = "desktop" | "tablet" | "mobile";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  const filteredTemplates = TEMPLATE_DATA.filter(
    (tpl) =>
      (filter === "All" || tpl.category === filter) &&
      tpl.name.toLowerCase().includes(search.toLowerCase()),
  );

  const closeModal = () => {
    setPreviewTemplate(null);
    setViewMode("desktop");
  };

  const handleUseTemplate = (template: Template) => {
    navigate("/editor", { state: { templateData: template.schema } });
  };

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Choose your foundation.</h1>
          <p>Select a professional template to jumpstart your WEBIT project.</p>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.activeFilter : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredTemplates.map((tpl) => (
            <article key={tpl.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={tpl.img} alt={tpl.name} />
                <div className={styles.overlay}>
                  <button
                    className={styles.previewBtn}
                    onClick={() => setPreviewTemplate(tpl)}
                  >
                    Preview Template
                  </button>
                  <button
                    className={styles.selectBtn}
                    onClick={() => handleUseTemplate(tpl)}
                  >
                    Use this Template
                  </button>
                </div>
              </div>

              <div className={styles.cardInfo}>
                <div>
                  <h3>{tpl.name}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {tpl.category}
                  </span>
                </div>
                <span className={styles.tag}>{tpl.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {previewTemplate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h2>{previewTemplate.name}</h2>
              </div>

              <div className={styles.deviceToggles}>
                <button
                  className={`${styles.deviceBtn} ${viewMode === "desktop" ? styles.active : ""}`}
                  onClick={() => setViewMode("desktop")}
                >
                  Web
                </button>
                <button
                  className={`${styles.deviceBtn} ${viewMode === "tablet" ? styles.active : ""}`}
                  onClick={() => setViewMode("tablet")}
                >
                  Tablet
                </button>
                <button
                  className={`${styles.deviceBtn} ${viewMode === "mobile" ? styles.active : ""}`}
                  onClick={() => setViewMode("mobile")}
                >
                  Mobile
                </button>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.selectBtn}
                  style={{ width: "auto", padding: "0.6rem 1.5rem" }}
                  onClick={() => handleUseTemplate(previewTemplate)}
                >
                  Use Template
                </button>
                <button
                  className={styles.closeBtn}
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.previewArea}>
              <div
                className={`${styles.videoWrapper} ${styles[`${viewMode}View`]}`}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    background: "#ffffff",
                  }}
                >
                  <TemplateRenderer schema={previewTemplate.schema} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

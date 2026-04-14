import { useState } from "react";
import styles from "../styles/TemplatesPage.module.css";

const TEMPLATE_DATA = [
  {
    id: "saas-1",
    name: "SaaS Alpha",
    category: "Landing",
    tag: "Popular",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
  {
    id: "port-1",
    name: "Dark Masonry",
    category: "Portfolio",
    tag: "Creative",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
  {
    id: "bio-1",
    name: "Minimal Bio",
    category: "Links",
    tag: "Free",
    img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
  {
    id: "biz-1",
    name: "Consultant Pro",
    category: "Business",
    tag: "New",
    img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
  {
    id: "saas-2",
    name: "Fintech Flow",
    category: "Landing",
    tag: "Premium",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
  {
    id: "port-2",
    name: "Studio Gallery",
    category: "Portfolio",
    tag: "Clean",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    videos: {
      desktop: "https://www.w3schools.com/html/mov_bbb.mp4",
      tablet: "https://www.w3schools.com/html/mov_bbb.mp4",
      mobile: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  },
];

const CATEGORIES = ["All", "Landing", "Portfolio", "Business", "Links"];

type ViewMode = "desktop" | "tablet" | "mobile";

export default function TemplatesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Modal State
  const [previewTemplate, setPreviewTemplate] = useState<
    (typeof TEMPLATE_DATA)[0] | null
  >(null);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  const filteredTemplates = TEMPLATE_DATA.filter(
    (tpl) =>
      (filter === "All" || tpl.category === filter) &&
      tpl.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Close modal helper
  const closeModal = () => {
    setPreviewTemplate(null);
    setViewMode("desktop"); // reset to default
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
                  {/* Trigger Modal */}
                  <button
                    className={styles.previewBtn}
                    onClick={() => setPreviewTemplate(tpl)}
                  >
                    Preview Template
                  </button>
                  <button className={styles.selectBtn}>
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

      {/* --- PREVIEW MODAL --- */}
      {previewTemplate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          {/* Stop propagation so clicking inside the modal doesn't close it */}
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
                {/* The key prop forces the video element to remount and autoplay when switching views */}
                <video
                  key={`${previewTemplate.id}-${viewMode}`}
                  src={previewTemplate.videos[viewMode]}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

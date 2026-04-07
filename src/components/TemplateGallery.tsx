import styles from "../styles/TemplateGallery.module.css";

const TEMPLATES = [
  {
    id: 1,
    name: "SaaS Landing",
    tag: "popular",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Creator Portfolio",
    tag: "personal",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Agency Canvas",
    tag: "business",
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  },
];

export default function TemplateGallery() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2>Start with a masterpiece.</h2>
          <p>
            Don't stare at a blank canvas. Begin with designer-made foundations.
          </p>
        </div>
        <a href="#" className={styles.viewAll}>
          View All Templates <span>↗</span>
        </a>
      </div>

      <div className={styles.grid}>
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className={styles.card}>
            <div className={styles.imageArea}>
              <img src={tpl.image} alt={tpl.name} />
            </div>
            <div className={styles.info}>
              <span className={styles.templateName}>{tpl.name}</span>
              <span className={styles.tag}>{tpl.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

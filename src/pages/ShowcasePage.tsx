import styles from "../styles/ShowcasePage.module.css";

const SHOWCASE_DATA = [
  {
    id: "drop-img",
    title: "Drop Img",
    creator: "@developerekene",
    category: "SaaS",
    image:
      "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1200",
    link: "#",
  },
  {
    id: "fixam",
    title: "FixAm Marketplace",
    creator: "@developerekene",
    category: "Marketplace",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200",
    link: "#",
  },
  {
    id: "nns",
    title: "Nigerian Nursing Success",
    creator: "@developerekene",
    category: "EdTech",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200",
    link: "#",
  },
  {
    id: "studio-k",
    title: "Studio K",
    creator: "@creative_k",
    category: "Portfolio",
    image:
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=1200",
    link: "#",
  },
  {
    id: "lumina",
    title: "Lumina Analytics",
    creator: "@data_flow",
    category: "Dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
    link: "#",
  },
  {
    id: "nomad",
    title: "Nomad Coffee",
    creator: "@brew_master",
    category: "E-commerce",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200",
    link: "#",
  },
];

export default function ShowcasePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Built with WEBIT.</h1>
        <p>
          Explore high-performance websites, portfolios, and applications
          created by our community using our kinetic engine.
        </p>
      </header>

      <div className={styles.grid}>
        {SHOWCASE_DATA.map((project) => (
          <article key={project.id} className={styles.card}>
            <img
              src={project.image}
              alt={project.title}
              className={styles.cardImage}
            />

            <span className={styles.categoryTag}>{project.category}</span>

            <div className={styles.overlay}>
              <div className={styles.overlayHeader}>
                <div className={styles.details}>
                  <h3>{project.title}</h3>
                  <p>
                    Built by{" "}
                    <span className={styles.creatorHighlight}>
                      {project.creator}
                    </span>
                  </p>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitBtn}
                >
                  Visit Site
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.ctaSection}>
        <h2>Did you build something amazing?</h2>
        <p>
          Submit your project to be featured in our showcase and inspire others.
        </p>
        <button className={styles.submitBtn}>Submit your website</button>
      </div>
    </div>
  );
}

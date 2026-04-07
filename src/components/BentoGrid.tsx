import styles from "../styles/BentoGrid.module.css";

export default function BentoGrid() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>Everything you need, nothing you don't.</h2>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.clickEdit}`}>
          <h3 className={styles.cardTitle}>Click-to-Edit Content</h3>
          <p className={styles.cardDesc}>
            Double-click any text to start typing. Formatting is preserved
            perfectly.
          </p>
          <div className={styles.visualArea}>
            <div className={styles.editMock}>
              <span className={styles.badge}>EDITING</span>
              <div style={{ color: "#1e293b", fontWeight: 600 }}>
                Editable Heading Text
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.exportJson}`}>
          <h3 className={styles.cardTitle}>Export to JSON</h3>
          <p className={styles.cardDesc}>
            Full portability. Your design, as clean structured data.
          </p>
          <div
            className={styles.visualArea}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "3rem", opacity: 0.3 }}>{`{ }`}</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.responsive}`}>
          <h3 className={styles.cardTitle}>Responsive by Default</h3>
          <p className={styles.cardDesc}>
            Design once, run everywhere. We handle the breakpoints.
          </p>
          <div className={styles.visualArea}>
            <div
              style={{
                width: "80%",
                height: "150px",
                background: "white",
                borderRadius: "8px 8px 0 0",
                margin: "0 auto",
              }}
            ></div>
            <div
              style={{
                width: "40%",
                height: "100px",
                background: "#0f172a",
                borderRadius: "12px",
                position: "absolute",
                bottom: "-20px",
                right: "10px",
                border: "4px solid #1e293b",
              }}
            ></div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.theming}`}>
          <h3 className={styles.cardTitle}>Global Theming</h3>
          <p className={styles.cardDesc}>
            Swap your entire brand identity in a single click without
            refreshing.
          </p>
          <div className={styles.swatches}>
            <div
              className={styles.swatch}
              style={{ background: "#4f46e5" }}
            ></div>
            <div
              className={styles.swatch}
              style={{ background: "#7c3aed" }}
            ></div>
            <div
              className={styles.swatch}
              style={{ background: "#f472b6" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

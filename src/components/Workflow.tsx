import styles from "../styles/Workflow.module.css";

export default function Workflow() {
  return (
    <section className={styles.container}>
      {/* Block Management Row */}
      <div className={styles.row}>
        <div className={styles.content}>
          <h2>Build with Blocks, not Divs.</h2>
          <p>
            Select from a library of pre-designed, responsive sections. Drag
            them up or down to create your perfect layout. Forget technical
            debt, focus on the message.
          </p>
          <a href="#" className={styles.link}>
            Browse Block Library →
          </a>
        </div>

        <div className={styles.visual}>
          <div className={styles.mockupContainer}>
            <div className={styles.sectionList}>
              <div className={styles.sectionItem}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span>⠿</span> Hero Navigation
                </div>
                <span>👁</span>
              </div>
              <div className={`${styles.sectionItem} ${styles.activeItem}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span>⠿</span> Feature Grid (Current)
                </div>
                <span>✎</span>
              </div>
              <div className={styles.sectionItem}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span>⠿</span> Call to Action
                </div>
                <span>⚙</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Switching Row */}
      <div className={`${styles.row} ${styles.rowReverse}`}>
        <div className={styles.content}>
          <h2>Change the vibe in one click.</h2>
          <p>
            Swap out color palettes and typography pairings globally. No more
            hunting down CSS classes. Preview your brand in different moods
            instantly.
          </p>
          <a href="#" className={styles.link}>
            Explore Design Tokens
          </a>
        </div>

        <div className={styles.visual}>
          <div className={styles.themeEditor}>
            <div className={styles.themeHeader}>
              Theme Editor <span style={{ color: "#ef4444" }}>●</span>
            </div>
            <div className={styles.themeGrid}>
              <div className={`${styles.themeOption} ${styles.activeTheme}`}>
                <div
                  className={styles.swatch}
                  style={{ background: "#4f46e5" }}
                ></div>
                Ocean Night
              </div>
              <div className={styles.themeOption}>
                <div
                  className={styles.swatch}
                  style={{ background: "#f97316" }}
                ></div>
                Sunset Glow
              </div>
              <div className={styles.themeOption}>
                <div
                  className={styles.swatch}
                  style={{ background: "#10b981" }}
                ></div>
                Forest Deep
              </div>
              <div className={styles.themeOption}>
                <div
                  className={styles.swatch}
                  style={{ background: "#1f2937" }}
                ></div>
                Monochrome
              </div>
            </div>
            <div className={styles.previewArea}>Interactive Preview Area</div>
          </div>
        </div>
      </div>
    </section>
  );
}

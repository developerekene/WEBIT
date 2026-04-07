import styles from "../styles/AnimatedDragDrop.module.css";

export default function AnimatedDragDrop() {
  return (
    <section className={styles.container}>
      <div className={styles.browserMockup}>
        <div className={styles.topBar}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>

        <div className={styles.editorArea}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarLabel}>Layout Blocks</div>

            <div className={styles.sidebarBlockGhost}></div>
            <div className={styles.sidebarBlockGhost}></div>
            <div className={styles.sidebarBlockGhost}></div>
          </div>

          <div className={styles.canvas}>
            <div className={styles.canvasBg}></div>
          </div>

          <div className={`${styles.baseDraggable} ${styles.draggableText}`}>
            <span
              style={{
                position: "absolute",
                animation: `${styles.revealUISequence} 12s infinite reverse`,
              }}
            >
              T Hero Text
            </span>
            <div className={styles.expandedTextUI}>
              <div className={styles.textHeading}>
                <div className={styles.editCursor}></div>{" "}
              </div>
              <div className={styles.textSub}></div>
            </div>
          </div>

          <div
            className={`${styles.baseDraggable} ${styles.draggableImage}`}
            style={{ backgroundColor: "var(--primary-violet)" }}
          >
            <span
              style={{
                position: "absolute",
                animation: `${styles.revealImageUISequence} 12s infinite reverse`,
              }}
            >
              🖼️ Image Block
            </span>
            <div className={styles.expandedImageUI}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          </div>

          <div className={styles.cursor}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.76 21.36L11.44 17.11C11.66 16.91 11.95 16.8 12.25 16.8H18.5C19.14 16.8 19.5 16.03 19.07 15.56L6.57 2.05C6.15 1.59 5.5 1.88 5.5 2.5V3.21Z"
                fill="#111827"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

import styles from "../styles/Hero.module.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.textContent}>
        <h1 className={styles.title}>
          Build the web.
          <br />
          Without the <span className={styles.highlight}>friction.</span>
        </h1>

        <p className={styles.subtitle}>
          Skip the boilerplate. Assemble stunning, highly-performant React
          applications at the speed of thought using our kinetic block builder.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/editor">
            <button className={styles.primaryBtn}>Open the Editor</button>
          </Link>
          <Link to="/templates">
            <button className={styles.secondaryBtn}>View Templates</button>
          </Link>
        </div>
      </div>

      <div className={styles.visualContent}>
        <div className={styles.browserFrame}>
          <div className={styles.browserHeader}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>

          <div className={styles.svgContainer}>
            <svg
              viewBox="0 0 600 450"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="600" height="450" fill="#e2e8f0" />

              <rect x="0" y="0" width="160" height="450" fill="#ffffff" />
              <line
                x1="160"
                y1="0"
                x2="160"
                y2="450"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              <rect
                x="20"
                y="20"
                width="80"
                height="12"
                rx="4"
                fill="#cbd5e1"
              />

              <rect
                x="20"
                y="60"
                width="120"
                height="40"
                rx="6"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <rect
                x="20"
                y="110"
                width="120"
                height="40"
                rx="6"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <rect
                x="20"
                y="160"
                width="120"
                height="40"
                rx="6"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <rect
                x="20"
                y="210"
                width="120"
                height="40"
                rx="6"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              <rect x="160" y="0" width="440" height="450" fill="#f8fafc" />

              <rect
                x="200"
                y="40"
                width="360"
                height="60"
                rx="8"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <rect
                x="220"
                y="65"
                width="100"
                height="10"
                rx="4"
                fill="#e2e8f0"
              />
              <rect
                x="500"
                y="65"
                width="40"
                height="10"
                rx="4"
                fill="#e2e8f0"
              />

              <rect
                x="200"
                y="120"
                width="360"
                height="140"
                rx="8"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <rect
                x="280"
                y="150"
                width="200"
                height="20"
                rx="4"
                fill="#e2e8f0"
              />
              <rect
                x="310"
                y="180"
                width="140"
                height="12"
                rx="4"
                fill="#f1f5f9"
              />
              <rect
                x="330"
                y="200"
                width="100"
                height="12"
                rx="4"
                fill="#f1f5f9"
              />

              <rect
                className={styles.dropIndicator}
                x="320"
                y="240"
                width="120"
                height="40"
                rx="6"
                fill="#eef2ff"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              <g className={styles.droppedElement}>
                <rect
                  x="320"
                  y="240"
                  width="120"
                  height="40"
                  rx="6"
                  fill="#4f46e5"
                />
                <rect
                  x="350"
                  y="256"
                  width="60"
                  height="8"
                  rx="4"
                  fill="#ffffff"
                />
              </g>

              <g className={styles.dragGroup}>
                <rect
                  x="20"
                  y="160"
                  width="120"
                  height="40"
                  rx="6"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <rect
                  x="50"
                  y="176"
                  width="60"
                  height="8"
                  rx="4"
                  fill="#4f46e5"
                />

                <path
                  d="M70 175 L85 200 L78 200 L85 215 L80 217 L72 202 L65 210 Z"
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

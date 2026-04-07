import styles from "../styles/LogoMarquee.module.css";

const LOGO_NAMES = [
  "VANTAGE",
  "PRISM",
  "ORBIT",
  "FLUX",
  "NEXUS",
  "AETHER",
  "ZEPHYR",
];

export default function LogoMarquee() {
  const doubleLogos = [...LOGO_NAMES, ...LOGO_NAMES];

  return (
    <div className={styles.marqueeContainer}>
      <p className={styles.label}>Trusted by next-gen creators and startups</p>

      <div className={styles.marqueeWrapper}>
        <div className={styles.track}>
          {doubleLogos.map((name, index) => (
            <span key={index} className={styles.logoText}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

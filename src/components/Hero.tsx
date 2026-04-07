import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.badge}>
        <span>✨</span> WEBIT MVP IS LIVE!
      </div>

      <h1 className={styles.title}>
        Drag. Drop. Done.
        <br />
        Your website,
        <br />
        <span className={styles.highlight}>instantly.</span>
      </h1>

      <p className={styles.subtitle}>
        Skip the code. Assemble stunning, responsive sites at the speed of
        thought with our visual block builder.
      </p>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryBtn}>Start Building for Free</button>
        <button className={styles.secondaryBtn}>Explore Templates</button>
      </div>
    </section>
  );
}

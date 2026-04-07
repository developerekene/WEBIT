import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.container}>
      {/* Final CTA Section */}
      <div className={styles.ctaCard}>
        <h2>Ready to launch your idea?</h2>
        <p>
          Join 10,000+ creators building the kinetic web with WEBIT. No
          subscription required to start.
        </p>
        <button className={styles.mainBtn}>Open the Editor — It's Free</button>
      </div>

      {/* Main Footer Links */}
      <div className={styles.footerGrid}>
        <div className={styles.brandCol}>
          <h3 style={{ fontWeight: 800, letterSpacing: "-0.05em" }}>WEBIT</h3>
          <p>
            The Luminous Canvas for Modern Creators. Built for the kinetic web.
          </p>
          <div className={styles.socials}>
            <span>🔗</span> <span>@</span>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Product</h4>
          <div className={styles.links}>
            <a href="#">Features</a>
            <a href="#">Templates</a>
            <a href="#">Showcase</a>
            <a href="#">Pricing</a>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Resources</h4>
          <div className={styles.links}>
            <a href="#">Documentation</a>
            <a href="#">Community</a>
            <a href="#">Twitter</a>
            <a href="#">Discord</a>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Legal</h4>
          <div className={styles.links}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 WEBIT. The Luminous Canvas for Modern Creators.
      </div>
    </footer>
  );
}

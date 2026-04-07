import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>WEBIT</div>

      <div className={styles.navLinks}>
        <a href="#features" className={styles.link}>
          Features
        </a>
        <a href="#templates" className={styles.link}>
          Templates
        </a>
        <a href="#showcase" className={styles.link}>
          Showcase
        </a>
        <a href="#pricing" className={styles.link}>
          Pricing
        </a>
      </div>

      <div className={styles.actions}>
        <button className={styles.loginBtn}>Log in</button>
        <button className={styles.ctaBtn}>Go to Editor</button>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        WEBIT
      </Link>

      <div className={styles.navLinks}>
        <Link to="/features" className={styles.link}>
          Features
        </Link>
        <Link to="/templates" className={styles.link}>
          Templates
        </Link>
        <Link to="/showcase" className={styles.link}>
          Showcase
        </Link>
        {/* <a href="#showcase" className={styles.link}>
          Showcase
        </a> */}
        <a href="#pricing" className={styles.link}>
          Pricing
        </a>
      </div>

      <div className={styles.actions}>
        <button className={styles.loginBtn}>Log in</button>
        <button className={styles.ctaBtn} onClick={() => navigate("/editor")}>
          Go to Editor
        </button>
      </div>
    </nav>
  );
}

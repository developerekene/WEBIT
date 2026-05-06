import { useEffect, useRef } from "react";
import styles from "../styles/FeaturesPage.module.css";

const FEATURES = [
  {
    id: "wysiwyg",
    icon: "🖱️",
    title: "True WYSIWYG Editing",
    description:
      "Click, type, and drag. What you see on the canvas is exactly what your users get. No abstract representations.",
  },
  {
    id: "json",
    icon: "📦",
    title: "Clean JSON Export",
    description:
      "Never get locked in. Export your entire site structure and content as clean, portable JSON data anytime.",
  },
  {
    id: "responsive",
    icon: "📱",
    title: "Responsive by Default",
    description:
      "Design once. Our engine automatically handles breakpoints, ensuring your site looks perfect on desktop, tablet, and mobile.",
  },
  {
    id: "themes",
    icon: "🎨",
    title: "Global Theming Engine",
    description:
      "Swap color palettes, typography, and spacing globally with a single click. Maintain brand consistency effortlessly.",
  },
  {
    id: "blocks",
    icon: "🧱",
    title: "Pre-designed Blocks",
    description:
      "Don’t start from scratch. Assemble your page using a library of high-converting, designer-made component blocks.",
  },
  {
    id: "code",
    icon: "⚡",
    title: "React Under the Hood",
    description:
      "Powered by modern React. Output is optimized for speed, performance, and modern web standards.",
  },
];

export default function FeaturesPage() {
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          Everything you need. <br /> Nothing you don't.
        </h1>
        <p>
          WEBIT provides a streamlined toolset designed specifically for kinetic
          web creation without the bloat.
        </p>
      </header>

      <div>
        {FEATURES.map((feature, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={feature.id}
              ref={addToRefs}
              className={`
                ${styles.featureRow} 
                ${!isEven ? styles.rowReverse : ""} 
                ${isEven ? styles.slideLeft : styles.slideRight}
              `}
            >
              <div className={styles.textContent}>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>

              <div className={styles.visualContent}>{feature.icon}</div>
            </div>
          );
        })}
      </div>

     
    </div>
  );
}

import type { ElementSchema } from "../engine/TemplateRenderer";

export type Template = {
  id: string;
  name: string;
  category: string;
  tag: string;
  img: string;
  schema: ElementSchema[];
};

export const TEMPLATE_DATA: Template[] = [
  {
    id: "saas-1",
    name: "SaaS Alpha",
    category: "Landing",
    tag: "Popular",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    schema: [
      {
        id: "header-1",
        type: "section",
        styles: {
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        },
        children: [
          {
            id: "logo",
            type: "heading",
            content: "AlphaUI",
            styles: {
              fontSize: "1.25rem",
              fontWeight: 800,
              margin: 0,
              color: "#0f172a",
            },
          },
          {
            id: "nav",
            type: "container",
            styles: { display: "flex", gap: "1.5rem" },
            children: [
              {
                id: "nav-item-1",
                type: "container",
                styles: {
                  width: "40px",
                  height: "8px",
                  background: "#e2e8f0",
                  borderRadius: "4px",
                },
              },
              {
                id: "nav-item-2",
                type: "container",
                styles: {
                  width: "40px",
                  height: "8px",
                  background: "#e2e8f0",
                  borderRadius: "4px",
                },
              },
            ],
          },
        ],
      },
      {
        id: "hero-1",
        type: "section",
        styles: {
          padding: "6rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          background: "#f8fafc",
          minHeight: "80vh",
        },
        children: [
          {
            id: "badge",
            type: "text",
            content: "Data-Driven Engine",
            styles: {
              background: "#e0e7ff",
              color: "#4f46e5",
              padding: "0.25rem 1rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            },
          },
          {
            id: "title",
            type: "heading",
            content: "Build the future with SaaS Alpha.",
            styles: {
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
            },
          },
          {
            id: "desc",
            type: "text",
            content:
              "This entire page is rendered directly from a JSON object. Ready to be edited in the WEBIT engine.",
            styles: {
              color: "#64748b",
              maxWidth: "600px",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            },
          },
          {
            id: "actions",
            type: "container",
            styles: {
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            },
            children: [
              {
                id: "btn-primary",
                type: "button",
                content: "Start Building",
                styles: {
                  padding: "1rem 2.5rem",
                  background: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                },
              },
              {
                id: "btn-sec",
                type: "button",
                content: "View Documentation",
                styles: {
                  padding: "1rem 2.5rem",
                  background: "white",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  borderRadius: "999px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "port-dev-1",
    name: "Minimal Developer",
    category: "Portfolio",
    tag: "Clean",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
    schema: [
      {
        id: "port-nav",
        type: "section",
        styles: {
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
        },
        children: [
          {
            id: "port-logo",
            type: "heading",
            content: "DevFolio.",
            styles: {
              fontSize: "1.5rem",
              fontWeight: 800,
              margin: 0,
              color: "#0f172a",
              letterSpacing: "-0.05em",
            },
          },
          {
            id: "port-links",
            type: "container",
            styles: {
              display: "flex",
              gap: "2rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#64748b",
            },
            children: [
              {
                id: "link-1",
                type: "text",
                content: "About",
                styles: { margin: 0, cursor: "pointer" },
              },
              {
                id: "link-2",
                type: "text",
                content: "Work",
                styles: { margin: 0, cursor: "pointer" },
              },
              {
                id: "link-3",
                type: "text",
                content: "Contact",
                styles: { margin: 0, cursor: "pointer" },
              },
            ],
          },
        ],
      },
      {
        id: "port-about",
        type: "section",
        styles: {
          padding: "8rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background: "#ffffff",
          maxWidth: "900px",
          margin: "0 auto",
        },
        children: [
          {
            id: "about-greeting",
            type: "text",
            content: "👋 Hi, I'm a Frontend Engineer",
            styles: {
              color: "#4f46e5",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "1rem",
            },
          },
          {
            id: "about-title",
            type: "heading",
            content: "I build kinetic, responsive web experiences.",
            styles: {
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            },
          },
          {
            id: "about-desc",
            type: "text",
            content:
              "Specializing in React, TypeScript, and modern UI/UX design to create products that people love to use.",
            styles: {
              color: "#64748b",
              fontSize: "1.25rem",
              lineHeight: 1.6,
              maxWidth: "600px",
            },
          },
        ],
      },
      {
        id: "port-skills",
        type: "section",
        styles: {
          padding: "5rem 2rem",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        children: [
          {
            id: "skills-title",
            type: "heading",
            content: "Core Technologies",
            styles: {
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "3rem",
            },
          },
          {
            id: "skills-grid",
            type: "container",
            styles: {
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              maxWidth: "800px",
            },
            children: [
              {
                id: "skill-1",
                type: "text",
                content: "React",
                styles: {
                  background: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  margin: 0,
                },
              },
              {
                id: "skill-2",
                type: "text",
                content: "TypeScript",
                styles: {
                  background: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  margin: 0,
                },
              },
              {
                id: "skill-3",
                type: "text",
                content: "Next.js",
                styles: {
                  background: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  margin: 0,
                },
              },
              {
                id: "skill-4",
                type: "text",
                content: "Tailwind CSS",
                styles: {
                  background: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  margin: 0,
                },
              },
              {
                id: "skill-5",
                type: "text",
                content: "Node.js",
                styles: {
                  background: "#ffffff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  margin: 0,
                },
              },
            ],
          },
        ],
      },
      {
        id: "port-projects",
        type: "section",
        styles: {
          padding: "8rem 2rem",
          background: "#ffffff",
          maxWidth: "1200px",
          margin: "0 auto",
        },
        children: [
          {
            id: "projects-title",
            type: "heading",
            content: "Selected Work",
            styles: {
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "4rem",
            },
          },
          {
            id: "projects-grid",
            type: "container",
            styles: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2.5rem",
            },
            children: [
              {
                id: "proj-1",
                type: "container",
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                },
                children: [
                  {
                    id: "proj-1-img",
                    type: "container",
                    styles: {
                      width: "100%",
                      aspectRatio: "16/10",
                      background: "#e2e8f0",
                      borderRadius: "12px",
                    },
                  },
                  {
                    id: "proj-1-title",
                    type: "heading",
                    content: "E-Commerce Platform",
                    styles: {
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      margin: 0,
                      color: "#0f172a",
                    },
                  },
                  {
                    id: "proj-1-desc",
                    type: "text",
                    content:
                      "A full-stack marketplace with real-time inventory and Stripe integration.",
                    styles: { margin: 0, color: "#64748b", lineHeight: 1.6 },
                  },
                ],
              },
              {
                id: "proj-2",
                type: "container",
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                },
                children: [
                  {
                    id: "proj-2-img",
                    type: "container",
                    styles: {
                      width: "100%",
                      aspectRatio: "16/10",
                      background: "#e2e8f0",
                      borderRadius: "12px",
                    },
                  },
                  {
                    id: "proj-2-title",
                    type: "heading",
                    content: "SaaS Dashboard",
                    styles: {
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      margin: 0,
                      color: "#0f172a",
                    },
                  },
                  {
                    id: "proj-2-desc",
                    type: "text",
                    content:
                      "Analytics dashboard featuring complex data visualization and custom reporting.",
                    styles: { margin: 0, color: "#64748b", lineHeight: 1.6 },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "port-contact",
        type: "section",
        styles: {
          padding: "8rem 2rem",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        },
        children: [
          {
            id: "contact-title",
            type: "heading",
            content: "Let's build something together.",
            styles: {
              fontSize: "3rem",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "2rem",
            },
          },
          {
            id: "contact-btn",
            type: "button",
            content: "Get in touch",
            styles: {
              padding: "1.25rem 3rem",
              background: "#ffffff",
              color: "#0f172a",
              border: "none",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
            },
          },
        ],
      },
      {
        id: "port-footer",
        type: "section",
        styles: {
          padding: "2rem",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #e2e8f0",
        },
        children: [
          {
            id: "footer-text",
            type: "text",
            content: "© 2026 Developer Portfolio. Built with WEBIT.",
            styles: { margin: 0, color: "#94a3b8", fontSize: "0.9rem" },
          },
        ],
      },
    ],
  },
];

export const CATEGORIES = ["All", "Landing", "Portfolio", "Business", "Links"];

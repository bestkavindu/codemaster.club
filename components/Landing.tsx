"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const MONO = "'JetBrains Mono', monospace";

const TECH = [
  "React",
  "TypeScript",
  "Node",
  "Postgres",
  "Edge",
  "Stripe",
  "Tailwind",
  "Docker",
];

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "capabilities", label: "Capabilities" },
  { id: "contact", label: "Support" },
];

const chipStyle: CSSProperties = {
  padding: "10px 18px",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 999,
  background: "rgba(255,255,255,.02)",
  color: "#d4d4d8",
  fontFamily: MONO,
  fontSize: 14,
  whiteSpace: "nowrap",
  flex: "none",
};

const statCardStyle: CSSProperties = {
  flex: 1,
  minWidth: 200,
  padding: "30px 28px",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 16,
  background: "#0d0f16",
};

const statNumStyle: CSSProperties = {
  fontSize: 46,
  fontWeight: 600,
  color: "#f4f4f5",
  letterSpacing: "-.02em",
  fontVariantNumeric: "tabular-nums",
};

const aboutCardStyle: CSSProperties = {
  padding: 24,
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 14,
  background: "#0d0f16",
};

const capLabelStyle: CSSProperties = {
  fontFamily: MONO,
  fontSize: 12,
  color: "#52525b",
  marginBottom: 8,
};

const capIconWrap: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 11,
  background: "rgba(139,92,246,.12)",
  border: "1px solid rgba(139,92,246,.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
};

const sectionLabel: CSSProperties = {
  fontFamily: MONO,
  fontSize: 13,
  color: "#a78bfa",
  marginBottom: 20,
};

const h2Style: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px,3.6vw,42px)",
  lineHeight: 1.15,
  letterSpacing: "-.02em",
  fontWeight: 600,
  color: "#f4f4f5",
};

export default function Landing({
  showGrid = true,
  glow = "Medium",
}: {
  showGrid?: boolean;
  glow?: "Subtle" | "Medium" | "Bold";
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // ---- glow / grid backgrounds ----
  const f = glow === "Subtle" ? 0.6 : glow === "Bold" ? 1.6 : 1;
  const a = (x: number) => Math.min(0.55, x * f).toFixed(3);
  const bgStyle: CSSProperties = {
    position: "fixed",
    inset: "-18%",
    pointerEvents: "none",
    zIndex: 0,
    willChange: "transform",
    animation: "cmdrift 22s ease-in-out infinite",
    background: `radial-gradient(640px 460px at 16% 2%, rgba(99,102,241,${a(0.2)}), transparent 60%), radial-gradient(740px 540px at 88% 12%, rgba(139,92,246,${a(0.16)}), transparent 60%), radial-gradient(900px 680px at 50% 108%, rgba(99,102,241,${a(0.12)}), transparent 62%)`,
  };
  const gridStyle: CSSProperties = showGrid
    ? {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0px, transparent 620px, #000 880px, #000 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0px, transparent 620px, #000 880px, #000 100%)",
      }
    : { display: "none" };

  const mobileStyle: CSSProperties = menuOpen
    ? {
        maxWidth: 1080,
        margin: "0 auto",
        maxHeight: 340,
        opacity: 1,
        overflow: "hidden",
        transition:
          "max-height .35s cubic-bezier(.2,.7,.2,1), opacity .25s ease",
      }
    : {
        maxWidth: 1080,
        margin: "0 auto",
        maxHeight: 0,
        opacity: 0,
        overflow: "hidden",
        pointerEvents: "none",
        transition: "max-height .3s cubic-bezier(.2,.7,.2,1), opacity .2s ease",
      };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cleanups: Array<() => void> = [];

    // ---- AOS-style scroll reveals ----
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const hiddenTransform = (el: HTMLElement) => {
      const aos = el.getAttribute("data-aos") || "fade-up";
      const d = 30;
      switch (aos) {
        case "fade-down":
          return "translateY(-" + d + "px)";
        case "fade-left":
          return "translateX(" + d + "px)";
        case "fade-right":
          return "translateX(-" + d + "px)";
        case "zoom-in":
          return "scale(.94)";
        default:
          return "translateY(" + d + "px)";
      }
    };
    const inViewNow = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.92 && r.bottom > 0;
    };
    items.forEach((el) => {
      el.style.willChange = "opacity, transform";
      if (reduce || inViewNow(el)) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "";
        (el as any).__shown = true;
      } else {
        const delay = parseInt(el.getAttribute("data-aos-delay") || "0", 10);
        el.style.transition =
          "opacity .7s cubic-bezier(.2,.7,.2,1) " +
          delay +
          "ms, transform .8s cubic-bezier(.2,.7,.2,1) " +
          delay +
          "ms";
        el.style.opacity = "0";
        el.style.transform = hiddenTransform(el);
      }
    });

    if (!reduce) {
      const reveal = (el: HTMLElement) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        (el as any).__shown = true;
        const delay = parseInt(el.getAttribute("data-aos-delay") || "0", 10);
        setTimeout(() => {
          el.style.transition = "";
          el.style.transform = "";
          el.style.willChange = "";
        }, 850 + delay);
      };
      const inView = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (
          r.top <
            (window.innerHeight || document.documentElement.clientHeight) *
              0.92 && r.bottom > 0
        );
      };
      const sweep = () => {
        items.forEach((el) => {
          if (!(el as any).__shown && inView(el)) reveal(el);
        });
      };
      window.addEventListener("scroll", sweep, { passive: true });
      window.addEventListener("resize", sweep, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", sweep));
      cleanups.push(() => window.removeEventListener("resize", sweep));
      try {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                reveal(e.target as HTMLElement);
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
        );
        items.forEach((el) => io.observe(el));
        cleanups.push(() => io.disconnect());
      } catch {}
      setTimeout(() => {
        items.forEach((el) => {
          if (!(el as any).__shown) reveal(el);
        });
      }, 1600);
    }

    // ---- count-up ----
    const counters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-target]")
    );
    const fmt = (el: HTMLElement, v: number) => {
      const dec = parseInt(el.getAttribute("data-dec") || "0", 10);
      const suf = el.getAttribute("data-suffix") || "";
      el.textContent = v.toFixed(dec) + suf;
    };
    const run = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute("data-target") || "0");
      const dur = 1500;
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        fmt(el, target * ease(p));
        if (p < 1) requestAnimationFrame(step);
        else fmt(el, target);
      };
      requestAnimationFrame(step);
    };
    if (reduce) {
      counters.forEach((el) =>
        fmt(el, parseFloat(el.getAttribute("data-target") || "0"))
      );
    } else {
      const fire = (el: HTMLElement) => {
        if ((el as any).__counted) return;
        (el as any).__counted = true;
        run(el);
      };
      const cInView = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (
          r.top <
            (window.innerHeight || document.documentElement.clientHeight) *
              0.9 && r.bottom > 0
        );
      };
      const cSweep = () =>
        counters.forEach((el) => {
          if (cInView(el)) fire(el);
        });
      requestAnimationFrame(cSweep);
      window.addEventListener("scroll", cSweep, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", cSweep));
      try {
        const cio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                fire(e.target as HTMLElement);
                cio.unobserve(e.target);
              }
            });
          },
          { threshold: 0.6 }
        );
        counters.forEach((el) => cio.observe(el));
        cleanups.push(() => cio.disconnect());
      } catch {}
      setTimeout(() => counters.forEach((el) => fire(el)), 1800);
    }

    // ---- terminal typing ----
    const termCleanup = setupTerminal(reduce, termRef.current);
    if (termCleanup) cleanups.push(termCleanup);

    // ---- scroll-driven: progress bar + parallax + scroll-spy ----
    const scrollCleanup = setupScroll(
      reduce,
      root,
      progressRef.current,
      gridRef.current,
      navRef.current
    );
    if (scrollCleanup) cleanups.push(scrollCleanup);

    return () => cleanups.forEach((c) => c());
  }, []);

  const burgerPath = menuOpen
    ? "M6 6l12 12M18 6L6 18"
    : "M4 7h16M4 12h16M4 17h16";

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#05060a",
        color: "#a1a1aa",
        fontFamily: "'Geist',-apple-system,sans-serif",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: "0%",
          zIndex: 100,
          background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
          boxShadow: "0 0 12px rgba(139,92,246,.8)",
          transformOrigin: "left center",
        }}
      />

      <div className="cm-bg" style={bgStyle} aria-hidden="true" />
      <div ref={gridRef} style={gridStyle} aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* NAV */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "16px 24px",
          }}
        >
          <nav
            ref={navRef}
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              padding: "9px 9px 9px 20px",
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              borderRadius: 18,
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              background: "rgba(20,12,10,.42)",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.06), 0 10px 30px -16px rgba(0,0,0,.5)",
              transition:
                "background .3s ease, border-color .3s ease, box-shadow .3s ease",
            }}
          >
            {/* LEFT: logo + badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                minWidth: 0,
              }}
            >
              <a
                href="#top"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  textDecoration: "none",
                  fontFamily: MONO,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  letterSpacing: "-.01em",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#8b5cf6" }}>&lt;/&gt;</span>
                codemaster.club
              </a>
              <a
                href="#products"
                className="cm-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  fontFamily: MONO,
                  fontSize: 11,
                  color: "#d4d4d8",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#34d399",
                    boxShadow: "0 0 8px #34d399",
                    display: "inline-block",
                  }}
                />
                Featured on PH
              </a>
            </div>

            {/* RIGHT cluster */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                className="cm-navlinks"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 14,
                }}
              >
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    data-navlink={l.id}
                    className="cm-navlink"
                    style={{
                      textDecoration: "none",
                      color: "#a1a1aa",
                      padding: "8px 13px",
                      borderRadius: 10,
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <a
                href="#contact"
                className="cm-cta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  padding: "9px 16px",
                  borderRadius: 12,
                  background: "rgba(139,92,246,.16)",
                  border: "1px solid rgba(139,92,246,.4)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.1)",
                }}
              >
                <span style={{ color: "#c4b5fd", fontSize: 13 }}>✦</span>
                Start a project
              </a>
              <button
                className="cm-burger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                style={{
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f4f4f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d={burgerPath} />
                </svg>
              </button>
            </div>
          </nav>

          {/* MOBILE DROPDOWN */}
          <div className="cm-mobile" style={mobileStyle}>
            <div
              style={{
                maxWidth: 1080,
                margin: "10px auto 0",
                padding: 14,
                borderRadius: 18,
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                background: "rgba(20,12,10,.7)",
                border: "1px solid rgba(255,255,255,.1)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,.07), 0 20px 50px -20px rgba(0,0,0,.8)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="cm-mlink"
                  style={{
                    textDecoration: "none",
                    color: "#d4d4d8",
                    padding: "13px 16px",
                    borderRadius: 12,
                    fontSize: 16,
                  }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  marginTop: 6,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  padding: 14,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 8px 26px -8px rgba(99,102,241,.8)",
                }}
              >
                <span>✦</span>Start a project
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section
          id="top"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 24px 70px" }}
        >
          <div
            className="cm-hero"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr .95fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div data-reveal data-aos="fade-right">
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#a78bfa",
                  letterSpacing: ".02em",
                  marginBottom: 22,
                }}
              >
                // product studio
              </div>
              <h1
                className="cm-h1"
                style={{
                  margin: 0,
                  fontSize: "clamp(42px,5.4vw,64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-.03em",
                  fontWeight: 600,
                  color: "#f4f4f5",
                  textWrap: "balance",
                }}
              >
                We craft web tools &amp; SaaS that{" "}
                <span
                  style={{
                    background: "linear-gradient(120deg,#818cf8,#c4b5fd)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  developers love
                </span>
              </h1>
              <p
                style={{
                  margin: "26px 0 0",
                  fontSize: 18,
                  lineHeight: 1.6,
                  color: "#a1a1aa",
                  maxWidth: 520,
                  textWrap: "pretty",
                }}
              >
                A product studio shipping fast, well-engineered web tools and
                SaaS platforms — built with obsessive attention to performance,
                craft, and developer experience.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  marginTop: 34,
                }}
              >
                <a
                  href="#contact"
                  className="cm-btn-primary"
                  style={{
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    padding: "13px 24px",
                    borderRadius: 11,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    boxShadow:
                      "0 0 0 1px rgba(139,92,246,.35), 0 10px 34px -10px rgba(99,102,241,.8)",
                  }}
                >
                  Start a project
                </a>
                <a
                  href="#products"
                  className="cm-btn-ghost"
                  style={{
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#f4f4f5",
                    padding: "13px 24px",
                    borderRadius: 11,
                    background: "rgba(255,255,255,.025)",
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                >
                  View products
                </a>
              </div>
            </div>

            {/* TERMINAL */}
            <div
              data-reveal
              data-aos="fade-left"
              data-aos-delay="120"
              style={{
                border: "1px solid rgba(255,255,255,.09)",
                borderRadius: 16,
                background: "linear-gradient(180deg,#0d0f16,#0a0b11)",
                boxShadow:
                  "0 30px 80px -30px rgba(99,102,241,.35), 0 0 0 1px rgba(255,255,255,.02)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: "#ff5f57",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: "#febc2e",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: "#28c840",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    marginLeft: 10,
                    fontFamily: MONO,
                    fontSize: 12,
                    color: "#52525b",
                  }}
                >
                  ~/codemaster — deploy
                </span>
              </div>
              <div
                ref={termRef}
                style={{
                  padding: 20,
                  fontFamily: MONO,
                  fontSize: 13.5,
                  lineHeight: 1.9,
                  color: "#a1a1aa",
                  minHeight: 208,
                }}
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section
          style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px 70px" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <div data-reveal data-aos="fade-up" data-aos-delay="0" style={statCardStyle}>
              <div data-target="48" data-dec="0" data-suffix="+" style={statNumStyle}>
                0
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "#a1a1aa" }}>
                Products shipped
              </div>
            </div>
            <div data-reveal data-aos="fade-up" data-aos-delay="90" style={statCardStyle}>
              <div data-target="2.4" data-dec="1" data-suffix="M" style={statNumStyle}>
                0
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "#a1a1aa" }}>
                Users reached
              </div>
            </div>
            <div data-reveal data-aos="fade-up" data-aos-delay="180" style={statCardStyle}>
              <div data-target="99.99" data-dec="2" data-suffix="%" style={statNumStyle}>
                0
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: "#a1a1aa" }}>
                Uptime
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "30px 0",
            borderTop: "1px solid rgba(255,255,255,.06)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            WebkitMaskImage:
              "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
            maskImage:
              "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
          }}
        >
          <div
            className="cm-marquee"
            style={{
              display: "flex",
              gap: 14,
              width: "max-content",
              animation: "cmmarquee 30s linear infinite",
            }}
          >
            {TECH.map((t) => (
              <span key={t} style={chipStyle}>
                {t}
              </span>
            ))}
            {TECH.map((t) => (
              <span key={`dup-${t}`} style={chipStyle} aria-hidden="true">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          data-reveal
          style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px" }}
        >
          <div style={sectionLabel}>// 01 — shipping obsession</div>
          <h2 style={{ ...h2Style, maxWidth: 760, textWrap: "balance" }}>
            Obsessed with shipping. Allergic to bloat.
          </h2>
          <p
            style={{
              margin: "24px 0 0",
              maxWidth: 680,
              fontSize: 17,
              lineHeight: 1.65,
              color: "#a1a1aa",
              textWrap: "pretty",
            }}
          >
            We don&apos;t do drawn-out agency engagements. We design, build, and
            deploy production-grade software in tight loops — measuring
            everything, cutting scope ruthlessly, and treating performance as a
            feature. Every project ends the same way: live, fast, and
            maintained.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
              marginTop: 48,
            }}
          >
            {[
              {
                tag: "fast.by.default",
                title: "Fast by default",
                body: "Sub-second loads, edge delivery, and budgets enforced in CI.",
                delay: "0",
              },
              {
                tag: "engineered",
                title: "Engineered, not assembled",
                body: "Typed end-to-end, tested, and documented — no glued-together templates.",
                delay: "90",
              },
              {
                tag: "owned.e2e",
                title: "Owned end-to-end",
                body: "From schema to deploy to on-call — one team that ships and stays.",
                delay: "180",
              },
            ].map((c) => (
              <div
                key={c.tag}
                data-reveal
                data-aos="fade-up"
                data-aos-delay={c.delay}
                style={aboutCardStyle}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: "#8b5cf6",
                    marginBottom: 10,
                  }}
                >
                  {c.tag}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#f4f4f5",
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{ fontSize: 14.5, lineHeight: 1.55, color: "#a1a1aa" }}
                >
                  {c.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          data-reveal
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 96px" }}
        >
          <div style={sectionLabel}>// 02 — products</div>
          <h2 style={{ ...h2Style, margin: "0 0 40px" }}>Tools we build &amp; run</h2>

          <div
            className="cm-product"
            data-reveal
            data-aos="zoom-in"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              border: "1px solid rgba(255,255,255,.09)",
              borderRadius: 20,
              overflow: "hidden",
              background: "linear-gradient(180deg,#12141d,#0d0f16)",
              boxShadow: "0 30px 80px -40px rgba(99,102,241,.35)",
            }}
          >
            <div style={{ padding: 42 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: MONO,
                    fontSize: 12,
                    color: "#a78bfa",
                    padding: "5px 11px",
                    border: "1px solid rgba(139,92,246,.4)",
                    borderRadius: 999,
                    background: "rgba(139,92,246,.1)",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#34d399",
                      display: "inline-block",
                      boxShadow: "0 0 8px #34d399",
                    }}
                  />
                  Live product
                </span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: "#52525b" }}>
                  // flagship
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  letterSpacing: "-.02em",
                }}
              >
                Schematic
              </h3>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "#a1a1aa",
                  textWrap: "pretty",
                }}
              >
                A visual database schema builder for Laravel. Design tables,
                relationships, and migrations on a canvas — then export clean,
                production-ready code.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                  margin: "26px 0 30px",
                }}
              >
                {[
                  "Drag-and-drop schema canvas",
                  "Eloquent models & migration export",
                  "Real-time team collaboration",
                ].map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14.5,
                      color: "#d4d4d8",
                    }}
                  >
                    <span style={{ color: "#8b5cf6" }}>→</span>
                    {t}
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className="cm-btn-explore"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "#f4f4f5",
                  padding: "11px 20px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                Explore Schematic →
              </a>
            </div>

            {/* schema mock */}
            <div
              style={{
                position: "relative",
                padding: 42,
                borderLeft: "1px solid rgba(255,255,255,.07)",
                background:
                  "radial-gradient(500px 300px at 80% 20%, rgba(99,102,241,.12), transparent 60%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 330,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 34,
                  alignItems: "center",
                  fontFamily: MONO,
                  fontSize: 12.5,
                }}
              >
                <div
                  style={{
                    width: 148,
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 11,
                    background: "#0a0b11",
                    overflow: "hidden",
                    boxShadow: "0 14px 40px -16px rgba(0,0,0,.7)",
                  }}
                >
                  <div
                    style={{
                      padding: "9px 12px",
                      background: "rgba(139,92,246,.16)",
                      color: "#c4b5fd",
                      borderBottom: "1px solid rgba(255,255,255,.08)",
                      fontWeight: 500,
                    }}
                  >
                    users
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      color: "#a1a1aa",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#818cf8" }}>id</span>
                    <span style={{ color: "#52525b" }}>pk</span>
                  </div>
                  <div style={{ padding: "8px 12px", color: "#a1a1aa" }}>name</div>
                  <div style={{ padding: "8px 12px", color: "#a1a1aa" }}>email</div>
                </div>
                <div
                  style={{
                    width: 148,
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 11,
                    background: "#0a0b11",
                    overflow: "hidden",
                    boxShadow: "0 14px 40px -16px rgba(0,0,0,.7)",
                  }}
                >
                  <div
                    style={{
                      padding: "9px 12px",
                      background: "rgba(99,102,241,.16)",
                      color: "#a5b4fc",
                      borderBottom: "1px solid rgba(255,255,255,.08)",
                      fontWeight: 500,
                    }}
                  >
                    posts
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      color: "#a1a1aa",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#818cf8" }}>id</span>
                    <span style={{ color: "#52525b" }}>pk</span>
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      color: "#a1a1aa",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>user_id</span>
                    <span style={{ color: "#8b5cf6" }}>fk</span>
                  </div>
                  <div style={{ padding: "8px 12px", color: "#a1a1aa" }}>title</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section
          id="capabilities"
          data-reveal
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 96px" }}
        >
          <div style={sectionLabel}>// 03 — capabilities</div>
          <h2 style={{ ...h2Style, margin: "0 0 40px" }}>What we build</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                n: "01",
                title: "Web Applications",
                body: "Production web apps with modern frameworks, server rendering, and edge delivery.",
                delay: "0",
                icon: (
                  <>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M7 6.5h.01" />
                  </>
                ),
              },
              {
                n: "02",
                title: "SaaS Platforms",
                body: "Multi-tenant products with auth, billing, dashboards, and analytics built in.",
                delay: "90",
                icon: (
                  <>
                    <path d="M12 3l9 5-9 5-9-5 9-5z" />
                    <path d="M3 13l9 5 9-5" />
                  </>
                ),
              },
              {
                n: "03",
                title: "APIs & Integrations",
                body: "Typed, documented APIs and reliable third-party integrations that just work.",
                delay: "180",
                icon: (
                  <>
                    <path d="M8 4L4 8l4 4" />
                    <path d="M16 4l4 4-4 4" />
                    <path d="M13 16l-2 4" />
                  </>
                ),
              },
              {
                n: "04",
                title: "Automation Tools",
                body: "Internal tools and pipelines that remove manual work and scale your ops.",
                delay: "270",
                icon: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
              },
            ].map((c) => (
              <div
                key={c.n}
                data-reveal
                data-aos="fade-up"
                data-aos-delay={c.delay}
                className="cm-cap"
                style={{
                  padding: "30px 28px",
                  border: "1px solid rgba(255,255,255,.07)",
                  borderRadius: 16,
                  background: "#0d0f16",
                }}
              >
                <div style={capIconWrap}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {c.icon}
                  </svg>
                </div>
                <div style={capLabelStyle}>{c.n}</div>
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#f4f4f5",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "#a1a1aa" }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          data-reveal
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 100px" }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(139,92,246,.25)",
              borderRadius: 24,
              background: "linear-gradient(135deg,#0d0f16,#12141d)",
              padding: "72px 48px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(600px 300px at 50% 0%, rgba(99,102,241,.22), transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#a78bfa",
                  marginBottom: 18,
                }}
              >
                // let&apos;s build
              </div>
              <h2
                style={{
                  margin: "0 auto",
                  maxWidth: 620,
                  fontSize: "clamp(32px,4vw,48px)",
                  lineHeight: 1.1,
                  letterSpacing: "-.02em",
                  fontWeight: 600,
                  color: "#f4f4f5",
                  textWrap: "balance",
                }}
              >
                Have something to ship?
              </h2>
              <p
                style={{
                  margin: "20px auto 0",
                  maxWidth: 480,
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "#a1a1aa",
                }}
              >
                Tell us what you&apos;re building. We&apos;ll scope it, build it,
                and get it live — fast.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  justifyContent: "center",
                  marginTop: 34,
                }}
              >
                <a
                  href="mailto:hello@codemaster.club"
                  className="cm-cta-big"
                  style={{
                    textDecoration: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: 11,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    boxShadow:
                      "0 0 0 1px rgba(139,92,246,.35), 0 12px 40px -10px rgba(99,102,241,.9)",
                  }}
                >
                  Start a project
                </a>
                <a
                  href="mailto:hello@codemaster.club"
                  className="cm-cta-email"
                  style={{
                    textDecoration: "none",
                    fontFamily: MONO,
                    fontSize: 14.5,
                    color: "#d4d4d8",
                    padding: "14px 24px",
                    borderRadius: 11,
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.02)",
                  }}
                >
                  hello@codemaster.club
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "40px 24px",
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontFamily: MONO,
                fontSize: 14,
                color: "#f4f4f5",
              }}
            >
              <span style={{ color: "#8b5cf6" }}>&lt;/&gt;</span>codemaster.club
            </div>
            <div style={{ display: "flex", gap: 28, fontSize: 14 }}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className="cm-flink"
                  style={{ textDecoration: "none", color: "#a1a1aa" }}
                >
                  {l.label === "Support" ? "Contact" : l.label}
                </a>
              ))}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "#52525b" }}>
              © 2026 codemaster.club
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ---- terminal typing ----
function setupTerminal(reduce: boolean, term: HTMLDivElement | null) {
  if (!term) return;
  const out = [
    { t: "↻ building project graph…", c: "#71717a" },
    { t: "✓ compiled 142 modules in 1.2s", c: "#34d399" },
    { t: "↻ uploading to edge network…", c: "#71717a" },
    { t: "✓ deployed · 18 regions", c: "#34d399" },
    { t: "", c: "#a1a1aa" },
    { t: "➜ https://app.codemaster.club  ● live", c: "#a78bfa" },
  ];
  const cmd = "codemaster deploy --prod";

  const mkRow = () => {
    const d = document.createElement("div");
    d.style.whiteSpace = "pre-wrap";
    d.style.wordBreak = "break-word";
    return d;
  };

  if (reduce) {
    term.innerHTML = "";
    const p = mkRow();
    p.innerHTML =
      '<span style="color:#8b5cf6;">$</span> <span style="color:#f4f4f5;">' +
      cmd +
      "</span>";
    term.appendChild(p);
    out.forEach((o) => {
      const r = mkRow();
      r.textContent = o.t;
      r.style.color = o.c;
      term.appendChild(r);
    });
    return;
  }

  let timers: ReturnType<typeof setTimeout>[] = [];
  const startType = () => {
    term.innerHTML = "";
    const p = mkRow();
    const ps = document.createElement("span");
    ps.textContent = "$ ";
    ps.style.color = "#8b5cf6";
    const cs = document.createElement("span");
    cs.style.color = "#f4f4f5";
    const cur = document.createElement("span");
    cur.className = "cm-cursor";
    cur.textContent = "▉";
    cur.style.color = "#8b5cf6";
    cur.style.marginLeft = "1px";
    cur.style.animation = "cmblink 1s steps(1) infinite";
    p.append(ps, cs, cur);
    term.appendChild(p);

    let i = 0;
    const tick = () => {
      if (i <= cmd.length) {
        cs.textContent = cmd.slice(0, i);
        i++;
        timers.push(setTimeout(tick, 42));
      } else {
        emit(0);
      }
    };
    const emit = (idx: number) => {
      if (idx >= out.length) return;
      const o = out[idx];
      const r = mkRow();
      r.textContent = o.t || " ";
      r.style.color = o.c;
      r.style.opacity = "0";
      r.style.transition = "opacity .3s";
      term.appendChild(r);
      requestAnimationFrame(() => {
        r.style.opacity = "1";
      });
      timers.push(setTimeout(() => emit(idx + 1), o.t === "" ? 160 : 460));
    };
    timers.push(setTimeout(tick, 350));
  };

  let started = false;
  const begin = () => {
    if (started) return;
    started = true;
    startType();
  };
  const tInView = () => {
    const r = term.getBoundingClientRect();
    return (
      r.top <
        (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
      r.bottom > 0
    );
  };
  const tSweep = () => {
    if (tInView()) {
      begin();
      window.removeEventListener("scroll", tSweep);
    }
  };
  requestAnimationFrame(tSweep);
  window.addEventListener("scroll", tSweep, { passive: true });
  let tio: IntersectionObserver | null = null;
  try {
    tio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            tio?.disconnect();
            begin();
          }
        });
      },
      { threshold: 0.35 }
    );
    tio.observe(term);
  } catch {}
  timers.push(setTimeout(begin, 1500));

  return () => {
    timers.forEach((t) => clearTimeout(t));
    window.removeEventListener("scroll", tSweep);
    tio?.disconnect();
  };
}

// ---- scroll-driven: progress bar + parallax + scroll-spy ----
function setupScroll(
  reduce: boolean,
  root: HTMLElement,
  progress: HTMLDivElement | null,
  grid: HTMLDivElement | null,
  nav: HTMLElement | null
) {
  const parallaxEls = Array.from(
    root.querySelectorAll<HTMLElement>("[data-parallax]")
  );
  const navLinks = Array.from(
    root.querySelectorAll<HTMLElement>("[data-navlink]")
  );
  const sections = ["about", "products", "capabilities", "contact"]
    .map((id) => ({ id, el: document.getElementById(id) }))
    .filter((s): s is { id: string; el: HTMLElement } => !!s.el);
  let activeId: string | null = null;

  const onScroll = () => {
    try {
      const doc = document.documentElement;
      const scrollTop =
        window.pageYOffset ||
        doc.scrollTop ||
        (document.body && document.body.scrollTop) ||
        0;
      const vh = window.innerHeight || doc.clientHeight || 1;
      const max = doc.scrollHeight - vh || 1;
      const p = Math.min(1, Math.max(0, scrollTop / max));

      if (progress) progress.style.width = (p * 100).toFixed(2) + "%";

      if (nav) {
        if (scrollTop > 20) {
          nav.style.background = "rgba(20,12,10,.72)";
          nav.style.borderColor = "rgba(255,255,255,.13)";
          nav.style.boxShadow =
            "inset 0 1px 0 rgba(255,255,255,.08), 0 16px 40px -16px rgba(0,0,0,.7)";
        } else {
          nav.style.background = "rgba(20,12,10,.42)";
          nav.style.borderColor = "rgba(255,255,255,.08)";
          nav.style.boxShadow =
            "inset 0 1px 0 rgba(255,255,255,.06), 0 10px 30px -16px rgba(0,0,0,.5)";
        }
      }

      let current: string | null = null;
      const probe = vh * 0.4;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].el.getBoundingClientRect().top;
        if (top <= probe) current = sections[i].id;
      }
      if (current !== activeId) {
        activeId = current;
        navLinks.forEach((aEl) => {
          const on = aEl.getAttribute("data-navlink") === activeId;
          aEl.style.color = on ? "#c4b5fd" : "#a1a1aa";
          aEl.style.background = on ? "rgba(139,92,246,.14)" : "transparent";
        });
      }

      if (!reduce) {
        if (grid)
          grid.style.transform =
            "translate3d(0," + (scrollTop * 0.12).toFixed(1) + "px,0)";
        parallaxEls.forEach((el) => {
          const sp = parseFloat(el.getAttribute("data-parallax") || "0") || 0;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2 - vh / 2;
          el.style.transform =
            "translate3d(0," + (center * sp * -0.08).toFixed(1) + "px,0)";
        });
      }
    } catch (err) {
      console.error("[nav scroll]", err);
    }
  };

  let ticking = false;
  const tick = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      try {
        onScroll();
      } finally {
        ticking = false;
      }
    });
  };
  onScroll();
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick, { passive: true });

  return () => {
    window.removeEventListener("scroll", tick);
    window.removeEventListener("resize", tick);
  };
}

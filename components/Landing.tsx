"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SHOW_COMING_SOON = true;

const TYPE_LINE_1 = "codemaster.club --tagline";
const TYPE_LINE_2 = "> tools i build for developers.";

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const t1Ref = useRef<HTMLSpanElement>(null);
  const t2Ref = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const xvRef = useRef<HTMLDivElement>(null);
  const xhRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);

  const [subscribed, setSubscribed] = useState(false);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  }, []);

  /* ---- nav solidify on scroll ---- */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let solid: boolean | null = null;
    const onScroll = () => {
      const s = window.scrollY > 28;
      if (s === solid) return;
      solid = s;
      nav.style.background = s ? "rgba(10,12,16,0.88)" : "transparent";
      nav.style.borderBottomColor = s
        ? "rgba(230,233,239,0.12)"
        : "transparent";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- typewriter ---- */
  useEffect(() => {
    const l1 = t1Ref.current;
    const l2 = t2Ref.current;
    const caret = caretRef.current;
    if (!l1 || !l2) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const moveCaret = () => {
      if (caret && l2.parentNode) l2.parentNode.appendChild(caret);
    };

    if (reduced) {
      l1.textContent = TYPE_LINE_1;
      l2.textContent = TYPE_LINE_2;
      moveCaret();
      return;
    }

    let i = 0;
    let t2: ReturnType<typeof setInterval> | undefined;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const t1 = setInterval(() => {
      i++;
      l1.textContent = TYPE_LINE_1.slice(0, i);
      if (i >= TYPE_LINE_1.length) {
        clearInterval(t1);
        startTimer = setTimeout(() => {
          moveCaret();
          let j = 0;
          t2 = setInterval(() => {
            j++;
            l2.textContent = TYPE_LINE_2.slice(0, j);
            if (j >= TYPE_LINE_2.length && t2) clearInterval(t2);
          }, 34);
        }, 420);
      }
    }, 38);

    return () => {
      clearInterval(t1);
      if (t2) clearInterval(t2);
      if (startTimer) clearTimeout(startTimer);
    };
  }, []);

  /* ---- crosshair (fine pointers only) ---- */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const v = xvRef.current;
    const h = xhRef.current;
    const c = coordsRef.current;
    if (!v || !h) return;

    let x = 0;
    let y = 0;
    let raf: number | null = null;
    const pad = (n: number) =>
      String(Math.max(0, Math.round(n))).padStart(4, "0");

    const paint = () => {
      raf = null;
      v.style.transform = "translate3d(" + x + "px,0,0)";
      h.style.transform = "translate3d(0," + y + "px,0)";
      if (c) c.textContent = "X " + pad(x) + "  ·  Y " + pad(y);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      v.style.opacity = "1";
      h.style.opacity = "1";
      if (c) c.style.opacity = "1";
      if (raf === null) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      v.style.opacity = "0";
      h.style.opacity = "0";
      if (c) c.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---- scroll reveals ---- */
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = rootRef.current;
    if (!root) return;

    const els = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal], [data-fx="line"]')
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement & {
            _cmIsLine?: boolean;
            _cmOrigTransition?: string;
          };
          io.unobserve(el);
          const d = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          el.style.transitionDelay = d + "ms";
          el.style.opacity = "1";
          el.style.transform = el._cmIsLine ? "scaleX(1)" : "none";
          setTimeout(() => {
            el.style.transition = el._cmOrigTransition || "";
            el.style.transitionDelay = "";
          }, 950 + d);
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el: HTMLElement & { _cmIsLine?: boolean; _cmOrigTransition?: string }) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) return;
      el._cmIsLine = el.getAttribute("data-fx") === "line";
      el._cmOrigTransition = el.style.transition;
      if (el._cmIsLine) {
        el.style.transform = "scaleX(0)";
        el.style.transition = "transform 1s cubic-bezier(.22,1,.36,1)";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
        el.style.transition =
          "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)";
      }
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <div className="cm-root" ref={rootRef}>
      {/* frame corners */}
      <div className="cm-frame" aria-hidden="true">
        <span className="tl">+</span>
        <span className="tr">+</span>
        <span className="bl">+</span>
        <span className="br">+</span>
      </div>

      {/* crosshair */}
      <div className="cm-xhair-v" aria-hidden="true" ref={xvRef} />
      <div className="cm-xhair-h" aria-hidden="true" ref={xhRef} />
      <div className="cm-coords" aria-hidden="true" ref={coordsRef}>
        X 0000  ·  Y 0000
      </div>

      {/* nav */}
      <nav className="cm-nav" ref={navRef}>
        <div className="cm-nav__inner">
          <button type="button" className="cm-logo" onClick={goTop}>
            <span className="cm-logo__dot" data-blink />
            codemaster.club
          </button>
          <div className="cm-nav__links">
            <button
              type="button"
              className="cm-nav__link"
              onClick={() => scrollToId("products")}
            >
              PRODUCTS
            </button>
            <button
              type="button"
              className="cm-nav__link"
              onClick={() => scrollToId("log")}
            >
              LOG
            </button>
            <button
              type="button"
              className="cm-nav__link"
              onClick={() => scrollToId("about")}
            >
              ABOUT
            </button>
            <button
              type="button"
              className="cm-nav__link"
              onClick={() => scrollToId("contact")}
            >
              CONTACT
            </button>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section id="top" className="cm-hero">
        <div className="cm-scan" data-loop aria-hidden="true" />
        <div className="cm-hero__inner">
          <div className="cm-hero__col">
            <div className="cm-term">
              <div>
                <span className="cm-term__prompt">$ </span>
                <span ref={t1Ref} />
                <span className="cm-caret" data-loop ref={caretRef} />
              </div>
              <div>
                <span className="cm-term__l2" ref={t2Ref} />
              </div>
            </div>
            <h1 className="cm-h1">
              CODEMASTER
              <wbr />
              <span className="cm-accent">.CLUB</span>
            </h1>
            <p className="cm-lead">
              A one-person studio shipping practical developer tools and SaaS
              products. Designed, built, and maintained end to end.
            </p>
            <div className="cm-cta-row">
              <button
                type="button"
                className="btn-primary"
                onClick={() => scrollToId("products")}
              >
                EXPLORE PRODUCTS →
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => scrollToId("contact")}
              >
                GET IN TOUCH
              </button>
            </div>
            <div className="cm-rule-row">
              <span className="tick" />
              <span className="line" />
              <span className="label">EST. LOCALHOST — SHIPPING WEEKLY</span>
              <span className="line" />
              <span className="tick" />
            </div>
          </div>

          {/* ER-diagram motif */}
          <div className="cm-motif" data-motif aria-hidden="true">
            <div className="cm-motif__stage">
              <div className="cm-wire-x" data-loop />
              <div className="cm-wire-y" data-loop />

              <div className="cm-tbl cm-tbl--users">
                <div className="cm-tbl__head">
                  <span>▸ users</span>
                  <span className="cm-tbl__tag">TABLE</span>
                </div>
                <div className="cm-tbl__row">
                  <span>id</span>
                  <span className="cm-tbl__type">uuid PK</span>
                </div>
                <div className="cm-tbl__row">
                  <span>email</span>
                  <span className="cm-tbl__type">text</span>
                </div>
                <div className="cm-tbl__row">
                  <span>plan</span>
                  <span className="cm-tbl__type">enum</span>
                </div>
              </div>

              <div className="cm-tbl cm-tbl--schemas">
                <div className="cm-tbl__head">
                  <span>▸ schemas</span>
                  <span className="cm-tbl__livedot" data-blink />
                </div>
                <div className="cm-tbl__row">
                  <span>id</span>
                  <span className="cm-tbl__type">uuid PK</span>
                </div>
                <div className="cm-tbl__row">
                  <span>nodes</span>
                  <span className="cm-tbl__type">jsonb</span>
                </div>
                <div className="cm-tbl__row">
                  <span>owner_id</span>
                  <span className="cm-tbl__fk">→ users.id</span>
                </div>
              </div>

              <div className="cm-tbl cm-tbl--attempts">
                <div className="cm-tbl__head">
                  <span>▸ attempts</span>
                  <span className="cm-tbl__tag">TABLE</span>
                </div>
                <div className="cm-tbl__row">
                  <span>id</span>
                  <span className="cm-tbl__type">uuid PK</span>
                </div>
                <div className="cm-tbl__row">
                  <span>user_id</span>
                  <span className="cm-tbl__fk">→ users.id</span>
                </div>
                <div className="cm-tbl__row">
                  <span>score</span>
                  <span className="cm-tbl__type">int</span>
                </div>
              </div>
            </div>
            <div className="cm-motif__cap">FIG. 01 — WHAT THE TOOLS SEE</div>
          </div>
        </div>
      </section>

      {/* ticker */}
      <div className="cm-ticker">
        <div className="cm-ticker__track" data-loop>
          <TickerItem />
          <TickerItem />
        </div>
      </div>

      {/* products */}
      <section id="products" className="cm-section">
        <div data-reveal>
          <div className="cm-eyebrow">
            <span className="num">01</span> / PRODUCTS
          </div>
          <h2 className="cm-h2">WHAT I&apos;M BUILDING</h2>
        </div>
        <div className="cm-hr-row">
          <span className="tick" />
          <span className="line" data-fx="line" />
          <span className="tick" />
        </div>

        <div data-reveal style={{ marginTop: 40 }}>
          <ProductCard
            index="01"
            name="SCHEMATIC"
            tagline="Visual Database Schema Builder"
            description="Design and visualize your database schemas right in the browser — tables, relations, and exports without leaving your workflow."
            href="https://schematic.codemaster.club"
            urlLabel="schematic.codemaster.club"
          />
        </div>

        <div data-reveal data-reveal-delay="80" style={{ marginTop: 22 }}>
          <ProductCard
            index="02"
            name="CERTPREP"
            tagline="Certification Exam Training Platform"
            description="Practice tests and study tools to help you pass your certification exams — realistic questions, timed sessions, visible progress."
            href="https://certprep.codemaster.club"
            urlLabel="certprep.codemaster.club"
          />
        </div>

        {SHOW_COMING_SOON && (
          <div
            className="cm-card--soon"
            data-reveal
            data-reveal-delay="160"
            style={{ marginTop: 22 }}
          >
            <div className="cm-card__head">
              <span className="cm-card__idx">[ PRODUCT / 03 ]</span>
              <span className="cm-badge cm-badge--soon">
                <span className="cm-badge__dot" data-blink />
                IN DEVELOPMENT
              </span>
            </div>
            <div className="cm-soon__body">
              <div>
                <div className="cm-soon__row">
                  <span
                    className="cm-skel"
                    style={{ width: 168, maxWidth: "40vw", height: 20 }}
                  />
                  <span
                    className="cm-skel"
                    style={{
                      width: 74,
                      height: 20,
                      background: "rgba(230,233,239,.09)",
                    }}
                  />
                </div>
                <div className="cm-soon__row">
                  <span
                    className="cm-skel"
                    style={{
                      width: 230,
                      maxWidth: "56vw",
                      height: 9,
                      background: "rgba(230,233,239,.08)",
                    }}
                  />
                  <span
                    className="cm-skel"
                    style={{
                      width: 120,
                      height: 9,
                      background: "rgba(230,233,239,.06)",
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="cm-soon__link"
                onClick={() => scrollToId("updates")}
              >
                DETAILS WITHHELD — FOLLOW THE LOG →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* principles */}
      <section id="principles" className="cm-section">
        <div data-reveal>
          <div className="cm-eyebrow">
            <span className="num">02</span> / BUILD SPEC
          </div>
          <h2 className="cm-h2">HOW I BUILD</h2>
        </div>
        <div className="cm-principles">
          <Principle
            num="001"
            delay={0}
            title="SHIP SMALL, SHIP OFTEN"
            text="Weekly releases beat quarterly rewrites. Every product improves a little, constantly."
          />
          <Principle
            num="002"
            delay={90}
            title="BORING TECH, SHARP PRODUCTS"
            text="Laravel, Livewire, Postgres. Proven tools I know deeply — energy goes into the product, not the stack."
          />
          <Principle
            num="003"
            delay={180}
            title="PRODUCTION-READY BY DEFAULT"
            text="Auth, billing, backups, monitoring — wired in from day one, not someday."
          />
        </div>
      </section>

      {/* build log */}
      <section id="log" className="cm-section">
        <div className="cm-log">
          <div className="cm-log__head" data-reveal>
            <div className="cm-eyebrow">
              <span className="num">03</span> / BUILD LOG
            </div>
            <h2 className="cm-h2">RECENTLY SHIPPED</h2>
            <p className="cm-log__lead">
              Small, steady releases across the studio.
            </p>
          </div>
          <div className="cm-log__list" data-reveal data-reveal-delay="90">
            <div className="cm-log__row">
              <span className="cm-log__marker" data-blink>
                ▸
              </span>
              <span className="cm-log__date">2026.06</span>
              <span className="cm-log__dots" />
              <span className="cm-log__desc cm-log__desc--hot">
                <b>SCHEMATIC</b> — export to Laravel migrations
              </span>
            </div>
            <div className="cm-log__row cm-log__row--indent">
              <span className="cm-log__date">2026.05</span>
              <span className="cm-log__dots" />
              <span className="cm-log__desc">
                <b>CERTPREP</b> — timed practice mode, score history
              </span>
            </div>
            <div className="cm-log__row cm-log__row--indent">
              <span className="cm-log__date">2026.04</span>
              <span className="cm-log__dots" />
              <span className="cm-log__desc">
                <b>SCHEMATIC</b> — public beta opened
              </span>
            </div>
            <div className="cm-log__row cm-log__row--indent cm-log__row--last">
              <span className="cm-log__date">2026.02</span>
              <span className="cm-log__dots" />
              <span className="cm-log__desc">
                <b>CERTPREP</b> — first exam track launched
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* about */}
      <section id="about" className="cm-section">
        <div className="cm-about">
          <div className="cm-about__col" data-reveal>
            <div className="cm-eyebrow">
              <span className="num">04</span> / OPERATOR
            </div>
            <h2 className="cm-h2">
              SOLO DEVELOPER.
              <br />
              REAL PRODUCTS.
            </h2>
            <p className="cm-about__text">
              I&apos;m a solo full-stack developer and indie maker. I build
              practical, production-ready developer tools and SaaS products end
              to end — from schema to ship — with Laravel, Livewire, PostgreSQL,
              and data &amp; BI tooling.
            </p>
          </div>
          <div className="cm-spec" data-reveal data-reveal-delay="90">
            <span className="cm-corner tl" aria-hidden="true" />
            <span className="cm-corner br" aria-hidden="true" />
            <div className="cm-spec__title">OPERATOR / SPEC</div>
            <div className="cm-spec__row">
              <span className="cm-spec__k">ROLE</span>
              <span className="cm-spec__v">full-stack developer</span>
            </div>
            <div className="cm-spec__row">
              <span className="cm-spec__k">STACK</span>
              <span className="cm-spec__v">Laravel · Livewire · PG</span>
            </div>
            <div className="cm-spec__row">
              <span className="cm-spec__k">MODE</span>
              <span className="cm-spec__v">solo · independent</span>
            </div>
            <div className="cm-spec__row cm-spec__row--last">
              <span className="cm-spec__k">STATUS</span>
              <span className="cm-spec__v cm-spec__v--live">
                <span className="cm-spec__dot" data-blink />
                shipping
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* updates / subscribe */}
      <section id="updates" className="cm-section">
        <div className="cm-updates" data-reveal>
          <span className="cm-corner tl" aria-hidden="true" />
          <span className="cm-corner tr" aria-hidden="true" />
          <span className="cm-corner bl" aria-hidden="true" />
          <span className="cm-corner br" aria-hidden="true" />
          <div className="cm-updates__copy">
            <div className="cm-updates__title">
              <span className="cm-accent">$</span> subscribe --updates
            </div>
            <p className="cm-updates__text">
              One short email when something ships. No noise, unsubscribe
              anytime.
            </p>
          </div>
          {subscribed ? (
            <div className="cm-subscribed">
              <span className="check">✓</span> subscribed — talk soon.
            </div>
          ) : (
            <form className="cm-form" onSubmit={onSubscribe}>
              <input
                type="email"
                required
                className="cm-form__input"
                placeholder="you@company.com"
                aria-label="Email address"
              />
              <button type="submit" className="cm-form__submit">
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>

      {/* footer */}
      <footer id="contact" className="cm-footer">
        <div className="cm-footer__inner">
          <div className="cm-footer__grid-wrap">
            <div className="cm-footer__grid">
              <div className="cm-footer__cell">
                <div className="cm-footer__k">PROJECT</div>
                <div className="cm-footer__v cm-footer__v--brand">
                  codemaster<span className="cm-accent">.club</span>
                </div>
              </div>
              <div className="cm-footer__cell">
                <div className="cm-footer__k">OPERATOR</div>
                <div className="cm-footer__v">solo developer · indie maker</div>
              </div>
              <div className="cm-footer__cell">
                <div className="cm-footer__k">REVISION</div>
                <div className="cm-footer__v">2026.07 · scale 1:1</div>
              </div>
              <div className="cm-footer__cell">
                <div className="cm-footer__k">CONTACT</div>
                <div className="cm-footer__v">
                  <a
                    href="mailto:hello@codemaster.club"
                    className="cm-footer__link"
                  >
                    hello@codemaster.club
                  </a>
                </div>
              </div>
              <div className="cm-footer__cell">
                <div className="cm-footer__k">SOURCE</div>
                <div className="cm-footer__v">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cm-footer__link"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
              <div className="cm-footer__cell">
                <div className="cm-footer__k">INDEX</div>
                <div className="cm-footer__index">
                  <button type="button" onClick={() => scrollToId("products")}>
                    01
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToId("principles")}
                  >
                    02
                  </button>
                  <button type="button" onClick={() => scrollToId("log")}>
                    03
                  </button>
                  <button type="button" onClick={() => scrollToId("about")}>
                    04
                  </button>
                  <button type="button" onClick={() => scrollToId("updates")}>
                    05
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="cm-footer__meta">
            <span className="cm-footer__copy">© 2026 CODEMASTER.CLUB</span>
            <span className="cm-footer__sheet">
              SHEET 01 / 01 — shipping since localhost
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TickerItem() {
  return (
    <span className="cm-ticker__item">
      SCHEMATIC — VISUAL DB SCHEMAS<span className="sep"> /// </span>CERTPREP —
      EXAM TRAINING<span className="sep"> /// </span>LARAVEL · LIVEWIRE ·
      POSTGRESQL<span className="sep"> /// </span>SHIPPING WEEKLY
      <span className="sep"> /// </span>ONE-PERSON STUDIO
      <span className="sep"> /// </span>
    </span>
  );
}

function ProductCard({
  index,
  name,
  tagline,
  description,
  href,
  urlLabel,
}: {
  index: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  urlLabel: string;
}) {
  return (
    <div className="cm-card">
      <span className="cm-corner tl" aria-hidden="true" />
      <span className="cm-corner tr" aria-hidden="true" />
      <span className="cm-corner bl" aria-hidden="true" />
      <span className="cm-corner br" aria-hidden="true" />
      <div className="cm-card__head">
        <span className="cm-card__idx">[ PRODUCT / {index} ]</span>
        <span className="cm-badge">
          <span className="cm-badge__dot" data-blink />
          LIVE
        </span>
      </div>
      <div className="cm-card__body">
        <div>
          <div className="cm-card__name">{name}</div>
          <div className="cm-card__sub">{tagline}</div>
        </div>
        <div>
          <p className="cm-card__desc">{description}</p>
          <div className="cm-tags">
            <span>[LARAVEL]</span>
            <span>[LIVEWIRE]</span>
            <span>[POSTGRESQL]</span>
          </div>
        </div>
        <div className="cm-card__actions">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="cm-visit"
          >
            VISIT →
          </a>
          <span className="cm-visit__url">{urlLabel}</span>
        </div>
      </div>
    </div>
  );
}

function Principle({
  num,
  delay,
  title,
  text,
}: {
  num: string;
  delay: number;
  title: string;
  text: string;
}) {
  return (
    <div data-reveal data-reveal-delay={delay}>
      <div className="cm-principle__head">
        <span className="cm-principle__num">{num}</span>
        <span className="cm-principle__line" data-fx="line" />
      </div>
      <div className="cm-principle__title">{title}</div>
      <p className="cm-principle__text">{text}</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ani Velaga — Software Engineer" },
      { name: "description", content: "Software engineer building reliable, performant systems. Selected projects, skills, and contact." },
      { property: "og:title", content: "Ani Velaga — Software Engineer" },
      { property: "og:description", content: "Selected projects, skills, and contact." },
    ],
  }),
  component: Index,
});

const PROJECTS = [
  {
    id: "01",
    name: "Serial Board",
    tagline:
      "Central comms hub for CUAUV's autonomous submarine — bridges 16 RS-232 RX/TX subsystem pairs to a single USB-C on the Jetson, with USB ESD protection, flexible DVL connectivity, and pluggable EEPROM for easier debugging.",
    stack: ["KiCad", "4-Layer PCB", "USB-C", "RS-232", "SMF05CT1G TVS"],
    year: "Spring 2026",
    github: null,
    demo: null,
  },
  {
    id: "02",
    name: "Pixie CDN",
    tagline: "Edge image transform and cache layer with on-the-fly resizing at sub-30ms latency.",
    stack: ["Rust", "WASM", "Cloudflare Workers"],
    year: "2024",
    github: "https://github.com/anivelaga/pixie-cdn",
    demo: "https://pixie.velaga.dev",
  },
  {
    id: "03",
    name: "Loomctl",
    tagline: "Declarative CLI for managing multi-region Postgres replicas across eight regions.",
    stack: ["TypeScript", "Postgres", "Terraform"],
    year: "2023",
    github: "https://github.com/anivelaga/loomctl",
    demo: null,
  },
];

const SKILLS = {
  Languages: ["TypeScript", "Go", "Rust", "Python", "SQL"],
  Systems: ["Postgres", "Redis", "Kafka", "Kubernetes", "gRPC"],
  Cloud: ["AWS", "Cloudflare", "GCP", "Terraform"],
  Tools: ["React", "TanStack", "Tailwind", "Vite", "Git"],
};

const EXPERIENCE = [
  { when: "2023 — Now", role: "Senior Software Engineer", org: "Stealth Infra Co.", note: "Building the distributed job platform powering core workloads." },
  { when: "2020 — 2023", role: "Software Engineer", org: "Northwind Systems", note: "Owned multi-region Postgres tooling and developer CLI." },
  { when: "2018 — 2020", role: "Software Engineer", org: "Quill Labs", note: "Backend services for a high-volume ingest pipeline." },
];

const NAV = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <Hero />
        <Ticker />
        <Work />
        <Ticker reverse />
        <About />
        <Ticker />
        <Experience />
        <Ticker reverse />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a href="#top" className="font-display text-base font-bold tracking-tight">
          Ani Velaga<span className="text-mark">.</span>
        </a>
        <nav className="flex items-center gap-7 text-sm">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-ink-dim transition hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-28 pt-24 sm:px-10 sm:pb-40 sm:pt-36">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-ink-dim">
        <span className="size-1.5 rounded-full bg-mark" />
        Available for new work — 2026
      </div>
      <h1 className="font-display mt-10 text-[clamp(3.5rem,12vw,11rem)] font-black uppercase">
        Ani
        <br />
        Velaga<span className="text-mark">.</span>
      </h1>
      <div className="mt-10 grid gap-10 sm:mt-16 sm:grid-cols-12">
        <p className="sm:col-span-7 sm:col-start-6 max-w-xl text-lg leading-relaxed text-ink-dim sm:text-xl">
          <span className="text-foreground">Software engineer</span> building fast, reliable
          distributed systems — queues, edge runtimes, and the tooling that keeps them honest.
          Currently shipping infrastructure other engineers depend on.
        </p>
      </div>
    </section>
  );
}

function Ticker({ reverse = false }: { reverse?: boolean }) {
  // Generate a long binary string. Doubled to make the marquee seamless.
  const segment = Array.from({ length: 64 }, (_, i) =>
    (((i * 2654435761) >>> 0) % 2 === 0 ? "01001010 11010011 00101110" : "10110101 00101100 11010001"),
  ).join("  /  ");
  const content = `${segment}  /  ${segment}`;
  return (
    <div className="border-y border-border bg-secondary/40 overflow-hidden">
      <div
        className="ticker-track flex whitespace-nowrap py-3 font-mono text-[11px] tracking-widest text-ink-faint"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <span className="px-6">{content}</span>
        <span className="px-6" aria-hidden>
          {content}
        </span>
      </div>
    </div>
  );
}

function SectionHeader({ index, title, kicker }: { index: string; title: string; kicker: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-12">
      <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-dim sm:col-span-3">
        <span className="text-mark">{index}</span> — {kicker}
      </div>
      <h2 className="font-display text-5xl font-bold sm:col-span-9 sm:text-7xl">{title}</h2>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="01" kicker="Selected Work" title="Things I've built." />
      <ul className="mt-20 divide-y divide-border border-y border-border">
        {PROJECTS.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 70}>
            <ProjectRow project={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function ProjectRow({ project: p }: { project: (typeof PROJECTS)[number] }) {
  return (
    <article className="group grid grid-cols-12 items-baseline gap-6 py-10 transition-colors">
      <div className="col-span-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint sm:col-span-2">
        {p.id} / {p.year}
      </div>
      <div className="col-span-12 sm:col-span-7">
        <h3 className="font-display text-3xl font-bold tracking-tight transition-colors group-hover:text-mark sm:text-4xl">
          {p.name}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-dim">{p.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
          {p.stack.map((s, i) => (
            <span key={s}>
              {s}
              {i < p.stack.length - 1 ? <span className="ml-5 text-rule">/</span> : null}
            </span>
          ))}
        </div>
      </div>
      <div className="col-span-12 flex gap-6 text-sm sm:col-span-3 sm:justify-end">
        {p.github ? (
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-foreground transition hover:text-mark"
          >
            <span className="underline decoration-rule underline-offset-4 group-hover/link:decoration-mark">GitHub</span>
            <span className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
          </a>
        ) : null}
        {p.demo ? (
          <a
            href={p.demo}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-foreground transition hover:text-mark"
          >
            <span className="underline decoration-rule underline-offset-4 group-hover/link:decoration-mark">Live</span>
            <span className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
          </a>
        ) : null}
        {!p.github && !p.demo ? <span className="text-ink-faint">— Internal project</span> : null}
      </div>
    </article>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="02" kicker="About & Skills" title="A few words, a long list." />
      <div className="mt-20 grid gap-16 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <p className="text-lg leading-relaxed text-ink-dim">
            I've been writing software for eight years, mostly on the backend — building the
            infrastructure other people build on top of. I care about correctness, latency, and
            tooling that respects the engineer using it.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink-dim">
            Outside of code: long walks, film cameras, and rebuilding mechanical keyboards I don't
            actually need.
          </p>
        </div>
        <dl className="sm:col-span-7 sm:pl-12">
          {Object.entries(SKILLS).map(([k, items], i) => (
            <div
              key={k}
              className={`grid grid-cols-12 gap-4 py-6 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <dt className="col-span-12 font-mono text-xs uppercase tracking-[0.28em] text-ink-faint sm:col-span-3">
                {k}
              </dt>
              <dd className="col-span-12 text-base text-foreground sm:col-span-9">
                {items.map((item, idx) => (
                  <span key={item}>
                    {item}
                    {idx < items.length - 1 ? <span className="mx-2 text-ink-faint">·</span> : null}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="03" kicker="Experience" title="Where I've been." />
      <ol className="mt-20 border-t border-border">
        {EXPERIENCE.map((e, i) => (
          <Reveal as="li" key={i} delay={i * 70}>
            <div className="grid grid-cols-12 gap-4 border-b border-border py-8 sm:py-10">
              <div className="col-span-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint sm:col-span-3">
                {e.when}
              </div>
              <div className="col-span-12 sm:col-span-9">
                <div className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {e.role} <span className="text-ink-dim">— {e.org}</span>
                </div>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-dim">{e.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Contact() {
  const links = [
    { k: "Email", v: "ani@velaga.dev", href: "mailto:ani@velaga.dev" },
    { k: "GitHub", v: "github.com/anivelaga", href: "https://github.com/anivelaga" },
    { k: "LinkedIn", v: "linkedin.com/in/anivelaga", href: "https://linkedin.com/in/anivelaga" },
  ];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="04" kicker="Get in touch" title="Let's talk." />
      <div className="mt-20 grid gap-10 sm:grid-cols-12">
        <p className="sm:col-span-5 text-lg leading-relaxed text-ink-dim">
          Open to select consulting and full-time roles in infrastructure, developer tools, and
          backend systems. The fastest way to reach me is email.
        </p>
        <ul className="sm:col-span-7 sm:pl-12">
          {links.map((l, i) => (
            <li
              key={l.k}
              className={`grid grid-cols-12 items-baseline gap-4 py-6 ${i > 0 ? "border-t border-border" : "border-t border-border"}`}
            >
              <span className="col-span-4 font-mono text-xs uppercase tracking-[0.28em] text-ink-faint sm:col-span-3">
                {l.k}
              </span>
              <a
                href={l.href}
                className="group col-span-8 inline-flex items-baseline gap-2 font-display text-2xl font-bold tracking-tight transition hover:text-mark sm:col-span-9 sm:text-3xl"
              >
                <span className="underline decoration-rule underline-offset-[6px] group-hover:decoration-mark">
                  {l.v}
                </span>
                <span className="text-base">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-xs uppercase tracking-[0.2em] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>© {new Date().getFullYear()} Ani Velaga — All rights reserved.</div>
        <div>Designed & built with care</div>
      </div>
    </footer>
  );
}

function Reveal({
  as: Tag = "div",
  delay = 0,
  children,
}: {
  as?: React.ElementType;
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className="reveal" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ani Velaga — Software Engineer" },
      { name: "description", content: "Software engineer building reliable, performant systems. Selected projects, stack, and contact." },
      { property: "og:title", content: "Ani Velaga — Software Engineer" },
      { property: "og:description", content: "Selected projects, stack, and contact." },
    ],
  }),
  component: Index,
});

const PROJECTS = [
  {
    id: "01",
    name: "atlas-queue",
    tagline: "Distributed job queue with at-least-once semantics",
    stack: ["Go", "Redis", "gRPC", "Kubernetes"],
    metric: "12k jobs/s sustained",
    status: "live",
    github: "https://github.com/anivelaga/atlas-queue",
    demo: "https://atlas.velaga.dev",
  },
  {
    id: "02",
    name: "pixie-cdn",
    tagline: "Edge image transform & cache layer with on-the-fly resizing",
    stack: ["Rust", "WASM", "Cloudflare Workers"],
    metric: "p99 < 30ms",
    status: "live",
    github: "https://github.com/anivelaga/pixie-cdn",
    demo: "https://pixie.velaga.dev",
  },
  {
    id: "03",
    name: "loomctl",
    tagline: "Declarative CLI for managing multi-region Postgres replicas",
    stack: ["TypeScript", "Postgres", "Terraform"],
    metric: "8 regions",
    status: "beta",
    github: "https://github.com/anivelaga/loomctl",
    demo: null,
  },
  {
    id: "04",
    name: "specter",
    tagline: "Observability SDK with low-overhead tracing and sampling",
    stack: ["Rust", "OpenTelemetry"],
    metric: "<1% overhead",
    status: "wip",
    github: "https://github.com/anivelaga/specter",
    demo: null,
  },
];

const STACK = {
  languages: ["TypeScript", "Go", "Rust", "Python", "SQL"],
  systems: ["Postgres", "Redis", "Kafka", "Kubernetes", "gRPC"],
  cloud: ["AWS", "Cloudflare", "GCP", "Terraform"],
  frontend: ["React", "TanStack", "Tailwind", "Vite"],
};

const EXPERIENCE = [
  { when: "2023 — now", role: "Senior Software Engineer", org: "Stealth Infra Co.", note: "Building the distributed job platform powering core workloads." },
  { when: "2020 — 2023", role: "Software Engineer", org: "Northwind Systems", note: "Owned multi-region Postgres tooling and developer CLI." },
  { when: "2018 — 2020", role: "Software Engineer", org: "Quill Labs", note: "Backend services for high-volume ingest pipeline." },
];

function Index() {
  return (
    <div className="min-h-screen text-terminal-fg">
      <TopBar />
      <main className="mx-auto max-w-5xl px-6 pb-32 pt-10 sm:px-10">
        <Hero />
        <Section id="projects" label="projects" cmd="ls -la ~/projects">
          <ProjectsGrid />
        </Section>
        <Section id="about" label="about" cmd="cat ~/.config/stack.toml">
          <Stack />
        </Section>
        <Section id="experience" label="experience" cmd="git log --oneline --pretty=short">
          <Experience />
        </Section>
        <Section id="contact" label="contact" cmd="echo $CONTACT">
          <Contact />
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-terminal-border bg-terminal-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 sm:px-10">
        <div className="flex items-center gap-3 text-xs text-terminal-dim">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full bg-terminal-warn/80" />
            <span className="size-2.5 rounded-full bg-terminal-accent/80" />
          </div>
          <span className="hidden sm:inline">ani@velaga ~ %</span>
        </div>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-[0.18em] text-terminal-dim">
          {[
            ["projects", "#projects"],
            ["about", "#about"],
            ["xp", "#experience"],
            ["contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-terminal-accent">
              ./{label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-terminal-border pb-16 pt-14 sm:pt-20">
      <div className="text-xs uppercase tracking-[0.3em] text-terminal-accent-dim">
        whoami
      </div>
      <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
        Ani Velaga.
        <br />
        <span className="text-terminal-accent text-glow">Software engineer</span>
        <span className="cursor-blink" />
      </h1>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-terminal-dim sm:text-lg">
        <span className="text-terminal-accent">$</span> I build fast, reliable distributed systems — queues, edge runtimes, and the
        tooling that keeps them honest. Currently shipping infrastructure that other engineers depend on.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 border border-terminal-accent bg-terminal-accent/10 px-4 py-2 text-sm font-medium text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-bg"
        >
          <span>./view-projects</span>
          <span className="transition group-hover:translate-x-0.5">→</span>
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 border border-terminal-border px-4 py-2 text-sm text-terminal-fg transition hover:border-terminal-accent hover:text-terminal-accent"
        >
          <span>./contact</span>
        </a>
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-terminal-border pt-6 text-xs sm:grid-cols-4">
        {[
          ["uptime", "8 yrs"],
          ["systems", "shipped 20+"],
          ["timezone", "UTC−05"],
          ["status", "open to collab"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="uppercase tracking-[0.18em] text-terminal-dim">{k}</dt>
            <dd className="mt-1 text-terminal-fg">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Section({
  id,
  label,
  cmd,
  children,
}: {
  id: string;
  label: string;
  cmd: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-terminal-border py-16 sm:py-24">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-terminal-accent-dim">// {label}</div>
          <div className="mt-2 font-mono text-sm text-terminal-dim">
            <span className="text-terminal-accent">$</span> {cmd}
          </div>
        </div>
        <a href={`#${id}`} className="text-xs text-terminal-dim transition hover:text-terminal-accent">
          #
        </a>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function ProjectsGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {PROJECTS.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 80}>
          <article className="group relative flex h-full flex-col border border-terminal-border bg-terminal-surface/60 p-6 transition hover:border-terminal-accent hover:bg-terminal-surface">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-terminal-dim">
              <span>proj_{p.id}</span>
              <StatusBadge status={p.status} />
            </div>
            <h3 className="mt-4 font-mono text-xl text-terminal-fg group-hover:text-terminal-accent">
              {p.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-terminal-dim">{p.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="border border-terminal-border px-2 py-0.5 text-[11px] text-terminal-dim"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 flex-1 border-t border-terminal-border pt-3 text-[11px] text-terminal-dim">
              <span className="text-terminal-accent">›</span> {p.metric}
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-terminal-border px-3 py-1.5 text-terminal-fg transition hover:border-terminal-accent hover:text-terminal-accent"
              >
                <span>[github]</span>
                <span>↗</span>
              </a>
              {p.demo ? (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-terminal-accent bg-terminal-accent/10 px-3 py-1.5 text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-bg"
                >
                  <span>[live demo]</span>
                  <span>↗</span>
                </a>
              ) : (
                <span className="text-terminal-dim">[demo: n/a]</span>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
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

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "live"
      ? "text-terminal-accent"
      : status === "beta"
        ? "text-terminal-warn"
        : "text-terminal-dim";
  return (
    <span className={`flex items-center gap-1.5 ${color}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Stack() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.entries(STACK).map(([key, items]) => (
        <div key={key} className="border border-terminal-border bg-terminal-surface/60 p-5">
          <div className="text-[11px] uppercase tracking-[0.25em] text-terminal-accent">[{key}]</div>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-terminal-fg">
            {items.map((i) => (
              <li key={i} className="before:mr-1.5 before:text-terminal-dim before:content-['›']">
                {i}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Experience() {
  return (
    <ol className="space-y-0">
      {EXPERIENCE.map((e, i) => (
        <li
          key={i}
          className="grid grid-cols-[auto_1fr] gap-x-6 border-l border-terminal-border py-5 pl-6 sm:grid-cols-[140px_1fr]"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-terminal-dim">{e.when}</div>
          <div>
            <div className="font-mono text-base text-terminal-fg">
              {e.role} <span className="text-terminal-accent">@</span>{" "}
              <span className="text-terminal-accent">{e.org}</span>
            </div>
            <p className="mt-1 text-sm text-terminal-dim">{e.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Contact() {
  const links = [
    { k: "email", v: "ani@velaga.dev", href: "mailto:ani@velaga.dev" },
    { k: "github", v: "github.com/anivelaga", href: "https://github.com/anivelaga" },
    { k: "linkedin", v: "linkedin.com/in/anivelaga", href: "https://linkedin.com/in/anivelaga" },
    { k: "x", v: "@anivelaga", href: "https://x.com/anivelaga" },
  ];
  return (
    <div className="border border-terminal-border bg-terminal-surface/60 p-6 font-mono text-sm">
      <div className="text-terminal-dim">
        <span className="text-terminal-accent">$</span> cat contact.txt
      </div>
      <ul className="mt-4 divide-y divide-terminal-border">
        {links.map((l) => (
          <li key={l.k} className="flex items-center justify-between py-2.5">
            <span className="text-terminal-dim">{l.k.padEnd(10, ".")}.</span>
            <a
              href={l.href}
              className="text-terminal-fg transition hover:text-terminal-accent hover:underline underline-offset-4"
            >
              {l.v}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-terminal-dim">
        <span className="text-terminal-accent">›</span> available for select consulting & full-time roles.
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-terminal-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-terminal-dim sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <span className="text-terminal-accent">$</span> exit 0 — © {new Date().getFullYear()} Ani Velaga
        </div>
        <div>built with care · v1.0.0</div>
      </div>
    </footer>
  );
}

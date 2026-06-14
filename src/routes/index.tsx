import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  serialBoard3d,
  serialBoardFront,
  serialBoardLayout,
  serialBoardDiff,
  thrusterGlbSrc,
} from "@/lib/pcbImages";

// Allow <model-viewer> custom element in JSX
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

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

type Project = {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  year?: string;
  links?: { label: string; href: string }[];
  placeholderCaption?: string;
  embedUrl?: string;
  comingSoon?: boolean;
};

type Category = {
  id: string;
  label: string;
  intro: string;
  projects: Project[];
};

const CATEGORIES: Category[] = [
  {
    id: "01",
    label: "PCB Design — CUAUV",
    intro:
      "Designed and laid out production PCBs in Altium Designer for Cornell's autonomous submarine. Hardware-first: 4-layer stackups, differential pair routing, ESD protection.",
    projects: [
      {
        id: "A",
        name: "Serial Board",
        year: "Spring 2026",
        tagline:
          "Central communication hub for the submarine. Aggregates 16 RS-232 RX/TX channels from sensors and peripherals into a single USB-C connection to the Jetson AI computer. Uses FTDI USB-to-UART ICs with RS-232 level shifting. Spring 2026 added SMF05CT1G TVS diode arrays for ESD protection on all 32 signal lines, DVL direct-connect header, and hot-swap EEPROM footprint. 4-layer PCB, 3.701\" x 4.291\".",
        stack: ["Altium Designer", "4-Layer PCB", "RS-232", "USB-C", "FTDI", "ESD Protection"],
        links: [
          { label: "Altium", href: "https://cuauv.365.altium.com/designs/489558F7-31D3-4C39-8F75-AE5F5562EFF5#design" },
        ],
        placeholderCaption: "Serial Board 3D Render",
      },
      {
        id: "B",
        name: "Serial Test Board",
        tagline:
          "Breakout and validation board for the Serial Board. Exposes all 16 RS-232 channels as labeled headers for bench testing without the full submarine harness. Used during bring-up to verify level-shifter voltages, FTDI enumeration, and loopback integrity on each channel pair.",
        stack: ["Altium Designer", "Test & Validation", "RS-232", "Breakout Board"],
        links: [
          { label: "Altium", href: "https://cuauv.365.altium.com/designs/93799FBC-513E-446E-8096-13A66B62C593#design" },
        ],
      },
      {
        id: "C",
        name: "Thruster Board — Orion",
        tagline:
          "Motor driver PCB for the Orion vehicle's thruster array. Receives PWM/CAN commands from the Jetson via backplane connector and drives 8 brushless DC thrusters. Handles power distribution, overcurrent protection, and ESC signal conditioning.",
        stack: ["Altium Designer", "Motor Control", "CAN Bus", "PWM", "Power Distribution"],
        links: [
          { label: "Altium", href: "https://cuauv.365.altium.com/designs/91CB0DA0-70CB-4AD0-A772-2822C74EFC66#design" },
          { label: "Wiki", href: "https://wiki.cuauv.org/electrical/orion/documentation/Thrusters-Orion" },
        ],
      },
    ],
  },
  {
    id: "02",
    label: "Networking / LLM Inference Research",
    intro:
      "Exploring how LLM inference latency breaks down at the network layer — profiling attention, KV-cache transfer, and token streaming across distributed GPU clusters.",
    projects: [
      {
        id: "A",
        name: "Distributed KV-Cache Networking",
        tagline: "Measuring KV-cache transfer overhead across tensor-parallel GPU nodes.",
        stack: ["CUDA", "NCCL", "RDMA"],
        comingSoon: true,
      },
      {
        id: "B",
        name: "Tensor-Parallel Inference Profiling",
        tagline: "End-to-end token latency breakdown across attention, all-reduce, and streaming.",
        stack: ["PyTorch", "Triton", "Profiling"],
        comingSoon: true,
      },
    ],
  },
  {
    id: "03",
    label: "Personal Projects",
    intro: "Side experiments and things I build for fun.",
    projects: [
      {
        id: "A",
        name: "In the works",
        tagline: "Something new is being built. Check back soon.",
        stack: [],
        comingSoon: true,
      },
    ],
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
          <span className="text-foreground">Electrical & computer engineer</span> — I design
          hardware at the board level, then push it through the networking stack into LLM
          inference systems. Currently on CUAUV building PCBs for an autonomous submarine.
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
      <div className="mt-20 space-y-24 sm:space-y-32">
        {CATEGORIES.map((cat) => (
          <CategoryBlock key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryBlock({ category: c }: { category: Category }) {
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-12">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-dim sm:col-span-3">
          <span className="text-mark">{c.id}</span> / Category
        </div>
        <div className="sm:col-span-9">
          <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {c.label}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-dim">{c.intro}</p>
        </div>
      </div>
      <ul className="mt-12 divide-y divide-border border-y border-border">
        {c.projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 70}>
            <ProjectRow project={p} categoryId={c.id} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function ProjectRow({ project: p, categoryId }: { project: Project; categoryId: string }) {
  return (
    <article
      className={`group grid grid-cols-12 items-baseline gap-6 py-10 transition-colors ${
        p.comingSoon ? "opacity-50" : ""
      }`}
    >
      <div className="col-span-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint sm:col-span-2">
        {categoryId}.{p.id}
        {p.year ? <> / {p.year}</> : null}
      </div>
      <div className="col-span-12 sm:col-span-7">
        <h4 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-mark sm:text-3xl">
          {p.name}
          {p.comingSoon ? (
            <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Coming Soon
            </span>
          ) : null}
        </h4>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-dim">{p.tagline}</p>
        {p.stack.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
            {p.stack.map((s, i) => (
              <span key={s}>
                {s}
                {i < p.stack.length - 1 ? <span className="ml-5 text-rule">/</span> : null}
              </span>
            ))}
          </div>
        ) : null}
        {p.placeholderCaption ? (
          <figure className="mt-6 max-w-xl">
            <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-border bg-secondary/60 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
              [ Image ]
            </div>
            <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              {p.placeholderCaption}
            </figcaption>
          </figure>
        ) : null}
        {p.embedUrl ? (
          <figure className="mt-6">
            <iframe
              src={p.embedUrl}
              title={`${p.name} interactive 3D viewer`}
              allow="fullscreen"
              style={{
                width: "100%",
                height: 480,
                borderRadius: 8,
                border: "1px solid #e5e5e5",
              }}
            />
            <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              Interactive 3D — pan & rotate
            </figcaption>
          </figure>
        ) : null}
      </div>
      <div className="col-span-12 flex flex-wrap gap-6 text-sm sm:col-span-3 sm:justify-end">
        {p.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-foreground transition hover:text-mark"
          >
            <span className="underline decoration-rule underline-offset-4 group-hover/link:decoration-mark">
              {l.label}
            </span>
            <span className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
              ↗
            </span>
          </a>
        ))}
        {!p.links?.length && !p.comingSoon ? (
          <span className="text-ink-faint">— Internal project</span>
        ) : null}
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
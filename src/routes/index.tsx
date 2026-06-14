import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  serialGlbSrc,
} from "@/lib/pcbImages";

// Allow <model-viewer> custom element in JSX (React 19 uses React.JSX)
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          "auto-rotate-delay"?: string | number;
          "rotation-per-second"?: string;
          "interaction-prompt"?: string;
          "shadow-intensity"?: string | number;
          loading?: string;
          reveal?: string;
          ar?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ani Velaga — Electrical & Computer Engineer" },
      { name: "description", content: "Software engineer building reliable, performant systems. Selected projects, skills, and contact." },
      { property: "og:title", content: "Ani Velaga — Electrical & Computer Engineer" },
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
        placeholderCaption: "Serial Board 3D Render",
      },
      {
        id: "B",
        name: "Serial Test Board",
        tagline:
          "Breakout and validation board for the Serial Board. Exposes all 16 RS-232 channels as labeled headers for bench testing without the full submarine harness. Used during bring-up to verify level-shifter voltages, FTDI enumeration, and loopback integrity on each channel pair.",
        stack: ["Altium Designer", "Test & Validation", "RS-232", "Breakout Board"],
      },
      {
        id: "C",
        name: "Thruster Board — Orion",
        tagline:
          "Motor driver PCB for the Orion vehicle's thruster array. Receives PWM/CAN commands from the Jetson via backplane connector and drives 8 brushless DC thrusters. Handles power distribution, overcurrent protection, and ESC signal conditioning.",
        stack: ["Altium Designer", "Motor Control", "CAN Bus", "PWM", "Power Distribution"],
        links: [
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
        year: "Fall 2025",
        tagline:
          "Research into optimizing KV-cache transfer across GPU nodes during LLM inference. Profiled NCCL all-gather latency on 4-GPU clusters and experimented with RDMA-based direct peer-to-peer transfers to cut inter-node round-trip time. Built a Python harness using PyTorch distributed to benchmark cache hit rate vs. recompute cost under varying sequence lengths.",
        stack: ["CUDA", "NCCL", "RDMA", "PyTorch", "Python"],
      },
      {
        id: "B",
        name: "LLM Inference Throughput Benchmarking",
        year: "Spring 2026",
        tagline:
          "End-to-end benchmarking pipeline for transformer inference on NVIDIA A100s. Measured tokens/sec, memory bandwidth utilization, and KV-cache memory footprint across batch sizes and context lengths. Identified bottlenecks in attention kernel scheduling and proposed a batching strategy that improved throughput by ~18% on long-context workloads.",
        stack: ["CUDA", "TensorRT", "Python", "NVIDIA A100"],
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
        name: "Custom PCB Mechanical Keyboard",
        year: "Summer 2025",
        tagline:
          "Designed a 65% layout mechanical keyboard PCB from scratch in KiCad. Implemented hot-swap socket footprints for MX-compatible switches, per-key RGB via WS2812B LED daisy chain, and USB-C HID with an RP2040 microcontroller running QMK firmware. 2-layer board, manufactured through JLCPCB.",
        stack: ["KiCad", "RP2040", "QMK", "USB-C", "RGB"],
      },
      {
        id: "B",
        name: "Home Lab Networking Setup",
        year: "Ongoing",
        tagline:
          "Built a home networking lab for low-latency experimentation. Flashed OpenWrt on a TP-Link router, set up VLANs for traffic isolation, configured WireGuard VPN, and wired a 2.5GbE switch for inter-node throughput testing. Used for running local LLM inference and testing distributed computing setups.",
        stack: ["OpenWrt", "WireGuard", "VLANs", "Networking", "Linux"],
      },
    ],
  },
];

const SKILLS = [
  "Altium Designer",
  "KiCad",
  "C++",
  "Python",
  "CUDA",
  "PyTorch",
  "Linux",
  "Git",
];

const EXPERIENCE = [
  {
    when: "Sep 2024 — Present",
    role: "Electrical Engineer",
    org: "CUAUV",
    note: "Design and lay out production PCBs for Cornell's autonomous submarine. Responsible for the Serial Board (16-channel RS-232 aggregation to USB-C), Serial Test Board (bench-level validation harness), and Thruster Board (8-channel ESC driver with CAN bus). Own full board lifecycle: schematic capture, layout, DFM review, bring-up, and integration testing with the software team.",
  },
  {
    when: "Jan 2026 — Present",
    role: "Undergraduate Researcher",
    org: "Cornell ECE",
    note: "Investigating distributed KV-cache networking for LLM inference. Focus on inter-GPU communication overhead during prefill and decode phases. Benchmarking NCCL collective operations vs. RDMA direct transfers on multi-GPU clusters.",
  },
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
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = c.projects.find((p) => p.id === openId) ?? null;
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
            <ProjectRow
              project={p}
              categoryId={c.id}
              onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
            />
          </Reveal>
        ))}
      </ul>
      <Sheet open={!!openProject} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
          {openProject ? (
            <ProjectDetails project={openProject} categoryId={c.id} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProjectRow({
  project: p,
  categoryId,
  onOpen,
}: {
  project: Project;
  categoryId: string;
  onOpen?: () => void;
}) {
  const clickable = !!onOpen;
  return (
    <article
      onClick={onOpen}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen?.();
              }
            }
          : undefined
      }
      className={`group grid grid-cols-12 items-baseline gap-6 py-10 transition-colors ${
        p.comingSoon ? "opacity-50" : ""
      } ${clickable ? "cursor-pointer hover:bg-secondary/40 -mx-4 px-4 rounded-sm" : ""}`}
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
        {clickable ? (
          <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint transition-colors group-hover:text-mark">
            → View details
          </div>
        ) : null}
      </div>
      <div
        className="col-span-12 flex flex-wrap gap-6 text-sm sm:col-span-3 sm:justify-end"
        onClick={(e) => e.stopPropagation()}
      >
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

function ProjectDetails({
  project: p,
  categoryId,
}: {
  project: Project;
  categoryId: string;
}) {
  const isSerial = p.name === "Serial Board";
  const isThruster = p.name.startsWith("Thruster Board");

  return (
    <div className="flex flex-col gap-6">
      <SheetHeader className="text-left">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          {categoryId}.{p.id}
          {p.year ? <> / {p.year}</> : null}
        </div>
        <SheetTitle className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {p.name}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Project details for {p.name}
        </SheetDescription>
      </SheetHeader>

      <p className="text-base leading-relaxed text-ink-dim">{p.tagline}</p>

      {p.stack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}

      {isSerial ? <SerialBoardGallery /> : null}
      {isThruster ? <ThrusterViewer /> : null}

      {p.links?.length ? (
        <div className="border-t border-border pt-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Links
          </div>
          <div className="mt-3 flex flex-wrap gap-5 text-sm">
            {p.links.map((l) => (
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
                <span>↗</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-border bg-secondary/60 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
        [ Image coming soon ]
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[16/10] w-full rounded-md border border-border object-cover"
    />
  );
}

function SerialBoardGallery() {
  return (
    <Tabs defaultValue="3d" className="w-full">
      <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-secondary/60">
        <TabsTrigger value="3d">3D View</TabsTrigger>
        <TabsTrigger value="layout">PCB Layout</TabsTrigger>
        <TabsTrigger value="front">Front View</TabsTrigger>
        <TabsTrigger value="diff">Diff Pairs</TabsTrigger>
      </TabsList>
      <TabsContent value="3d">
        <GalleryImage src={serialBoard3d} alt="Serial Board 3D render" />
      </TabsContent>
      <TabsContent value="layout">
        <GalleryImage src={serialBoardLayout} alt="Serial Board PCB layout" />
      </TabsContent>
      <TabsContent value="front">
        <GalleryImage src={serialBoardFront} alt="Serial Board front view" />
      </TabsContent>
      <TabsContent value="diff">
        <GalleryImage src={serialBoardDiff} alt="Serial Board differential pairs" />
      </TabsContent>
    </Tabs>
  );
}

function ThrusterViewer() {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {thrusterGlbSrc ? (
        <model-viewer
          src={thrusterGlbSrc}
          alt="Thruster Board 3D model"
          auto-rotate
          camera-controls
          rotation-per-second="20deg"
          interaction-prompt="none"
          shadow-intensity="1"
          loading="eager"
          reveal="auto"
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#1a1a1a",
            "--poster-color": "#1a1a1a",
          } as React.CSSProperties}
        >
          <div
            slot="progress-bar"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
          </div>
        </model-viewer>
      ) : (
        <div className="flex h-[400px] items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          [ 3D model coming soon ]
        </div>
      )}
    </div>
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
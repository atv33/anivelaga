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
  serialBoardFront,
  serialBoardLayout,
  serialBoardDiff,
  thrusterGlbSrc,
  serialGlbSrc,
} from "@/lib/pcbImages";
import headshotAsset from "@/assets/headshot.jpg.asset.json";
import serialLayoutAsset from "@/assets/serial-layout.png.asset.json";
import serialFrontAsset from "@/assets/serial-front.png.asset.json";
import serialBackAsset from "@/assets/serial-back.png.asset.json";

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
          exposure?: string | number;
          "environment-image"?: string;
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
      "Research into distributed inference systems at Cornell ECE. Focus on KV-cache networking and throughput optimization across multi-GPU clusters.",
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
    intro: "Side projects in hardware and infrastructure.",
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
      <SideRail />
      <main>
        <Hero />
        <Ticker />
        <Work />
        <PcbDivider />
        <About />
        <PcbDivider />
        <Experience />
        <PcbDivider />
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
        <a href="#top" className="font-mono text-sm font-bold tracking-tight uppercase">
          Ani Velaga
        </a>
        <nav className="flex items-center gap-7 font-mono text-xs uppercase tracking-[0.18em]">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link text-ink-dim transition hover:text-foreground"
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
    <section
      id="top"
      data-section="00"
      className="hero-bg relative mx-auto flex h-screen max-w-6xl flex-col justify-center px-6 sm:px-10"
    >
      <div className="relative z-10">
        <h1 className="font-display text-[clamp(3rem,10vw,9rem)] font-black uppercase">
          Ani
          <br />
          Velaga
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-dim sm:text-xl">
          <span className="text-foreground">Electrical & computer engineer</span> — I design
          hardware at the board level, then push it through the networking stack into LLM
          inference systems. Currently on CUAUV building PCBs for an autonomous submarine.
          <span className="blink-cursor">_</span>
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-3 px-6 font-mono text-xs uppercase tracking-[0.28em] text-ink-dim sm:px-10">
        <span className="size-1.5 rounded-full bg-mark" />
        Available for new work — 2026
      </div>
    </section>
  );
}

const SERIAL_INLINE_GLB = "https://files.catbox.moe/tgly0l.glb";
const SERIAL_TEST_INLINE_GLB = "https://files.catbox.moe/dpd9ku.glb";
const THRUSTER_INLINE_GLB = "https://files.catbox.moe/x54j79.glb";

function useMouseOrbit(idleElevation: number) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current as (HTMLElement & { setAttribute: (k: string, v: string) => void }) | null;
    if (!el) return;
    const idle = { az: 0, el: idleElevation };
    const target = { az: idle.az, el: idle.el };
    const current = { az: idle.az, el: idle.el };
    const setOrbit = () => {
      el.setAttribute("camera-orbit", `${current.az}deg ${current.el}deg auto`);
    };
    setOrbit();
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.az = (x - 0.5) * 120;
      target.el = idle.el + (y - 0.5) * 30;
    };
    const onLeave = () => {
      target.az = idle.az;
      target.el = idle.el;
    };
    let raf = 0;
    const tick = () => {
      current.az += (target.az - current.az) * 0.12;
      current.el += (target.el - current.el) * 0.12;
      setOrbit();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [idleElevation]);
  return ref;
}

function InlineSerialModel({
  embedded = false,
  src = SERIAL_INLINE_GLB,
  idleElevation = 30,
}: {
  embedded?: boolean;
  src?: string;
  idleElevation?: number;
}) {
  const ref = useMouseOrbit(idleElevation);
  return (
    <div
      className={embedded ? "h-full" : "col-span-12 mt-4"}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={embedded ? "overflow-hidden h-full" : "overflow-hidden border border-border"}
        style={{ backgroundColor: "#111", width: "100%", height: embedded ? "100%" : 300, minHeight: embedded ? 350 : undefined }}
      >
        <model-viewer
          ref={ref as unknown as React.Ref<HTMLElement>}
          src={src}
          alt="Serial Board 3D model"
          camera-controls
          rotation-per-second="20deg"
          interaction-prompt="none"
          loading="eager"
          reveal="auto"
          style={{ width: "100%", height: "100%", backgroundColor: "#111" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function Ticker({ reverse = false }: { reverse?: boolean }) {
  // Generate a long binary string. Doubled to make the marquee seamless.
  const segment = Array.from({ length: 64 }, (_, i) =>
    (((i * 2654435761) >>> 0) % 2 === 0 ? "01001010 11010011 00101110" : "10110101 00101100 11010001"),
  ).join("  /  ");
  const content = `${segment}  /  ${segment}`;
  return (
    <div className="overflow-hidden border-y border-border" style={{ background: "#050505" }}>
      <div
        className="ticker-track-fast flex whitespace-nowrap py-3 font-mono text-[11px] tracking-widest text-mark"
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

function PcbDivider() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <div className="pcb-divider" />
    </div>
  );
}

function SideRail() {
  const [active, setActive] = useState("01");
  useEffect(() => {
    const ids: Array<[string, string]> = [
      ["work", "01"],
      ["about", "02"],
      ["experience", "03"],
      ["contact", "04"],
    ];
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "01";
      for (const [id, num] of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = num;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-10 items-center justify-center border-r border-border lg:flex"
    >
      <span
        className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink-faint"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        SECTION <span className="text-mark">{active}</span>
      </span>
    </aside>
  );
}

function SectionHeader({ index, title, kicker }: { index: string; title: string; kicker: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-12">
      <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-dim sm:col-span-3 pl-3" style={{ borderLeft: "2px solid var(--mark)" }}>
        <span className="font-bold text-mark">{index}</span>
        <span className="text-ink-faint"> | {kicker}</span>
      </div>
      <h2 className="font-display text-5xl font-bold sm:col-span-9 sm:text-7xl">{title}</h2>
    </div>
  );
}

function Work() {
  const [tab, setTab] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === tab) ?? CATEGORIES[0];
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="01" kicker="Selected Work" title="Things I've built." />
      <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === tab;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setTab(cat.id)}
              className={`font-mono text-xs uppercase tracking-[0.28em] transition-colors ${
                isActive ? "text-foreground" : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              <span className={isActive ? "font-bold text-mark" : "text-mark/70"}>
                {cat.id}
              </span>
              <span className="ml-2">{cat.label.split(" — ")[0]}</span>
              {isActive ? (
                <span className="mt-2 block h-[2px] w-full bg-mark" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-12">
        <CategoryBlock key={active.id} category={active} />
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
        {c.projects.map((p, i) => {
          // Serial Test Board (01.B) is rendered as a sub-project inside the Serial Board (01.A) card.
          if (c.id === "01" && p.id === "B") return null;

          const testBoard =
            c.id === "01" && p.id === "A"
              ? c.projects.find((x) => x.id === "B") ?? null
              : null;

          return (
            <Reveal as="li" key={p.id} delay={i * 70}>
              {c.id === "01" && p.id === "A" ? (
                <div
                  className="my-6 overflow-hidden"
                  style={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <div className="flex flex-col lg:flex-row" style={{ minHeight: 350 }}>
                    <div className="lg:w-1/2">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
                        bare
                      />
                    </div>
                    <div
                      className="lg:w-1/2"
                      style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <InlineSerialModel embedded src={SERIAL_INLINE_GLB} />
                    </div>
                  </div>
                  {testBoard ? (
                    <SubProjectRow
                      project={testBoard}
                      categoryId={c.id}
                      onOpen={
                        testBoard.comingSoon ? undefined : () => setOpenId(testBoard.id)
                      }
                      modelSrc={SERIAL_TEST_INLINE_GLB}
                    />
                  ) : null}
                </div>
              ) : c.id === "01" && p.id === "C" ? (
                <div
                  className="my-6 overflow-hidden"
                  style={{
                    background: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                  }}
                >
                  <div className="flex flex-col lg:flex-row" style={{ minHeight: 350 }}>
                    <div className="lg:w-1/2">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
                        bare
                      />
                    </div>
                    <div
                      className="lg:w-1/2"
                      style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <InlineSerialModel embedded src={THRUSTER_INLINE_GLB} idleElevation={15} />
                    </div>
                  </div>
                </div>
              ) : (
                <ProjectRow
                  project={p}
                  categoryId={c.id}
                  onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
                />
              )}
            </Reveal>
          );
        })}
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
  bare = false,
}: {
  project: Project;
  categoryId: string;
  onOpen?: () => void;
  bare?: boolean;
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
      } ${clickable ? (bare ? "cursor-pointer px-6" : "cursor-pointer hover:bg-secondary/40 -mx-4 px-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]") : ""}`}
    >
      <div className="col-span-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint sm:col-span-2">
        {categoryId}.{p.id}
        {p.year ? <> / {p.year}</> : null}
      </div>
      <div className="col-span-12 sm:col-span-7">
        <h4 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {p.name}
          {p.comingSoon ? (
            <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Coming Soon
            </span>
          ) : null}
        </h4>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-dim">{p.tagline}</p>
        {p.stack.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="tag-pill">{s}</span>
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
          <span className="text-ink-faint">
            {categoryId === "02"
              ? "— Cornell ECE Research"
              : categoryId === "03"
                ? "— Personal project"
                : "— Internal project"}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function SubProjectRow({
  project: p,
  categoryId,
  onOpen,
  modelSrc,
}: {
  project: Project;
  categoryId: string;
  onOpen?: () => void;
  modelSrc: string;
}) {
  const clickable = !!onOpen;
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
      className="flex flex-col lg:flex-row"
    >
      <div
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
        className={`lg:w-1/2 px-6 py-5 ${clickable ? "cursor-pointer" : ""}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
          ↳ Sub-project &nbsp;·&nbsp; {categoryId}.{p.id}
        </div>
        <h5 className="mt-2 font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
          {p.name}
        </h5>
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ink-dim">
          {p.tagline.split(".")[0]}.
        </p>
        {clickable ? (
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-mark">
            → View details
          </div>
        ) : null}
      </div>
      <div
        className="lg:w-1/2"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", minHeight: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "100%", height: "100%", minHeight: 200 }} className="overflow-hidden">
          <model-viewer
            src={modelSrc}
            alt={`${p.name} 3D model`}
            camera-controls
            rotation-per-second="20deg"
            interaction-prompt="none"
            loading="eager"
            reveal="auto"
            style={{ width: "100%", height: "100%", minHeight: 200, backgroundColor: "transparent" } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
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
            <span key={s} className="tag-pill">{s}</span>
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
  const images = [
    { id: "layout", label: "2D Layout", src: serialLayoutAsset.url, alt: "Serial Board 2D PCB schematic layout" },
    { id: "front", label: "3D Front", src: serialFrontAsset.url, alt: "Serial Board 3D front render" },
    { id: "back", label: "3D Back", src: serialBackAsset.url, alt: "Serial Board 3D back render" },
  ];
  const [active, setActive] = useState(images[0].id);
  const current = images.find((i) => i.id === active) ?? images[0];
  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border" style={{ backgroundColor: "#1a1a1a" }}>
        <img
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mark">
            {String(images.findIndex((i) => i.id === active) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
          <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-foreground">
            {current.label}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(img.id)}
            className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-sm border transition ${
              active === img.id ? "border-mark" : "border-border opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <img src={img.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 p-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground">
              {img.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SerialViewer() {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {serialGlbSrc ? (
        <model-viewer
          src={serialGlbSrc}
          alt="Serial Board 3D model"
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
      <SectionHeader index="02" kicker="About" title="Who I am." />
      <div className="mt-20 grid gap-16 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start sm:gap-8">
            <img
              src={headshotAsset.url}
              alt="Ani Velaga"
              width={180}
              height={180}
              className="size-[180px] shrink-0 object-cover border border-border"
              style={{ borderRadius: "50%" }}
            />
            <div>
              <p className="text-lg leading-relaxed text-ink-dim">
            I'm an electrical and computer engineering student at Cornell, currently on CUAUV —
            Cornell's autonomous underwater vehicle team. I design production PCBs in Altium
            Designer: 4-layer stackups, differential pair routing, ESD protection, high-speed USB.
            The submarine goes in real water, so the boards have to work.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-ink-dim">
            My work runs from board-level hardware through the networking stack up into LLM
            inference systems. I care about the full path: what the silicon is doing, how data
            moves between nodes, and where inference bottlenecks actually live. I'm looking for
            roles where that end-to-end view matters.
              </p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-5 sm:pl-12">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">
            Skills
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span key={s} className="tag-pill">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="03" kicker="Experience" title="Where I've worked." />
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
          Open to full-time roles and research positions in hardware engineering, embedded
          systems, and ML infrastructure. I'm especially interested in teams working at the
          hardware-software boundary. Email is the fastest way to reach me.
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
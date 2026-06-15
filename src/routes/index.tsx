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
    <CircuitHero />
  );
}

// ============================================================
// CircuitHero — curated CPU-architecture-style SVG hero
// All coordinates are fixed (SSR-safe, no RNG).
// ============================================================
const VB_W = 1600;
const VB_H = 900;

// Portrait module — central component
const PORT = { x: 1060, y: 270, w: 260, h: 320 };
const PORT_INSET = 14;

// Pin pad layout helpers
const yPads = [296, 332, 368, 404, 440, 476, 512, 548];     // 8 vertical pad rows (left/right)
const xPads = [1103, 1147, 1190, 1233, 1277];               // 5 horizontal pad cols (top/bottom)

type Pad = { x: number; y: number; w: number; h: number };
const leftPads:   Pad[] = yPads.map((y) => ({ x: PORT.x - 8,        y: y - 5,  w: 8,  h: 10 }));
const rightPads:  Pad[] = yPads.map((y) => ({ x: PORT.x + PORT.w,   y: y - 5,  w: 8,  h: 10 }));
const topPads:    Pad[] = xPads.map((x) => ({ x: x - 5, y: PORT.y - 8,         w: 10, h: 8  }));
const bottomPads: Pad[] = xPads.map((x) => ({ x: x - 5, y: PORT.y + PORT.h,    w: 10, h: 8  }));

// Trace data: d = SVG path, w = stroke width, o = opacity (0..1), pulse?: ms duration
type Trace = { id: string; d: string; w: number; o: number; pulse?: number };

// Curated trace list — every path begins at a portrait-module pin and ends
// at a via, a secondary chip pin, an edge connector, or off-screen.
const TRACES: Trace[] = [
  // ── LEFT side (avoiding the lower-left text zone) ──────────────────
  { id: "L1", d: "M 1052 296 H 920 V 200 H 760 V 175",      w: 1.5, o: 0.62, pulse: 6200 },
  { id: "L2", d: "M 1052 332 H 980 V 280 H 880",            w: 1.25, o: 0.5 },
  { id: "L3", d: "M 1052 368 H 860 V 265 H 560",            w: 1.5, o: 0.58 },
  { id: "L4", d: "M 1052 404 H 940 V 440 H 820",            w: 1.25, o: 0.45, pulse: 7400 },
  { id: "L5", d: "M 1052 440 H 980",                         w: 1, o: 0.4 },
  { id: "L6", d: "M 1052 476 H 900 V 510 H 720",            w: 1.25, o: 0.42 },
  // ── TOP side ───────────────────────────────────────────────────────
  { id: "T1", d: "M 1103 262 V 180 H 920 V 80",             w: 1.25, o: 0.5 },
  { id: "T2", d: "M 1147 262 V 200 H 1500",                  w: 1.5, o: 0.58, pulse: 5600 },
  { id: "T3", d: "M 1190 262 V 0",                           w: 1.75, o: 0.62, pulse: 4800 },
  { id: "T4", d: "M 1233 262 V 150 H 1400 V 40",            w: 1.25, o: 0.48 },
  { id: "T5", d: "M 1277 262 V 200 H 1380",                  w: 1, o: 0.42 },
  // ── RIGHT side ─────────────────────────────────────────────────────
  { id: "R1", d: "M 1328 296 H 1500 V 220 H 1600",          w: 1.5, o: 0.55, pulse: 6800 },
  { id: "R2", d: "M 1328 332 H 1460 V 290 H 1600",          w: 1.25, o: 0.45 },
  { id: "R3", d: "M 1328 368 H 1480 V 400 H 1540",          w: 1.5, o: 0.55 },
  { id: "R4", d: "M 1328 404 H 1540",                        w: 1.5, o: 0.55 },
  { id: "R5", d: "M 1328 440 H 1500 V 480 H 1540",          w: 1.25, o: 0.48 },
  { id: "R6", d: "M 1328 476 H 1480 V 540 H 1600",          w: 1.25, o: 0.45 },
  { id: "R7", d: "M 1328 512 H 1440 V 600 H 1600",          w: 1, o: 0.4 },
  { id: "R8", d: "M 1328 548 H 1420 V 680 H 1600",          w: 1.25, o: 0.45, pulse: 7800 },
  // ── BOTTOM (lower-right only — keeps lower-left text clean) ────────
  { id: "B1", d: "M 1103 598 V 700 H 1000",                  w: 1.25, o: 0.45 },
  { id: "B2", d: "M 1147 598 V 740 H 1300",                  w: 1, o: 0.4 },
  { id: "B3", d: "M 1190 598 V 900",                          w: 1.5, o: 0.55, pulse: 5200 },
  { id: "B4", d: "M 1233 598 V 680 H 1500 V 760",            w: 1.25, o: 0.48 },
  { id: "B5", d: "M 1277 598 V 720 H 1600",                  w: 1, o: 0.42 },
  // ── Secondary chip extensions (fanout away from chips) ─────────────
  { id: "CA1", d: "M 730 110 V 60 H 380",                    w: 1, o: 0.38 },
  { id: "CA2", d: "M 700 130 H 600 V 70",                    w: 1, o: 0.35 },
  { id: "CA3", d: "M 830 130 H 950 V 60 H 1080",             w: 1, o: 0.4 },
  { id: "CC1", d: "M 510 240 V 180 H 380",                   w: 1, o: 0.34 },
  { id: "CC2", d: "M 480 265 H 360 V 320",                   w: 1, o: 0.34 },
];

// Endpoint markers (vias) — placed at trace terminations not absorbed by a chip
const ENDPOINTS: { x: number; y: number; r?: number }[] = [
  { x: 880, y: 280 },
  { x: 820, y: 440 },
  { x: 980, y: 440 },
  { x: 720, y: 510 },
  { x: 1380, y: 200, r: 3 },
  { x: 1500, y: 200 },
  { x: 1000, y: 700 },
  { x: 1300, y: 740 },
  { x: 1500, y: 760 },
  { x: 380, y: 60 },
  { x: 380, y: 180 },
  { x: 600, y: 70 },
  { x: 1080, y: 60 },
  { x: 560, y: 320 },
];

// Secondary components — 1 chip upper-mid, 1 chip upper-left, 1 edge connector right
const CHIP_A = { x: 700, y: 110, w: 130, h: 70 };   // upper-mid
const CHIP_C = { x: 480, y: 240, w: 80,  h: 50 };   // upper-left
const EDGE_R = { x: 1540, y: 380, w: 60, h: 160 };  // right edge connector (off-screen partial)

function HeroText() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] mx-auto flex max-w-6xl items-end px-6 pb-24 sm:px-10 sm:pb-28">
      <div className="pointer-events-auto max-w-xl">
        <h1
          className="font-display font-black uppercase text-white"
          style={{
            fontSize: "clamp(3.25rem,10.5vw,8rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.86,
          }}
        >
          Ani
          <br />
          Velaga
        </h1>
        <p className="mt-6 max-w-md font-mono text-[13px] leading-relaxed text-neutral-400">
          <span className="text-neutral-100">Electrical &amp; computer engineer</span> — I design
          hardware at the board level, then push it through the networking stack into LLM
          inference systems. Currently on CUAUV building PCBs for an autonomous submarine.
          <span className="blink-cursor">_</span>
        </p>
      </div>
    </div>
  );
}

function PortraitModule() {
  const ix = PORT.x + PORT_INSET;
  const iy = PORT.y + PORT_INSET;
  const iw = PORT.w - PORT_INSET * 2;
  const ih = PORT.h - PORT_INSET * 2;
  return (
    <g>
      {/* very soft shadow under the module */}
      <ellipse cx={PORT.x + PORT.w / 2} cy={PORT.y + PORT.h + 22} rx={PORT.w / 2 + 30} ry={14} fill="rgba(0,0,0,0.55)" />
      {/* outer dark package */}
      <rect
        x={PORT.x}
        y={PORT.y}
        width={PORT.w}
        height={PORT.h}
        fill="#141414"
        stroke="#2a2a2a"
        strokeWidth="1"
        rx="2"
      />
      {/* inner image border */}
      <rect
        x={ix - 2}
        y={iy - 2}
        width={iw + 4}
        height={ih + 4}
        fill="none"
        stroke="#3a3a3a"
        strokeWidth="1"
      />
      <image
        href={headshotAsset.url}
        x={ix}
        y={iy}
        width={iw}
        height={ih}
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: "grayscale(15%) brightness(0.92) contrast(1.03)" }}
      />
      {/* orientation notch */}
      <circle cx={PORT.x + 10} cy={PORT.y + 10} r="2" fill="#3a3a3a" />

      {/* pads on all four sides */}
      <g fill="#2b2b2b" stroke="#454545" strokeWidth="0.6">
        {[...leftPads, ...rightPads, ...topPads, ...bottomPads].map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="1" />
        ))}
      </g>
    </g>
  );
}

function SecondaryChip({ x, y, w, h, pinsTop = 0, pinsBot = 0, pinsLeft = 0, pinsRight = 0 }: {
  x: number; y: number; w: number; h: number;
  pinsTop?: number; pinsBot?: number; pinsLeft?: number; pinsRight?: number;
}) {
  const xs = (n: number) => Array.from({ length: n }, (_, i) => x + ((i + 1) * w) / (n + 1));
  const ys = (n: number) => Array.from({ length: n }, (_, i) => y + ((i + 1) * h) / (n + 1));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx={x + 6} cy={y + 6} r="1.5" fill="#444" />
      <g fill="#262626" stroke="#3d3d3d" strokeWidth="0.5">
        {xs(pinsTop).map((cx, i) => (
          <rect key={`t${i}`} x={cx - 3} y={y - 4} width={6} height={4} />
        ))}
        {xs(pinsBot).map((cx, i) => (
          <rect key={`b${i}`} x={cx - 3} y={y + h} width={6} height={4} />
        ))}
        {ys(pinsLeft).map((cy, i) => (
          <rect key={`l${i}`} x={x - 4} y={cy - 3} width={4} height={6} />
        ))}
        {ys(pinsRight).map((cy, i) => (
          <rect key={`r${i}`} x={x + w} y={cy - 3} width={4} height={6} />
        ))}
      </g>
    </g>
  );
}

function SignalPulse({ d, dur, accent }: { d: string; dur: number; accent?: "blue" | "amber" | "white" }) {
  const fill =
    accent === "blue" ? "rgba(140,180,255,0.95)" :
    accent === "amber" ? "rgba(255,210,140,0.9)" :
    "rgba(255,255,255,0.95)";
  return (
    <g>
      <circle r="2.2" fill={fill} opacity="0.95">
        <animateMotion dur={`${dur / 1000}s`} repeatCount="indefinite" rotate="auto" path={d} />
      </circle>
      <circle r="5" fill={fill} opacity="0.18">
        <animateMotion dur={`${dur / 1000}s`} repeatCount="indefinite" rotate="auto" path={d} />
      </circle>
    </g>
  );
}

function CircuitTraceLayer() {
  return (
    <g>
      {/* secondary chips (rendered before traces so trace endpoints sit on them) */}
      <g opacity="0.85">
        <SecondaryChip {...CHIP_A} pinsTop={5} pinsBot={5} pinsLeft={3} pinsRight={3} />
        <SecondaryChip {...CHIP_C} pinsTop={3} pinsBot={3} pinsLeft={2} pinsRight={2} />
        {/* right-edge connector — partially off-screen */}
        <g>
          <rect x={EDGE_R.x} y={EDGE_R.y} width={EDGE_R.w} height={EDGE_R.h} fill="#111" stroke="#333" strokeWidth="1" />
          {[400, 420, 440, 460, 480, 500, 520].map((cy, i) => (
            <rect key={i} x={EDGE_R.x - 4} y={cy - 3} width={4} height={6} fill="#262626" stroke="#3d3d3d" strokeWidth="0.5" />
          ))}
        </g>
      </g>

      {/* traces */}
      <g fill="none" strokeLinecap="square" strokeLinejoin="round">
        {TRACES.map((t) => (
          <path
            key={t.id}
            id={`trace-${t.id}`}
            d={t.d}
            stroke={t.w >= 1.5 ? "#454545" : "#2f2f2f"}
            strokeOpacity={t.o}
            strokeWidth={t.w}
            className="hero-trace-draw"
          />
        ))}
      </g>

      {/* endpoint vias */}
      <g>
        {ENDPOINTS.map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r={(e.r ?? 2.5) + 1.5} fill="none" stroke="#3a3a3a" strokeWidth="0.8" />
            <circle cx={e.x} cy={e.y} r={e.r ?? 2.5} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </g>
  );
}

function CircuitHero() {
  // pulses — selected traces only
  const pulses = TRACES.filter((t) => t.pulse);
  return (
    <section
      id="top"
      data-section="00"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#060606" }}
    >
      {/* layer 2: circuit SVG */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid slice"
          className="hero-circuit-fade absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            {/* soft fade mask — protects the lower-left text region */}
            <radialGradient id="heroTextFade" cx="22%" cy="86%" r="38%">
              <stop offset="0%" stopColor="#000" />
              <stop offset="55%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#fff" />
            </radialGradient>
            <mask id="heroTraceMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#heroTextFade)" />
              {/* always keep the portrait region fully visible */}
              <rect x={PORT.x - 60} y={PORT.y - 60} width={PORT.w + 120} height={PORT.h + 120} fill="white" />
            </mask>
          </defs>

          {/* circuit layer (under the mask) */}
          <g mask="url(#heroTraceMask)">
            <CircuitTraceLayer />
          </g>

          {/* pulses — above traces, also masked so they don't pop into the text zone */}
          <g mask="url(#heroTraceMask)">
            {pulses.map((t, i) => (
              <SignalPulse
                key={t.id}
                d={t.d}
                dur={t.pulse!}
                accent={i === 0 ? "blue" : i === 3 ? "amber" : "white"}
              />
            ))}
          </g>

          {/* layer 3: portrait module — always visible, above mask */}
          <PortraitModule />
        </svg>
      </div>

      {/* layer 4: text */}
      <HeroText />

      {/* small status pill */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[3] flex items-center justify-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:px-10">
        <span className="size-1.5 rounded-full bg-neutral-300" />
        Available for new work — 2026
      </div>
    </section>
  );
}

// (intentionally unused) placeholder to preserve direction enum scope
const __DIRS_LEGACY: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function chipPins(c: Chip) {
  const out: { p: Pt; side: Side; dir: number }[] = [];
  const xs = Array.from({ length: c.perSide }, (_, i) => c.x + ((i + 1) * c.w) / (c.perSide + 1));
  const ys = Array.from({ length: c.perSide }, (_, i) => c.y + ((i + 1) * c.h) / (c.perSide + 1));
  xs.forEach((x) => out.push({ p: [x, c.y], side: "t", dir: 3 }));
  xs.forEach((x) => out.push({ p: [x, c.y + c.h], side: "b", dir: 1 }));
  ys.forEach((y) => out.push({ p: [c.x, y], side: "l", dir: 2 }));
  ys.forEach((y) => out.push({ p: [c.x + c.w, y], side: "r", dir: 0 }));
  return out;
}

// Lower-left "clean zone" where text lives — traces avoid entering deeply.
const CLEAN = { x: 0, y: 560, w: 720, h: 340 };
function inClean(x: number, y: number, slack = 20) {
  return x < CLEAN.x + CLEAN.w - slack && y > CLEAN.y + slack;
}

function snap(v: number, g = 8) { return Math.round(v / g) * g; }

type Trace = { d: string; w: number };
type Via = { x: number; y: number; pulse?: boolean };
type Pad = { x: number; y: number; w: number; h: number };

type Generated = {
  traces: Trace[];
  vias: Via[];
  pads: Pad[];
  resistors: { x: number; y: number; w: number; h: number; horiz: boolean }[];
  capacitors: { x: number; y: number; horiz: boolean }[];
};

function generateCircuit(): Generated {
  const rand = mulberry32(20260615);
  const traces: Trace[] = [];
  const vias: Via[] = [];
  const pads: Pad[] = [];
  const resistors: Generated["resistors"] = [];
  const capacitors: Generated["capacitors"] = [];

  const terminate = (x: number, y: number) => {
    const r = rand();
    if (r < 0.45) {
      vias.push({ x, y });
    } else if (r < 0.7) {
      pads.push({ x: x - 3, y: y - 3, w: 6, h: 6 });
    } else if (r < 0.88) {
      // small resistor (SMD 0805) inline-ish
      resistors.push({ x: x - 6, y: y - 3, w: 12, h: 6, horiz: rand() > 0.5 });
    } else {
      // capacitor symbol pair
      capacitors.push({ x, y, horiz: rand() > 0.5 });
    }
  };

  // Grow an orthogonal polyline. Returns nothing; appends to `traces`.
  // depth controls recursion for branches.
  const grow = (
    sx: number,
    sy: number,
    sd: number,
    depth: number,
    branchChance: number,
    maxSegs: number,
    weight: number,
  ) => {
    const pts: Pt[] = [[sx, sy]];
    let cx = sx;
    let cy = sy;
    let cd = sd;
    let segs = 0;
    while (segs < maxSegs) {
      const len = snap(40 + Math.floor(rand() * 140));
      const [dx, dy] = DIRS[cd];
      let nx = cx + dx * len;
      let ny = cy + dy * len;
      // clip to bounds
      nx = Math.max(-30, Math.min(VB_W + 30, nx));
      ny = Math.max(-30, Math.min(VB_H + 30, ny));
      // avoid plunging into clean zone — shorten or stop
      if (inClean(nx, ny, 0)) {
        // try to clip the segment so it stops at the clean zone edge
        if (dy > 0) ny = Math.min(ny, CLEAN.y + 24);
        if (dx < 0 && cy > CLEAN.y) nx = Math.max(nx, CLEAN.x + CLEAN.w - 24);
        if (inClean(nx, ny, 0)) break;
      }
      if (Math.abs(nx - cx) < 4 && Math.abs(ny - cy) < 4) break;
      pts.push([nx, ny]);
      cx = nx;
      cy = ny;
      segs++;
      // out-of-bounds → off-screen continuation, end here
      if (cx <= 0 || cx >= VB_W || cy <= 0 || cy >= VB_H) break;
      // maybe spawn a branch at this bend
      if (depth < 2 && rand() < branchChance) {
        const turn = rand() < 0.5 ? 1 : 3;
        const nd = (cd + turn) & 3;
        // small via at the bend marking the branch
        vias.push({ x: cx, y: cy });
        grow(cx, cy, nd, depth + 1, branchChance * 0.55, Math.max(2, maxSegs - 2), Math.max(1, weight - 0.4));
      }
      // choose next direction (continue or turn)
      if (rand() < 0.55) {
        cd = (cd + (rand() < 0.5 ? 1 : 3)) & 3;
      }
    }
    if (pts.length >= 2) {
      const d =
        "M" +
        pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
      traces.push({ d, w: weight });
      const [ex, ey] = pts[pts.length - 1];
      if (ex > 4 && ex < VB_W - 4 && ey > 4 && ey < VB_H - 4) terminate(ex, ey);
    }
  };

  // ----- Chips -----
  const chips: Chip[] = [
    { x: 360, y: 190, w: 120, h: 84, perSide: 4 },
    { x: 720, y: 110, w: 96, h: 72, perSide: 3 },
    { x: 880, y: 470, w: 78, h: 64, perSide: 3 },
  ];
  for (const c of chips) {
    const pins = chipPins(c);
    for (const { p, dir } of pins) {
      // pin stub
      const [dx, dy] = DIRS[dir];
      const tip: Pt = [p[0] + dx * 10, p[1] + dy * 10];
      pads.push({ x: tip[0] - 2, y: tip[1] - 2, w: 4, h: 4 });
      grow(tip[0], tip[1], dir, 0, 0.5, 6, 1.4);
    }
  }

  // ----- Portrait chip pins → dense branching outward -----
  const portrait: Chip = { x: PORTRAIT.x, y: PORTRAIT.y, w: PORTRAIT.w, h: PORTRAIT.h, perSide: 6 };
  for (const { p, dir, side } of chipPins(portrait)) {
    const [dx, dy] = DIRS[dir];
    const stubLen = 16;
    const tip: Pt = [p[0] + dx * stubLen, p[1] + dy * stubLen];
    pads.push({ x: tip[0] - 2.5, y: tip[1] - 2.5, w: 5, h: 5 });
    // a few left-going traces should fade before hitting text — handled by mask
    grow(tip[0], tip[1], dir, 0, side === "l" ? 0.6 : 0.65, side === "l" ? 5 : 7, 1.6);
    // sometimes a second branch in the perpendicular dir
    if (rand() < 0.3) {
      const turn = rand() < 0.5 ? 1 : 3;
      grow(tip[0], tip[1], (dir + turn) & 3, 1, 0.4, 4, 1.2);
    }
    vias.push({ x: p[0], y: p[1] });
  }

  // ----- Edge-origin trunks -----
  const edgeSources: { x: number; y: number; dir: number }[] = [
    { x: 0, y: 120, dir: 0 },
    { x: 0, y: 360, dir: 0 },
    { x: 0, y: 480, dir: 0 },
    { x: VB_W, y: 760, dir: 2 },
    { x: VB_W, y: 180, dir: 2 },
    { x: 1120, y: 0, dir: 1 },
    { x: 280, y: 0, dir: 1 },
    { x: 980, y: 0, dir: 1 },
  ];
  for (const s of edgeSources) {
    grow(s.x, s.y, s.dir, 0, 0.55, 7, 1.5);
  }

  // A handful of pulsing vias near portrait + upper chips
  const pulseTargets = [
    [PORTRAIT.x - 30, PORTRAIT.y + 60],
    [PORTRAIT.x + PORTRAIT.w + 24, PORTRAIT.y + PORTRAIT.h - 40],
    [chips[0].x + chips[0].w + 40, chips[0].y - 20],
    [chips[1].x - 30, chips[1].y + chips[1].h + 30],
  ];
  for (const [x, y] of pulseTargets) {
    vias.push({ x, y, pulse: true });
  }

  return { traces, vias, pads, resistors, capacitors };
}

const PORTRAIT = { x: 1180, y: 280, w: 240, h: 300 };
const CIRCUIT = generateCircuit();

function PortraitChip() {
  const ix = PORTRAIT.x + 14;
  const iy = PORTRAIT.y + 14;
  const iw = PORTRAIT.w - 28;
  const ih = PORTRAIT.h - 28;
  return (
    <g>
      {/* subtle muted glow */}
      <rect
        x={PORTRAIT.x - 18}
        y={PORTRAIT.y - 18}
        width={PORTRAIT.w + 36}
        height={PORTRAIT.h + 36}
        fill="url(#portraitGlow)"
        opacity="0.55"
      />
      {/* outer IC package */}
      <rect
        x={PORTRAIT.x}
        y={PORTRAIT.y}
        width={PORTRAIT.w}
        height={PORTRAIT.h}
        fill="#0a0a0a"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1"
      />
      {/* inner photo frame */}
      <rect
        x={ix - 2}
        y={iy - 2}
        width={iw + 4}
        height={ih + 4}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
      />
      <image href={headshotAsset.url} x={ix} y={iy} width={iw} height={ih} preserveAspectRatio="xMidYMid slice" />
      {/* corner notch (orientation mark) */}
      <circle cx={PORTRAIT.x + 10} cy={PORTRAIT.y + 10} r="2.5" fill="rgba(255,255,255,0.45)" />
    </g>
  );
}

function CircuitBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="hero-circuit-fade absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="portraitGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* Fade mask: bright everywhere except a soft falloff in the lower-left text zone */}
          <radialGradient id="cleanFade" cx="18%" cy="88%" r="42%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="55%" stopColor="#222" />
            <stop offset="100%" stopColor="#fff" />
          </radialGradient>
          <mask id="circuitMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
            <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#cleanFade)" />
          </mask>
        </defs>

        {/* Traces + components live inside the mask */}
        <g mask="url(#circuitMask)" stroke="rgba(255,255,255,0.32)" fill="none">
          {/* ICs */}
          <g opacity="0.35">
            {[
              { x: 360, y: 190, w: 120, h: 84 },
              { x: 720, y: 110, w: 96, h: 72 },
              { x: 880, y: 470, w: 78, h: 64 },
            ].map((c, i) => (
              <g key={i}>
                <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="#070707" strokeWidth="1" />
                <circle cx={c.x + 8} cy={c.y + 8} r="2" fill="rgba(255,255,255,0.4)" stroke="none" />
              </g>
            ))}
          </g>

          {/* Traces */}
          <g strokeLinecap="square" strokeLinejoin="miter">
            {CIRCUIT.traces.map((t, i) => (
              <path
                key={i}
                d={t.d}
                stroke={`rgba(255,255,255,${0.1 + (t.w - 1) * 0.04})`}
                strokeWidth={t.w}
              />
            ))}
          </g>

          {/* Pads */}
          <g fill="rgba(255,255,255,0.45)" stroke="none">
            {CIRCUIT.pads.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} />
            ))}
          </g>

          {/* Resistors (small rect with end caps) */}
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="#0a0a0a">
            {CIRCUIT.resistors.map((r, i) => (
              <rect
                key={i}
                x={r.horiz ? r.x : r.x + (r.w - r.h) / 2}
                y={r.horiz ? r.y : r.y - (r.w - r.h) / 2}
                width={r.horiz ? r.w : r.h}
                height={r.horiz ? r.h : r.w}
              />
            ))}
          </g>

          {/* Capacitors (parallel lines) */}
          <g stroke="rgba(255,255,255,0.45)" strokeWidth="1.2">
            {CIRCUIT.capacitors.map((c, i) =>
              c.horiz ? (
                <g key={i}>
                  <line x1={c.x - 2} y1={c.y - 5} x2={c.x - 2} y2={c.y + 5} />
                  <line x1={c.x + 2} y1={c.y - 5} x2={c.x + 2} y2={c.y + 5} />
                </g>
              ) : (
                <g key={i}>
                  <line x1={c.x - 5} y1={c.y - 2} x2={c.x + 5} y2={c.y - 2} />
                  <line x1={c.x - 5} y1={c.y + 2} x2={c.x + 5} y2={c.y + 2} />
                </g>
              ),
            )}
          </g>

          {/* Vias */}
          <g>
            {CIRCUIT.vias.map((v, i) => (
              <g key={i}>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={v.pulse ? 3.5 : 2.4}
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1"
                  className={v.pulse ? "hero-via-pulse" : undefined}
                />
              </g>
            ))}
          </g>
        </g>

        {/* Portrait — sits ABOVE mask so it is never faded */}
        <PortraitChip />
      </svg>
    </div>
  );
}

const SERIAL_INLINE_GLB = "https://files.catbox.moe/tgly0l.glb";
const SERIAL_TEST_INLINE_GLB = "https://files.catbox.moe/dpd9ku.glb";
const THRUSTER_INLINE_GLB = "https://files.catbox.moe/x54j79.glb";

function useMouseSpin(defaultSpeed = 20) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    let currentSpeed = defaultSpeed;
    let rafId = 0;
    const setSpeed = (s: number) => {
      currentSpeed = s;
      el.setAttribute("rotation-per-second", `${s}deg`);
    };
    setSpeed(defaultSpeed);
    const onMove = (e: MouseEvent) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      const r = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const speed = -60 + x * 180;
      setSpeed(speed);
    };
    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      const startSpeed = currentSpeed;
      const startTime = performance.now();
      const duration = 1500;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const s = startSpeed + (defaultSpeed - startSpeed) * eased;
        setSpeed(s);
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };
      rafId = requestAnimationFrame(tick);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [defaultSpeed]);
  return ref;
}

function InlineSerialModel({
  embedded = false,
  src = SERIAL_INLINE_GLB,
}: {
  embedded?: boolean;
  src?: string;
  idleElevation?: number;
}) {
  const ref = useMouseSpin(20);
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
          auto-rotate
          auto-rotate-delay={0}
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
            auto-rotate
            auto-rotate-delay={0}
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
  const ref = useMouseSpin(20);
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {serialGlbSrc ? (
        <model-viewer
          ref={ref as unknown as React.Ref<HTMLElement>}
          src={serialGlbSrc}
          alt="Serial Board 3D model"
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
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
  const ref = useMouseSpin(20);
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {thrusterGlbSrc ? (
        <model-viewer
          ref={ref as unknown as React.Ref<HTMLElement>}
          src={thrusterGlbSrc}
          alt="Thruster Board 3D model"
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
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
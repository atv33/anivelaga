import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

// ─── Secondary chip / connector geometry (pin tips computed to integers) ───
// CHIP_A — upper-mid. xs(5): x + (i+1)*144/6 = 704,728,752,776,800 ✓
//                    ys(2): y + (i+1)*72/3  = 134,158 ✓
const CHIP_A = { x: 680, y: 110, w: 144, h: 72 };
// CHIP_C — upper-left. xs(3): 404,428,452. ys(2): 240 + 22*(i+1) = 262,284
const CHIP_C = { x: 380, y: 240, w: 96, h: 66 };
// CHIP_B — center-left support chip. xs(2): 520 + 40*(i+1) = 560,600. ys(2): 380+20*(i+1) = 400,420
const CHIP_B = { x: 520, y: 380, w: 120, h: 60 };
// Edge connector right (partially off-canvas)
const EDGE_R = { x: 1540, y: 360, w: 60, h: 220 };
const EDGE_R_PINS = [380, 410, 440, 470, 500, 530, 560]; // y tips, x tip = 1536
// Top edge header — 6 pins, tip y = -10 + 26 + 4 = 20, pin xs are pin centers
const HEADER_T = { x: 880, y: -10, w: 100, h: 26, pins: [890, 906, 922, 938, 954, 970] };

// Inline component types
type Inline =
  | { kind: "resistor";  x: number; y: number; rot?: 0 | 90 | 180 | 270 }
  | { kind: "capacitor"; x: number; y: number; rot?: 0 | 90 | 180 | 270 }
  | { kind: "inductor";  x: number; y: number; rot?: 0 | 90 | 180 | 270 }
  | { kind: "diode";     x: number; y: number; rot?: 0 | 90 | 180 | 270 }
  | { kind: "testpad";   x: number; y: number };

type Pt = { x: number; y: number };
type Built = {
  traces: Trace[];
  vias: Pt[];
  parts: Inline[];
};

// Seeded PRNG so the layout is repeatable per seed.
function mulberry32(seed: number) {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ptsToD(pts: Pt[]): string {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

// Procedural circuit builder. Every trace begins at a real pad/pin tip and
// ends at another real pad/pin tip or the canvas edge. Bend coordinates are
// chosen randomly within tight constraints — composition is preserved.
function buildCircuit(seed: number): Built {
  const rnd = mulberry32(seed);
  const rand = (min: number, max: number) => min + rnd() * (max - min);
  const irand = (min: number, max: number) => Math.round(rand(min, max));
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)]!;

  const traces: Trace[] = [];
  type Seg = { a: Pt; b: Pt };
  const segs: Seg[] = [];
  const viaMap = new Map<string, Pt>();
  const addVia = (p: Pt) => viaMap.set(`${p.x},${p.y}`, p);

  const add = (id: string, pts: Pt[], w: number, o: number, pulse?: number) => {
    traces.push({ id, d: ptsToD(pts), w, o, pulse });
    for (let i = 1; i < pts.length - 1; i++) addVia(pts[i]);
    for (let i = 0; i < pts.length - 1; i++) segs.push({ a: pts[i], b: pts[i + 1] });
  };

  // pulses ~ 30% of routes
  const maybePulse = (base: number) => (rnd() < 0.35 ? base + irand(-600, 600) : undefined);

  // ── Portrait LEFT pads → CHIP_A / CHIP_B / CHIP_C / header ──
  add("L1", [{x:1052,y:296},{x:irand(880,960),y:296},null!,{x:828,y:134}].map((p,i,a)=>p ?? {x:(a[1] as Pt).x,y:134}), 1.5, 0.6, maybePulse(6200) ?? 6200);
  add("L2", [{x:1052,y:332},{x:irand(840,920),y:332},null!,{x:828,y:158}].map((p,i,a)=>p ?? {x:(a[1] as Pt).x,y:158}), 1.25, 0.5, maybePulse(7000));

  const headerPinL3 = pick([890, 906, 922] as const);
  add("L3", [{x:1052,y:368},{x:headerPinL3,y:368},{x:headerPinL3,y:20}], 1.5, 0.58);

  const L4bx = irand(720, 820);
  add("L4", [{x:1052,y:404},{x:L4bx,y:404},{x:L4bx,y:400},{x:644,y:400}], 1.25, 0.5, 7400);

  const L5bx = irand(720, 860);
  add("L5", [{x:1052,y:440},{x:L5bx,y:440},{x:L5bx,y:420},{x:644,y:420}], 1.25, 0.48, maybePulse(8200));

  const L6bx1 = irand(840, 940);
  // route above CHIP_B (body y 380-440) to keep clear of its body
  const L6my = irand(340, 374);
  add("L6", [
    {x:1052,y:476},{x:L6bx1,y:476},{x:L6bx1,y:L6my},{x:480,y:L6my},{x:480,y:284}
  ], 1.25, 0.45);

  // route right of CHIP_B (body x 520-640) so the vertical run doesn't cross it
  const L7bx = irand(660, 740);
  add("L7", [{x:1052,y:512},{x:L7bx,y:512},{x:L7bx,y:236},{x:452,y:236}], 1.0, 0.4);

  // L8 (y=548): occasional NC short stub into a via on a long horizontal trace
  if (rnd() < 0.4) {
    const stubX = irand(960, 1020);
    add("L8", [{x:1052,y:548},{x:stubX,y:548}], 1.0, 0.34);
    addVia({x:stubX,y:548});
  }

  // ── Portrait TOP pads ──
  const T1pin = pick([922, 938, 954] as const);
  add("T1", [{x:1103,y:262},{x:1103,y:irand(170,200)},null!,{x:T1pin,y:20}].map((p,i,a)=>{
    if (p) return p;
    const midY = (a[1] as Pt).y;
    return {x:T1pin,y:midY};
  }), 1.25, 0.5);

  const T2pin = pick([954, 970] as const);
  const T2my = irand(140, 175);
  add("T2", [{x:1147,y:262},{x:1147,y:T2my},{x:T2pin,y:T2my},{x:T2pin,y:20}], 1.5, 0.55, 5600);

  add("T3", [{x:1190,y:262},{x:1190,y:0}], 1.75, 0.6, 4800);

  const T4my = irand(80, 130);
  const T4bx = irand(1340, 1440);
  add("T4", [{x:1233,y:262},{x:1233,y:T4my},{x:T4bx,y:T4my},{x:T4bx,y:0}], 1.25, 0.5, maybePulse(6400));

  const T5my = irand(120, 180);
  const T5bx = irand(1440, 1540);
  add("T5", [{x:1277,y:262},{x:1277,y:T5my},{x:T5bx,y:T5my},{x:T5bx,y:0}], 1.0, 0.45);

  // ── Portrait RIGHT pads → EDGE_R or canvas right ──
  add("R1", [{x:1328,y:296},{x:1600,y:296}], 1.5, 0.55, 6800);

  const R2bx = irand(1400, 1490);
  add("R2", [{x:1328,y:332},{x:R2bx,y:332},{x:R2bx,y:380},{x:1536,y:380}], 1.25, 0.5);

  const R3bx = irand(1440, 1520);
  add("R3", [{x:1328,y:368},{x:R3bx,y:368},{x:R3bx,y:410},{x:1536,y:410}], 1.25, 0.5);

  const R4bx = irand(1440, 1510);
  add("R4", [{x:1328,y:404},{x:R4bx,y:404},{x:R4bx,y:440},{x:1536,y:440}], 1.25, 0.5, maybePulse(6800));

  // bypass EDGE_R body (x 1540-1600, y 360-580) by routing above it
  add("R5", [{x:1328,y:440},{x:1490,y:440},{x:1490,y:340},{x:1600,y:340}], 1.5, 0.55);

  const R6bx = irand(1420, 1510);
  add("R6", [{x:1328,y:476},{x:R6bx,y:476},{x:R6bx,y:500},{x:1536,y:500}], 1.25, 0.48);

  const R7bx = irand(1400, 1480);
  add("R7", [{x:1328,y:512},{x:R7bx,y:512},{x:R7bx,y:530},{x:1536,y:530}], 1.0, 0.42);

  const R8bx = irand(1430, 1500);
  add("R8", [{x:1328,y:548},{x:R8bx,y:548},{x:R8bx,y:560},{x:1536,y:560}], 1.25, 0.5, 7800);

  // ── Portrait BOTTOM pads ──
  const B1my = irand(680, 760);
  const B1bx = irand(960, 1040);
  add("B1", [{x:1103,y:598},{x:1103,y:B1my},{x:B1bx,y:B1my},{x:B1bx,y:900}], 1.25, 0.45);

  const B2my = irand(700, 800);
  add("B2", [{x:1147,y:598},{x:1147,y:B2my},{x:1600,y:B2my}], 1.0, 0.42);

  add("B3", [{x:1190,y:598},{x:1190,y:900}], 1.5, 0.55, 5200);

  const B4my = irand(640, 720);
  const B4bx = irand(1440, 1540);
  add("B4", [{x:1233,y:598},{x:1233,y:B4my},{x:B4bx,y:B4my},{x:B4bx,y:900}], 1.25, 0.48);

  const B5my = irand(700, 780);
  add("B5", [{x:1277,y:598},{x:1277,y:B5my},{x:1600,y:B5my}], 1.0, 0.42);

  // ── CHIP_A pin fanout ──
  const A1my = irand(20, 60);
  const A1bx = irand(420, 540);
  add("A1", [{x:704,y:106},{x:704,y:A1my},{x:A1bx,y:A1my},{x:A1bx,y:0}], 1.0, 0.4);

  add("A2", [{x:728,y:106},{x:728,y:0}], 1.0, 0.38);

  const A3my = irand(40, 80);
  const A3bx = irand(1020, 1100);
  add("A3", [{x:752,y:106},{x:752,y:A3my},{x:A3bx,y:A3my},{x:A3bx,y:0}], 1.0, 0.4);

  const A4pin = pick([906, 922, 938] as const);
  const A4my = irand(50, 90);
  add("A4", [{x:776,y:106},{x:776,y:A4my},{x:A4pin,y:A4my},{x:A4pin,y:20}], 1.0, 0.4);

  const A5candidates: readonly number[] = [938, 954, 970];
  const A4pinNum: number = A4pin;
  const A5pool = A5candidates.filter((p) => p !== A4pinNum);
  const A5pin = pick(A5pool);
  const A5my = irand(40, 80);
  add("A5", [{x:800,y:106},{x:800,y:A5my},{x:A5pin,y:A5my},{x:A5pin,y:20}], 1.0, 0.4);

  const A6bx = irand(520, 620);
  add("A6", [{x:676,y:134},{x:A6bx,y:134},{x:A6bx,y:262},{x:480,y:262}], 1.0, 0.4);

  const A7my = irand(140, 220);
  add("A7", [{x:676,y:158},{x:irand(260, 360),y:158},null!,{x:0,y:A7my}].map((p,i,a)=>p ?? {x:(a[1] as Pt).x,y:A7my}), 1.0, 0.36);

  const A8my = irand(280, 340);
  add("A8", [{x:704,y:186},{x:704,y:A8my},{x:560,y:A8my},{x:560,y:376}], 1.25, 0.45);

  // Bonus chip A bottom-pin extension to a via in the mid plane
  if (rnd() < 0.7) {
    const ax = irand(820, 920);
    const ay = irand(230, 300);
    add("Ax", [{x:728,y:186},{x:728,y:ay},{x:ax,y:ay}], 1.0, 0.38);
    addVia({x:ax, y:ay});
  }
  if (rnd() < 0.5) {
    const by = irand(210, 260);
    const bx = irand(940, 1010);
    add("Ay", [{x:752,y:186},{x:752,y:by},{x:bx,y:by}], 1.0, 0.36);
    addVia({x:bx, y:by});
  }

  // ── CHIP_C fanout ──
  const C1bx = irand(160, 260);
  const C1my = irand(40, 100);
  add("C1", [{x:404,y:236},{x:404,y:C1my},{x:C1bx,y:C1my},{x:C1bx,y:0}], 1.0, 0.4);

  if (rnd() < 0.65) {
    const cmy = irand(170, 220);
    const cbx = irand(260, 340);
    add("C1b", [{x:428,y:236},{x:428,y:cmy},{x:cbx,y:cmy},{x:cbx,y:0}], 1.0, 0.36);
  }

  const C2my = irand(240, 290);
  const C2bx = irand(160, 260);
  add("C2", [{x:376,y:262},{x:C2bx,y:262},{x:C2bx,y:C2my},{x:0,y:C2my}], 1.0, 0.36);

  if (rnd() < 0.6) {
    const c2my = irand(300, 360);
    const c2bx = irand(220, 320);
    add("C2b", [{x:376,y:284},{x:c2bx,y:284},{x:c2bx,y:c2my},{x:0,y:c2my}], 1.0, 0.34);
  }

  add("C3", [{x:404,y:310},{x:404,y:400},{x:516,y:400}], 1.0, 0.4);

  if (rnd() < 0.7) {
    const cmy = irand(330, 365);
    add("C3b", [{x:428,y:310},{x:428,y:cmy},{x:600,y:cmy},{x:600,y:376}], 1.0, 0.38);
  }

  // ── CHIP_B fanout ──
  const BBmy = irand(430, 480);
  const BBbx = irand(180, 280);
  add("BB1", [{x:516,y:420},{x:BBbx,y:420},{x:BBbx,y:BBmy},{x:0,y:BBmy}], 1.0, 0.38);

  if (rnd() < 0.5) {
    const bby = irand(460, 500);
    const bbx = irand(820, 920);
    add("BBb", [{x:600,y:444},{x:600,y:bby},{x:bbx,y:bby}], 1.0, 0.36);
    addVia({x:bbx, y:bby});
  }
  if (rnd() < 0.5) {
    const bby = irand(465, 505);
    const bbx = irand(700, 800);
    add("BBc", [{x:560,y:444},{x:560,y:bby},{x:bbx,y:bby}], 1.0, 0.34);
    addVia({x:bbx, y:bby});
  }

  // ── Filler routing in emptier regions (deterministic with light jitter) ──
  // Upper-right gap between CHIP_A and the right edge
  {
    const y = irand(190, 230);
    const vx = irand(1050, 1130);
    add("FR1", [{x:1180,y:60},{x:1180,y},{x:vx,y},{x:vx,y:y+irand(40,80)}], 1.0, 0.32);
    addVia({x:vx, y:y+60});
  }
  // Upper-mid gap between CHIP_A and CHIP_C
  {
    const y = irand(120, 170);
    const x1 = irand(480, 560);
    add("FR2", [{x:x1,y:20},{x:x1,y},{x:irand(620,660),y}], 1.0, 0.30);
    addVia({x:irand(620,660), y});
  }
  // Mid-right gap below CHIP_A toward the lower-right
  if (rnd() < 0.9) {
    const y = irand(320, 370);
    const x2 = irand(960, 1050);
    add("FR3", [{x:1180,y},{x:x2,y},{x:x2,y:y+irand(50,90)}], 1.0, 0.30);
    addVia({x:x2, y:y+70});
  }
  // Lower-mid gap (well above the control module footprint y<560)
  {
    const y = irand(500, 540);
    const x3 = irand(780, 880);
    add("FR4", [{x:660,y},{x:x3,y},{x:x3,y:y-irand(40,80)}], 1.0, 0.28);
    addVia({x:x3, y:y-60});
  }

  // ── Inline parts placed on actual segments (text-zone + chip keep-out) ──
  const KEEP_OUT: { x:number; y:number; w:number; h:number }[] = [
    { x: PORT.x, y: PORT.y, w: PORT.w, h: PORT.h },
    { x: CHIP_A.x, y: CHIP_A.y, w: CHIP_A.w, h: CHIP_A.h },
    { x: CHIP_B.x, y: CHIP_B.y, w: CHIP_B.w, h: CHIP_B.h },
    { x: CHIP_C.x, y: CHIP_C.y, w: CHIP_C.w, h: CHIP_C.h },
    { x: EDGE_R.x, y: EDGE_R.y, w: EDGE_R.w, h: EDGE_R.h },
    { x: HEADER_T.x, y: HEADER_T.y, w: HEADER_T.w, h: HEADER_T.h },
    // Lamp module above the name
    { x: 340 - 28 - 8, y: 320 - 16 - 8, w: 56 + 16, h: 32 + 16 },
    // Hard-coded signal-path inline components (avoid overlap)
    { x: 920 - 16, y: 690 - 10, w: 32, h: 20 },
    { x: 740 - 10, y: 580 - 16, w: 20, h: 32 },
    { x: 430 - 14, y: 470 - 10, w: 28, h: 20 },
    { x: 600 - 14, y: 470 - 10, w: 28, h: 20 },
    // Control module footprint under the portrait
    { x: 1190 - 110, y: 585, w: 220, h: 140 },
  ];
  const inAnyBody = (cx: number, cy: number, pad = 8) =>
    KEEP_OUT.some(
      (r) =>
        cx > r.x - pad && cx < r.x + r.w + pad &&
        cy > r.y - pad && cy < r.y + r.h + pad,
    );
  // Avoid placing inline parts on top of the active signal trace.
  // SIGNAL_PATH_D: V from (1190,700) to (1190,730), H to (700,730),
  // V to (700,470), H to (340,470), V to (340, LAMP_PIN.y=350).
  const onSignalPath = (cx: number, cy: number, pad = 14) => {
    // vertical: x=1190, y 700..730
    if (Math.abs(cx - 1190) < pad && cy > 700 - pad && cy < 730 + pad) return true;
    // horizontal: y=730, x 700..1190
    if (Math.abs(cy - 730) < pad && cx > 700 - pad && cx < 1190 + pad) return true;
    // vertical: x=700, y 470..730
    if (Math.abs(cx - 700) < pad && cy > 470 - pad && cy < 730 + pad) return true;
    // horizontal: y=470, x 340..700
    if (Math.abs(cy - 470) < pad && cx > 340 - pad && cx < 700 + pad) return true;
    // vertical: x=340, y 350..470
    if (Math.abs(cx - 340) < pad && cy > 350 - pad && cy < 470 + pad) return true;
    return false;
  };
  const parts: Inline[] = [];
  const usedCenters = new Set<string>();
  const kinds: Inline["kind"][] = ["resistor", "capacitor", "inductor", "diode"];
  for (const s of segs) {
    const isH = s.a.y === s.b.y;
    const len = isH ? Math.abs(s.b.x - s.a.x) : Math.abs(s.b.y - s.a.y);
    if (len < 50) continue;
    if (rnd() > 0.22) continue;
    const margin = 26;
    if (len < margin * 2) continue;
    const t = rand(margin, len - margin);
    const dir = isH ? Math.sign(s.b.x - s.a.x) : Math.sign(s.b.y - s.a.y);
    const cx = isH ? Math.round(s.a.x + dir * t) : s.a.x;
    const cy = isH ? s.a.y : Math.round(s.a.y + dir * t);
    // skip lower-left text zone
    if (cx < 860 && cy > 560) continue;
    // skip if inside or hugging any chip / portrait / connector body
    if (inAnyBody(cx, cy)) continue;
    // skip if it would sit on top of the live signal trace
    if (onSignalPath(cx, cy)) continue;
    const key = `${cx},${cy}`;
    if (usedCenters.has(key)) continue;
    usedCenters.add(key);
    const kind = pick(kinds);
    let rot: 0 | 90 | 180 | 270 = 0;
    if (kind === "diode") {
      // anode-to-cathode points in the direction of signal flow (segment dir)
      if (isH) rot = dir > 0 ? 0 : 180;
      else rot = dir > 0 ? 90 : 270;
    } else {
      rot = isH ? 0 : 90;
    }
    parts.push({ kind, x: cx, y: cy, rot } as Inline);
  }

  // sprinkle a few extra testpads on existing vias (so the ring is more obvious)
  const viaList = Array.from(viaMap.values());
  const tpCount = Math.min(viaList.length, 3 + Math.floor(rnd() * 3));
  for (let i = 0; i < tpCount; i++) {
    const v = viaList[Math.floor(rnd() * viaList.length)];
    if (!v) continue;
    if (v.x < 860 && v.y > 560) continue;
    if (inAnyBody(v.x, v.y, 4)) continue;
    const key = `tp:${v.x},${v.y}`;
    if (usedCenters.has(key)) continue;
    usedCenters.add(key);
    parts.push({ kind: "testpad", x: v.x, y: v.y });
  }

  return { traces, vias: viaList, parts };
}

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

// ── Interactive lamp + button signal path ───────────────────────────────────
// Button sits below the portrait module; trace routes around the portrait,
// across the lower board, up past CHIP_B, and into the lamp above the name.
const BUTTON_PAD = { x: 1190, y: 700 };
const LAMP = { cx: 340, cy: 320, w: 56, h: 32 };
const LAMP_PIN = { x: LAMP.cx, y: LAMP.cy + LAMP.h / 2 + 14 }; // 340, 350
const SIGNAL_PATH_D =
  `M ${BUTTON_PAD.x} ${BUTTON_PAD.y} V 730 H 700 V 470 H ${LAMP_PIN.x} V ${LAMP_PIN.y}`;
const SIGNAL_DUR_MS = 1400;

function Lamp({ on }: { on: boolean }) {
  return (
    <g transform={`translate(${LAMP.cx} ${LAMP.cy})`}>
      {/* downward halo cone over the name */}
      {on && (
        <ellipse
          cx={0}
          cy={120}
          rx={140}
          ry={90}
          fill="url(#lampHalo)"
          opacity={0.55}
          style={{ pointerEvents: "none" }}
        />
      )}
      {/* solder pads */}
      <rect x={-20} y={LAMP.h / 2} width={7} height={5} fill="#262626" stroke="#3d3d3d" strokeWidth={0.5} />
      <rect x={13} y={LAMP.h / 2} width={7} height={5} fill="#262626" stroke="#3d3d3d" strokeWidth={0.5} />
      {/* leg trace down to LAMP_PIN */}
      <line x1={0} y1={LAMP.h / 2} x2={0} y2={LAMP.h / 2 + 14} stroke="#3d3d3d" strokeWidth={1} />
      {/* body capsule */}
      <rect
        x={-LAMP.w / 2}
        y={-LAMP.h / 2}
        width={LAMP.w}
        height={LAMP.h}
        rx={7}
        fill="#0e0e0e"
        stroke="#3d3d3d"
        strokeWidth={1}
      />
      {/* silkscreen label */}
      <text
        x={LAMP.w / 2 - 5}
        y={-LAMP.h / 2 - 4}
        fill="#555"
        fontFamily="ui-monospace, monospace"
        fontSize={6}
        textAnchor="end"
      >
        D1
      </text>
      {/* lens */}
      <circle
        r={11}
        fill={on ? "#fbbf24" : "#181818"}
        stroke={on ? "#fde68a" : "#5a5a5a"}
        strokeWidth={1}
        style={{ transition: "fill 250ms ease, stroke 250ms ease" }}
      />
      {/* glow layers when on */}
      {on && (
        <g style={{ pointerEvents: "none" }}>
          <circle r={16} fill="#fbbf24" opacity={0.45} />
          <circle r={28} fill="#fbbf24" opacity={0.22} />
          <circle r={48} fill="#fbbf24" opacity={0.1} />
        </g>
      )}
    </g>
  );
}

function SignalDot({ d, dur }: { d: string; dur: number }) {
  const s = `${dur / 1000}s`;
  return (
    <g style={{ pointerEvents: "none" }}>
      <circle r={3} fill="rgba(255,210,140,1)">
        <animateMotion dur={s} repeatCount="1" fill="freeze" path={d} />
      </circle>
      <circle r={7} fill="rgba(255,210,140,0.55)">
        <animateMotion dur={s} repeatCount="1" fill="freeze" path={d} />
      </circle>
      <circle r={14} fill="rgba(255,210,140,0.2)">
        <animateMotion dur={s} repeatCount="1" fill="freeze" path={d} />
      </circle>
    </g>
  );
}

function InlineComponent(c: Inline) {
  const rot = (c as { rot?: number }).rot ?? 0;
  return (
    <g transform={`translate(${c.x} ${c.y}) rotate(${rot})`}>
      {c.kind === "resistor" && (
        <g>
          {/* clear the trace behind the body */}
          <rect x={-9} y={-3.5} width={18} height={7} fill="#060606" />
          <rect x={-7} y={-3} width={14} height={6} fill="#1a1a1a" stroke="#5c5c5c" strokeWidth="0.6" />
          <rect x={-9} y={-2} width={2} height={4} fill="#3a3a3a" />
          <rect x={7}  y={-2} width={2} height={4} fill="#3a3a3a" />
        </g>
      )}
      {c.kind === "capacitor" && (
        <g>
          <rect x={-4} y={-7} width={8} height={14} fill="#060606" />
          <line x1={-2} y1={-6} x2={-2} y2={6} stroke="#6a6a6a" strokeWidth="1.4" />
          <line x1={2}  y1={-6} x2={2}  y2={6} stroke="#6a6a6a" strokeWidth="1.4" />
        </g>
      )}
      {c.kind === "inductor" && (
        <g>
          <rect x={-14} y={-7} width={28} height={9} fill="#060606" />
          <path d="M -12 0 q 4 -8 8 0 q 4 -8 8 0 q 4 -8 8 0" fill="none" stroke="#6a6a6a" strokeWidth="1.1" />
        </g>
      )}
      {c.kind === "diode" && (
        <g>
          <rect x={-8} y={-6} width={14} height={12} fill="#060606" />
          <polygon points="-6,-5 -6,5 2,0" fill="#262626" stroke="#6a6a6a" strokeWidth="0.7" />
          <line x1={2} y1={-5} x2={2} y2={5} stroke="#7a7a7a" strokeWidth="1.4" />
        </g>
      )}
      {c.kind === "testpad" && (
        <g>
          <circle r={4.5} fill="#060606" stroke="#3a3a3a" strokeWidth="0.8" />
          <circle r={2.2} fill="#1a1a1a" stroke="#6a6a6a" strokeWidth="0.6" />
        </g>
      )}
    </g>
  );
}

function CircuitTraceLayer({ built }: { built: Built }) {
  return (
    <g>
      {/* secondary chips (rendered before traces so trace endpoints sit on them) */}
      <g opacity="0.85">
        <SecondaryChip {...CHIP_A} pinsTop={5} pinsBot={5} pinsLeft={2} pinsRight={2} />
        <SecondaryChip {...CHIP_C} pinsTop={3} pinsBot={3} pinsLeft={2} pinsRight={2} />
        <SecondaryChip {...CHIP_B} pinsTop={2} pinsBot={2} pinsLeft={2} pinsRight={2} />
        {/* right-edge connector — partially off-screen */}
        <g>
          <rect x={EDGE_R.x} y={EDGE_R.y} width={EDGE_R.w} height={EDGE_R.h} fill="#111" stroke="#333" strokeWidth="1" />
          {EDGE_R_PINS.map((cy, i) => (
            <rect key={i} x={EDGE_R.x - 4} y={cy - 3} width={4} height={6} fill="#262626" stroke="#3d3d3d" strokeWidth="0.5" />
          ))}
        </g>
        {/* top edge header (6-pin) */}
        <g>
          <rect x={HEADER_T.x} y={HEADER_T.y} width={HEADER_T.w} height={HEADER_T.h} fill="#111" stroke="#333" strokeWidth="1" />
          {HEADER_T.pins.map((px, i) => (
            <rect key={i} x={px - 3} y={HEADER_T.y + HEADER_T.h} width={6} height={4} fill="#262626" stroke="#3d3d3d" strokeWidth="0.5" />
          ))}
        </g>
      </g>

      {/* traces — drawn in with stroke-dashoffset, staggered */}
      <g fill="none" strokeLinecap="square" strokeLinejoin="round">
        {built.traces.map((t, i) => (
          <path
            key={t.id}
            id={`trace-${t.id}`}
            d={t.d}
            pathLength={1}
            stroke={t.w >= 1.5 ? "#4a4a4a" : "#333"}
            strokeOpacity={t.o}
            strokeWidth={t.w}
            className="hero-trace-draw"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          />
        ))}
      </g>

      {/* inline components — fade in after traces finish */}
      <g className="hero-part-in" style={{ animationDelay: "2s" }}>
        {built.parts.map((p, i) => (
          <InlineComponent key={i} {...p} />
        ))}
      </g>

      {/* endpoint vias — also fade in after traces */}
      <g className="hero-part-in" style={{ animationDelay: "1.8s" }}>
        {built.vias.map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r={4} fill="none" stroke="#3a3a3a" strokeWidth="0.8" />
            <circle cx={e.x} cy={e.y} r={2.5} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </g>
  );
}

function CircuitHero() {
  // Deterministic seed: same intentional layout every reload, but still
  // visibly "generates" via staggered trace-draw + pulses.
  const seed = 0x5a17c0de;
  const built = useMemo(() => buildCircuit(seed), [seed]);
  const pulses = built.traces.filter((t) => t.pulse);
  const [lampOn, setLampOn] = useState(false);
  const [charging, setCharging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pulseId, setPulseId] = useState(0);
  const [hoverPulseId, setHoverPulseId] = useState(0);
  const [pressed, setPressed] = useState(false);
  const timers = useRef<number[]>([]);
  const clearAllTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const triggerSignal = () => {
    clearAllTimers();
    setPressed(true);
    timers.current.push(window.setTimeout(() => setPressed(false), 180));
    if (lampOn || charging) {
      setLampOn(false);
      setCharging(false);
      return;
    }
    setPulseId((n) => n + 1);
    setCharging(true);
    timers.current.push(window.setTimeout(() => setLampOn(true), SIGNAL_DUR_MS));
    timers.current.push(
      window.setTimeout(() => {
        setLampOn(false);
        setCharging(false);
      }, SIGNAL_DUR_MS + 5000),
    );
  };

  const onButtonEnter = () => {
    if (charging || lampOn) return;
    setHovering(true);
    setHoverPulseId((n) => n + 1);
  };
  const onButtonLeave = () => setHovering(false);
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
            <radialGradient id="lampHalo" cx="50%" cy="0%" r="75%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#fbbf24" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <mask id="heroTraceMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#heroTextFade)" />
              {/* always keep the portrait region fully visible */}
              <rect x={PORT.x - 60} y={PORT.y - 60} width={PORT.w + 120} height={PORT.h + 120} fill="white" />
            </mask>
          </defs>

          {/* circuit layer (under the mask) */}
          <g mask="url(#heroTraceMask)">
            <CircuitTraceLayer built={built} />
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

          {/* Interactive signal path: button → board → lamp. Drawn ABOVE the
              text mask so it stays fully visible. */}
          <g>
            <path
              d={SIGNAL_PATH_D}
              fill="none"
              stroke="#3a3a3a"
              strokeOpacity={0.55}
              strokeWidth={1.4}
              strokeLinecap="square"
              strokeLinejoin="round"
              pathLength={1}
              className="hero-trace-draw"
              style={{ animationDelay: "1.4s" }}
            />
            {/* Progressive amber fill — same path, revealed via dashoffset.
                Click → fill from 1 → 0 over SIGNAL_DUR_MS (charging).
                Hover → preview, peel ~8% from the button end. */}
            <path
              d={SIGNAL_PATH_D}
              fill="none"
              stroke="#fbbf24"
              strokeOpacity={lampOn ? 1 : 0.92}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={
                charging || lampOn ? 0 : hovering ? 0.92 : 1
              }
              style={{
                transition:
                  charging
                    ? `stroke-dashoffset ${SIGNAL_DUR_MS}ms linear, stroke-opacity 200ms ease`
                    : hovering
                      ? "stroke-dashoffset 380ms ease-out, stroke-opacity 200ms ease"
                      : "stroke-dashoffset 600ms ease-in, stroke-opacity 300ms ease",
                filter: "drop-shadow(0 0 3px rgba(251,191,36,0.55))",
                pointerEvents: "none",
              }}
            />
            {/* small inline parts along the routed path */}
            <g className="hero-part-in" style={{ animationDelay: "2s" }}>
              <InlineComponent kind="resistor" x={920} y={690} rot={0} />
              <InlineComponent kind="capacitor" x={740} y={580} rot={90} />
              <InlineComponent kind="diode" x={430} y={470} rot={180} />
              <InlineComponent kind="resistor" x={600} y={470} rot={0} />
              {/* via at corners */}
              <circle cx={700} cy={690} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={700} cy={470} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={340} cy={470} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
            </g>
            {/* leading dot that travels with the fill on click */}
            {charging && pulseId > 0 && (
              <g key={`click-${pulseId}`} style={{ pointerEvents: "none" }}>
                <circle r={3.4} fill="#fff4d6">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={SIGNAL_PATH_D} />
                </circle>
                <circle r={8} fill="rgba(251,191,36,0.45)">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={SIGNAL_PATH_D} />
                </circle>
              </g>
            )}
            {/* hover preview: a tiny pulse that nudges into the route then fades */}
            {hovering && hoverPulseId > 0 && (
              <g key={`hov-${hoverPulseId}`} style={{ pointerEvents: "none" }}>
                <circle r={2.6} fill="rgba(251,191,36,0.85)">
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={SIGNAL_PATH_D} keyPoints="0;0.1" keyTimes="0;1" calcMode="linear" />
                </circle>
              </g>
            )}
            <g className="hero-part-in" style={{ animationDelay: "1.6s" }}>
              <Lamp on={lampOn} />
            </g>
          </g>

          {/* layer 3: portrait module — always visible, above mask */}
          <PortraitModule />

          {/* hardware-style trigger button under the portrait */}
          <g className="hero-part-in" style={{ animationDelay: "1.8s" }}>
            {/* button pad + leg into the routed trace */}
            <line
              x1={BUTTON_PAD.x}
              y1={620}
              x2={BUTTON_PAD.x}
              y2={BUTTON_PAD.y}
              stroke="#3a3a3a"
              strokeWidth={1.2}
            />
            <circle cx={BUTTON_PAD.x} cy={BUTTON_PAD.y} r={3.5} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.9} />
            {/* idle invite-pulse around the button pad (always on, restrained).
                Intensifies on hover. */}
            {!charging && !lampOn && (
              <g style={{ pointerEvents: "none" }}>
                <circle
                  cx={BUTTON_PAD.x}
                  cy={BUTTON_PAD.y}
                  r={6}
                  fill="none"
                  stroke={hovering ? "#fbbf24" : "#6a6a6a"}
                  strokeWidth={hovering ? 0.8 : 0.5}
                  style={{ transition: "stroke 200ms ease, stroke-width 200ms ease" }}
                >
                  <animate
                    attributeName="r"
                    values={hovering ? "6;28" : "6;20"}
                    dur={hovering ? "1.6s" : "2.4s"}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={hovering ? "0.6;0" : "0.35;0"}
                    dur={hovering ? "1.6s" : "2.4s"}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={BUTTON_PAD.x}
                  cy={BUTTON_PAD.y}
                  r={6}
                  fill="none"
                  stroke={hovering ? "#fbbf24" : "#6a6a6a"}
                  strokeWidth={hovering ? 0.6 : 0.4}
                  style={{ transition: "stroke 200ms ease" }}
                >
                  <animate
                    attributeName="r"
                    values={hovering ? "6;24" : "6;17"}
                    dur={hovering ? "1.6s" : "2.4s"}
                    begin={hovering ? "0.55s" : "1.0s"}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={hovering ? "0.45;0" : "0.22;0"}
                    dur={hovering ? "1.6s" : "2.4s"}
                    begin={hovering ? "0.55s" : "1.0s"}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
            <foreignObject
              x={BUTTON_PAD.x - 110}
              y={585}
              width={220}
              height={140}
              style={{ overflow: "visible", pointerEvents: "auto" }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 18,
                  boxSizing: "border-box",
                }}
              >
                <style>{`
                  @keyframes hwBoxPulse {
                    0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 rgba(251,191,36,0); border-color: #2c2c2c; }
                    50%      { box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 0 14px rgba(251,191,36,0.10); border-color: #3a3a3a; }
                  }
                  @keyframes hwBtnBob {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-2px); }
                  }
                  .hw-module { animation: hwBoxPulse 2.8s ease-in-out infinite; }
                  .hw-module.is-hot { animation-duration: 1.4s; }
                  .hw-btn-wrap { animation: hwBtnBob 2.8s ease-in-out infinite; }
                  .hw-btn-wrap.is-pressed { animation: none; }
                `}</style>

                {/* rectangular control housing */}
                <div
                  className={`hw-module${hovering || charging || lampOn ? " is-hot" : ""}`}
                  style={{
                    width: 180,
                    height: 56,
                    background:
                      "linear-gradient(180deg, #131313 0%, #0a0a0a 100%)",
                    border: "1px solid #2c2c2c",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* tiny corner screws */}
                  {[
                    { top: 4, left: 4 },
                    { top: 4, right: 4 },
                    { bottom: 4, left: 4 },
                    { bottom: 4, right: 4 },
                  ].map((p, i) => (
                    <span
                      key={i}
                      style={{
                        position: "absolute",
                        width: 3,
                        height: 3,
                        borderRadius: 999,
                        background: "#1a1a1a",
                        border: "0.5px solid #333",
                        ...p,
                      }}
                    />
                  ))}
                  <span
                    style={{
                      display: "block",
                      textAlign: "center",
                      lineHeight: 1,
                      fontFamily:
                        "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      letterSpacing: "0.24em",
                      paddingLeft: "0.24em",
                      textTransform: "uppercase",
                      color:
                        lampOn || charging
                          ? "#fbbf24"
                          : hovering
                            ? "#e8d28a"
                            : "#9a9a9a",
                      transition: "color 200ms ease",
                    }}
                  >
                    Click me :)
                  </span>
                </div>

                {/* red push button mounted on top of housing */}
                <div
                  className={`hw-btn-wrap${pressed ? " is-pressed" : ""}`}
                  style={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 56,
                    height: 44,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  {/* dark mount/base — connects the cap into the housing */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 0,
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 10,
                      borderRadius: "3px 3px 2px 2px",
                      background:
                        "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                      border: "1px solid #2c2c2c",
                      borderBottom: "none",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.6)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={triggerSignal}
                    onMouseEnter={onButtonEnter}
                    onMouseLeave={onButtonLeave}
                    onFocus={onButtonEnter}
                    onBlur={onButtonLeave}
                    aria-label="Click me"
                    aria-pressed={lampOn}
                    style={{
                      position: "relative",
                      width: 30,
                      height: 30,
                      marginBottom: 6,
                      borderRadius: "50%",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      pointerEvents: "auto",
                      // dark collar around the cap
                      background:
                        "radial-gradient(circle at 50% 55%, #1a0606 0%, #0a0202 65%, #050101 100%)",
                      boxShadow: pressed
                        ? "0 1px 0 rgba(0,0,0,0.8), inset 0 1px 3px rgba(0,0,0,0.7)"
                        : hovering
                          ? "0 3px 5px rgba(0,0,0,0.6), 0 0 10px rgba(220,38,38,0.30), inset 0 -1px 2px rgba(0,0,0,0.55)"
                          : "0 2px 3px rgba(0,0,0,0.55), 0 0 6px rgba(220,38,38,0.15), inset 0 -1px 2px rgba(0,0,0,0.5)",
                      transform: hovering && !pressed ? "scale(1.05)" : "scale(1)",
                      transition:
                        "transform 120ms ease, box-shadow 200ms ease",
                    }}
                  >
                    {/* glossy red dome */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 4,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle at 38% 32%, #ff7575 0%, #e23a3a 30%, #a01717 70%, #6a0e0e 100%)",
                        boxShadow: pressed
                          ? "inset 0 2px 4px rgba(0,0,0,0.55), inset 0 -1px 1px rgba(255,255,255,0.04)"
                          : "inset 0 -2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.16)",
                        transform: pressed
                          ? "translateY(1px) scale(0.97)"
                          : "translateY(0)",
                        transition:
                          "transform 100ms ease, box-shadow 200ms ease",
                      }}
                    />
                    {/* specular highlight */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 8,
                        width: 10,
                        height: 5,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(ellipse at center, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)",
                        opacity: pressed ? 0.2 : 0.65,
                        pointerEvents: "none",
                        transition: "opacity 150ms ease",
                      }}
                    />
                  </button>
                </div>
              </div>
            </foreignObject>
          </g>
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
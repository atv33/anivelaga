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
      <HeroCircuits />
      <div className="relative z-[2]">
        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-black uppercase">
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

function HeroCircuits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    let raf = 0;

    // ===== Style =====
    const CHIP_OPACITY = 0.2;
    const TRACE_OPACITY = 0.13;
    const PAD_OPACITY = 0.18;
    const CHIP_DURATION = 600;
    const SPEED = 600; // px/s
    const STAGGER = 100;
    const POP_DURATION = 150;
    const PIN_LEN = 18;
    const PAD_SIZE = 5;

    // ===== Helpers =====
    const fadeAt = (y: number) => {
      const top = H * 0.70;
      const bot = H * 0.82;
      if (y <= top) return 1;
      if (y >= bot) return 0;
      return 1 - (y - top) / (bot - top);
    };
    const setStroke = (a: number, w: number) => {
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.lineWidth = w;
    };
    const setFill = (a: number) => { ctx.fillStyle = `rgba(255,255,255,${a})`; };
    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // ===== Chip / Pin model =====
    type Side = "top" | "bottom" | "left" | "right";
    type Pin = { base: [number, number]; tip: [number, number]; side: Side };
    type Chip = { x: number; y: number; size: number; pins: Record<Side, Pin[]> };

    const makeChip = (cx: number, cy: number, size: number, perSide: number): Chip => {
      const x = Math.round(cx - size / 2);
      const y = Math.round(cy - size / 2);
      const offs = Array.from({ length: perSide }, (_, i) => ((i + 1) * size) / (perSide + 1));
      const mk = (side: Side): Pin[] => offs.map((o) => {
        if (side === "top")    return { base: [x + o, y],         tip: [x + o, y - PIN_LEN], side };
        if (side === "bottom") return { base: [x + o, y + size],  tip: [x + o, y + size + PIN_LEN], side };
        if (side === "left")   return { base: [x, y + o],         tip: [x - PIN_LEN, y + o], side };
        return                       { base: [x + size, y + o], tip: [x + size + PIN_LEN, y + o], side };
      });
      return { x, y, size, pins: { top: mk("top"), bottom: mk("bottom"), left: mk("left"), right: mk("right") } };
    };

    // ===== Trace model =====
    type Trace = { pts: [number, number][]; segLens: number[]; total: number; delayIdx: number };
    const buildTrace = (pts: [number, number][], delayIdx: number): Trace => {
      const segLens: number[] = [];
      let total = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = pts[i + 1][0] - pts[i][0];
        const dy = pts[i + 1][1] - pts[i][1];
        const L = Math.hypot(dx, dy);
        segLens.push(L);
        total += L;
      }
      return { pts, segLens, total, delayIdx };
    };
    const pointAt = (t: Trace, dist: number): [number, number] => {
      let d = dist;
      for (let i = 0; i < t.segLens.length; i++) {
        if (d <= t.segLens[i]) {
          const f = t.segLens[i] === 0 ? 0 : d / t.segLens[i];
          return [t.pts[i][0] + (t.pts[i + 1][0] - t.pts[i][0]) * f,
                  t.pts[i][1] + (t.pts[i + 1][1] - t.pts[i][1]) * f];
        }
        d -= t.segLens[i];
      }
      return t.pts[t.pts.length - 1];
    };

    // ===== State =====
    let chipA: Chip;
    let chipB: Chip;
    let chipH: Chip;
    let traces: Trace[] = [];
    type Via = { x: number; y: number; traceIdx: number; dist: number };
    let vias: Via[] = [];
    let startTime = 0;
    const headshotImg = new Image();
    headshotImg.src = headshotAsset.url;
    let imgReady = headshotImg.complete && headshotImg.naturalWidth > 0;
    headshotImg.onload = () => {
      imgReady = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };

    // Headshot "chip" — non-square frame (120x140)
    const makeFrameChip = (cx: number, cy: number, fw: number, fh: number, perSide: number): Chip => {
      const x = Math.round(cx - fw / 2);
      const y = Math.round(cy - fh / 2);
      const xOffs = Array.from({ length: perSide }, (_, i) => ((i + 1) * fw) / (perSide + 1));
      const yOffs = Array.from({ length: perSide }, (_, i) => ((i + 1) * fh) / (perSide + 1));
      const top = xOffs.map((o) => ({ base: [x + o, y] as [number, number], tip: [x + o, y - PIN_LEN] as [number, number], side: "top" as const }));
      const bottom = xOffs.map((o) => ({ base: [x + o, y + fh] as [number, number], tip: [x + o, y + fh + PIN_LEN] as [number, number], side: "bottom" as const }));
      const left = yOffs.map((o) => ({ base: [x, y + o] as [number, number], tip: [x - PIN_LEN, y + o] as [number, number], side: "left" as const }));
      const right = yOffs.map((o) => ({ base: [x + fw, y + o] as [number, number], tip: [x + fw + PIN_LEN, y + o] as [number, number], side: "right" as const }));
      return { x, y, size: Math.max(fw, fh), pins: { top, bottom, left, right } };
    };

    // ===== Layout =====
    const layout = () => {
      chipA = makeChip(W * 0.28, H * 0.20, 90, 7);
      chipB = makeChip(W * 0.70, H * 0.22, 70, 5);
      chipH = makeFrameChip(W * 0.72, H * 0.35, 120, 140, 4);
      traces = [];
      vias = [];
      let order = 0;

      const push = (pts: [number, number][]) => {
        traces.push(buildTrace(pts, order++));
        return traces.length - 1;
      };

      // --- A LEFT: 3 parallel traces fanning to left edge (orthogonal) ---
      const aLeftIdxs = [1, 3, 5];
      aLeftIdxs.forEach((pi, k) => {
        const p = chipA.pins.left[pi];
        const [tx, ty] = p.tip;
        const run1 = 40 + k * 8;
        const x1 = tx - run1;
        const y2 = ty + (k === 0 ? -40 : k === 2 ? 40 : 0);
        const x3 = 20;
        push([[p.base[0], p.base[1]], [tx, ty], [x1, ty], [x1, y2], [x3, y2]]);
      });

      // --- A RIGHT -> B LEFT: 3 horizontal connections ---
      const aRightIdxs = [1, 3, 5];
      const bLeftIdxs = [1, 2, 3];
      aRightIdxs.forEach((pi, k) => {
        const a = chipA.pins.right[pi];
        const b = chipB.pins.left[bLeftIdxs[k]];
        const midX = (a.tip[0] + b.tip[0]) / 2 + (k - 1) * 6;
        const idx = push([
          [a.base[0], a.base[1]],
          [a.tip[0], a.tip[1]],
          [a.tip[0] + 30, a.tip[1]],
          [midX, a.tip[1]],
          [midX, b.tip[1]],
          [b.tip[0] - 30, b.tip[1]],
          [b.tip[0], b.tip[1]],
          [b.base[0], b.base[1]],
        ]);
        const via1 = pointAt(traces[idx], 30 + 30);
        vias.push({ x: via1[0], y: via1[1], traceIdx: idx, dist: 30 + 30 });
      });

      // --- A TOP: 3 traces fanning up (orthogonal L-shape) ---
      const aTopIdxs = [1, 3, 5];
      aTopIdxs.forEach((pi, k) => {
        const p = chipA.pins.top[pi];
        const run = 40 + k * 10;
        const y1 = p.tip[1] - run;
        const xMid = p.tip[0] + (k - 1) * 80;
        push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [xMid, y1],
          [xMid, 16],
        ]);
      });

      // --- A BOTTOM: 3 traces routing down-left (orthogonal) ---
      const aBotIdxs = [1, 3, 5];
      aBotIdxs.forEach((pi, k) => {
        const p = chipA.pins.bottom[pi];
        const run = 40 + k * 8;
        const y1 = p.tip[1] + run;
        const targetX = Math.max(20, p.tip[0] - 220 - k * 30);
        const endY = Math.min(H * 0.68, y1 + 120 + k * 20);
        const idx = push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [targetX, y1],
          [targetX, endY],
        ]);
        if (k === 2) {
          const d = traces[idx].total * 0.7;
          const pt = pointAt(traces[idx], d);
          vias.push({ x: pt[0], y: pt[1], traceIdx: idx, dist: d });
        }
      });

      // --- B RIGHT: 3 parallel traces fanning right (orthogonal) ---
      const bRightIdxs = [0, 2, 4];
      bRightIdxs.forEach((pi, k) => {
        const p = chipB.pins.right[pi];
        const run = 40 + k * 8;
        const x1 = p.tip[0] + run;
        const y2 = p.tip[1] + (k === 0 ? -40 : k === 2 ? 40 : 0);
        const idx = push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [x1, p.tip[1]],
          [x1, y2],
          [W - 20, y2],
        ]);
        if (k === 0 || k === 2) {
          const d = traces[idx].total * 0.4;
          const pt = pointAt(traces[idx], d);
          vias.push({ x: pt[0], y: pt[1], traceIdx: idx, dist: d });
        }
      });

      // --- B TOP: 2 traces fanning to top (orthogonal) ---
      [1, 3].forEach((pi, k) => {
        const p = chipB.pins.top[pi];
        const run = 40 + k * 10;
        const y1 = p.tip[1] - run;
        const x2 = p.tip[0] + 60 + k * 50;
        const idx = push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [x2, y1],
          [x2, 16],
        ]);
        if (k === 0) {
          const d = traces[idx].total * 0.55;
          const pt = pointAt(traces[idx], d);
          vias.push({ x: pt[0], y: pt[1], traceIdx: idx, dist: d });
        }
      });

      // --- B BOTTOM (orthogonal, only outer pin going left so it doesn't collide with headshot) ---
      [0].forEach((pi, k) => {
        const p = chipB.pins.bottom[pi];
        const run = 40;
        const y1 = p.tip[1] + run;
        const endX = Math.max(20, p.tip[0] - 200);
        const endY = Math.min(H * 0.68, y1 + 80);
        const idx = push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [endX, y1],
          [endX, endY],
        ]);
        const d2 = traces[idx].total * 0.35;
        const pt2 = pointAt(traces[idx], d2);
        vias.push({ x: pt2[0], y: pt2[1], traceIdx: idx, dist: d2 });
      });

      // --- HEADSHOT chip pins (4 per side) — route outward ---
      // top pins: up toward top edge
      chipH.pins.top.forEach((p, k) => {
        const y1 = p.tip[1] - 30 - k * 6;
        const endX = chipH.x - 30 + k * 80;
        push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [endX, y1],
        ]);
      });
      // right pins: to right edge
      chipH.pins.right.forEach((p, k) => {
        const x1 = p.tip[0] + 30 + k * 8;
        const y2 = p.tip[1] + (k - 1.5) * 16;
        const idx = push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [x1, p.tip[1]],
          [x1, y2],
          [W - 20, y2],
        ]);
        if (k % 2 === 0) {
          const d = traces[idx].total * 0.45;
          const pt = pointAt(traces[idx], d);
          vias.push({ x: pt[0], y: pt[1], traceIdx: idx, dist: d });
        }
      });
      // bottom pins: route down then horizontal (respect fade)
      chipH.pins.bottom.forEach((p, k) => {
        const y1 = Math.min(H * 0.66, p.tip[1] + 30 + k * 6);
        const endX = p.tip[0] + (k < 2 ? -1 : 1) * (120 + k * 20);
        push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [p.tip[0], y1],
          [endX, y1],
        ]);
      });
      // left pins: route left toward space between chip A and headshot
      chipH.pins.left.forEach((p, k) => {
        const x1 = p.tip[0] - 50 - k * 10;
        const y2 = p.tip[1] + (k - 1.5) * 18;
        const endX = Math.max(20, chipA.x + chipA.size + 40);
        push([
          [p.base[0], p.base[1]],
          [p.tip[0], p.tip[1]],
          [x1, p.tip[1]],
          [x1, y2],
          [endX, y2],
        ]);
      });

      // Top-up vias to reach 12 total, scattered at bends of misc traces
      while (vias.length < 12 && traces.length > 0) {
        const ti = vias.length % traces.length;
        const d = traces[ti].total * (0.25 + (vias.length % 5) * 0.12);
        const pt = pointAt(traces[ti], d);
        vias.push({ x: pt[0], y: pt[1], traceIdx: ti, dist: d });
      }
    };

    // ===== Drawing =====
    const drawChip = (c: Chip, progress: number) => {
      const a = CHIP_OPACITY * progress * fadeAt(c.y + c.size / 2);
      setStroke(a, 1);
      ctx.strokeRect(c.x + 0.5, c.y + 0.5, c.size, c.size);
    };
    const drawPinsAndPads = (c: Chip) => {
      const all = [...c.pins.top, ...c.pins.bottom, ...c.pins.left, ...c.pins.right];
      for (const p of all) {
        const f = fadeAt(p.tip[1]);
        if (f <= 0) continue;
        setStroke(CHIP_OPACITY * f, 1);
        line(p.base[0] + 0.5, p.base[1] + 0.5, p.tip[0] + 0.5, p.tip[1] + 0.5);
        setFill(PAD_OPACITY * f);
        const px = p.tip[0] - PAD_SIZE / 2;
        const py = p.tip[1] - PAD_SIZE / 2;
        ctx.fillRect(Math.round(px), Math.round(py), PAD_SIZE, PAD_SIZE);
      }
    };
    const drawTrace = (t: Trace, drawnDist: number) => {
      if (drawnDist <= 0) return;
      let remaining = drawnDist;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < t.segLens.length; i++) {
        const L = t.segLens[i];
        if (L === 0) continue;
        const take = Math.min(L, remaining);
        const f = take / L;
        const [x1, y1] = t.pts[i];
        const x2 = x1 + (t.pts[i + 1][0] - x1) * f;
        const y2 = y1 + (t.pts[i + 1][1] - y1) * f;
        const yMid = (y1 + y2) / 2;
        const a = TRACE_OPACITY * fadeAt(yMid);
        if (a > 0.002) {
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        remaining -= take;
        if (remaining <= 0) break;
      }
    };
    const drawVia = (v: Via, s: number) => {
      const f = fadeAt(v.y);
      if (f <= 0) return;
      const r1 = 2 * s;
      const r2 = 4 * s;
      setFill(PAD_OPACITY * f);
      ctx.beginPath();
      ctx.arc(v.x, v.y, r1, 0, Math.PI * 2);
      ctx.fill();
      setStroke(PAD_OPACITY * f, 1);
      ctx.beginPath();
      ctx.arc(v.x, v.y, r2, 0, Math.PI * 2);
      ctx.stroke();
    };
    const drawHeadshot = (c: Chip, progress: number) => {
      // Frame chip is 120x140 (from layout); photo natural 3:4 portrait → 90x110 centered
      const fw = 120;
      const fh = 140;
      const pw = 90;
      const ph = 110;
      const px = c.x + (fw - pw) / 2;
      const py = c.y + (fh - ph) / 2;
      if (imgReady) {
        ctx.save();
        ctx.globalAlpha = 0.7 * progress;
        ctx.drawImage(headshotImg, px, py, pw, ph);
        ctx.restore();
      }
      // Outer IC package frame
      setStroke(0.5 * progress, 2);
      ctx.strokeRect(c.x + 1, c.y + 1, fw - 2, fh - 2);
    };

    // ===== Render loop =====
    const tracesStartAt = (i: number) => CHIP_DURATION + i * STAGGER;
    const elementProgress = (drawnDist: number, popDist: number) => {
      // returns scale 0..1 for pop after trace reaches popDist
      if (drawnDist < popDist) return 0;
      const t = Math.min(1, ((drawnDist - popDist) / SPEED) * 1000 / POP_DURATION);
      // ease-out cubic
      return 1 - Math.pow(1 - t, 3);
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const elapsed = now - startTime;

      // Chips
      const chipP = Math.min(1, elapsed / CHIP_DURATION);
      drawChip(chipA, chipP);
      drawChip(chipB, chipP);
      drawHeadshot(chipH, chipP);

      let anyActive = chipP < 1;

      if (chipP >= 1) {
        drawPinsAndPads(chipA);
        drawPinsAndPads(chipB);
        drawPinsAndPads(chipH);

        // Traces
        const traceDrawn: number[] = new Array(traces.length).fill(0);
        for (let i = 0; i < traces.length; i++) {
          const t = traces[i];
          const te = elapsed - tracesStartAt(i);
          if (te <= 0) { anyActive = true; continue; }
          const d = Math.min(t.total, (te / 1000) * SPEED);
          traceDrawn[i] = d;
          drawTrace(t, d);
          if (d < t.total) anyActive = true;
        }

        // Vias pop in
        for (const v of vias) {
          const d = traceDrawn[v.traceIdx] || 0;
          const s = elementProgress(d, v.dist);
          if (s > 0) drawVia(v, s);
          else if (d < v.dist) anyActive = true;
        }
      }

      if (anyActive) raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      startTime = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
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
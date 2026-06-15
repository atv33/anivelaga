import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, BrainCircuit } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
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
import thrusterLayoutAsset from "@/assets/thruster-layout.png.asset.json";
import thrusterFrontAsset from "@/assets/thruster-front.png.asset.json";
import thrusterBackAsset from "@/assets/thruster-back.png.asset.json";
import serialFabFrontAsset from "@/assets/thruster-fab-1.png.asset.json";
import thrusterFabFrontAsset from "@/assets/thruster-fab-2.png.asset.json";
import thrusterFabBackAsset from "@/assets/thruster-fab-back.png.asset.json";
import serialFabBackAsset from "@/assets/serial-fab-back.png.asset.json";

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
  bullets?: string[];
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
    label: "PCB Design Projects",
    intro:
      "Through my work on Cornell's autonomous submarine team, I designed and brought up multiple PCBs for different systems on the vehicle. I identified signal and power requirements, structured schematics, referenced datasheets for layout decisions, and designed boards from schematic through assembly. I also soldered, debugged, and wrote firmware to bring each board to a reliable operating state.",
    projects: [
      {
        id: "A",
        name: "Serial Communication Board",
        tagline:
          "Central communication hub for the submarine. Aggregates 16 RS-232 RX/TX channels from sensors and peripherals into a single USB-C connection to the Jetson AI computer. Uses FTDI USB-to-UART ICs with RS-232 level shifting. Spring 2026 added SMF05CT1G TVS diode arrays for ESD protection on all 32 signal lines, DVL direct-connect header, and hot-swap EEPROM footprint. 4-layer PCB, 3.701\" x 4.291\".",
        bullets: [
          "16 RS-232 sensor channels multiplexed to USB-C using FTDI USB-to-UART ICs with RS-232 level shifting",
          "TVS diode ESD protection on all 32 signal lines; hot-swap EEPROM footprint and DVL direct-connect header",
        ],
        stack: ["Altium Designer", "4-Layer PCB", "RS-232", "USB-C", "FTDI", "ESD Protection"],
        placeholderCaption: "Serial Board 3D Render",
      },
      {
        id: "B",
        name: "Serial Test Board",
        tagline:
          "Breakout and validation board for the Serial Board. Exposes all 16 RS-232 channels as labeled headers for bench testing without the full submarine harness. Used during bring-up to verify level-shifter voltages, FTDI enumeration, and loopback integrity on each channel pair.",
        bullets: [
          "Companion breakout board that fans all 16 RS-232 channels out to labeled headers for bench validation without the full submarine harness",
          "Used during Serial Board bring-up to verify level-shifter voltages, FTDI enumeration, and per-channel loopback integrity",
        ],
        stack: ["Altium Designer", "Test & Validation", "RS-232", "Breakout Board"],
      },
      {
        id: "C",
        name: "High-Power Thruster Control Board",
        tagline:
          "Motor driver PCB for the Orion vehicle's thruster array. Receives PWM/CAN commands from the Jetson via backplane connector and drives 8 brushless DC thrusters. Handles power distribution, overcurrent protection, and ESC signal conditioning.",
        bullets: [
          "8-channel PWM signal generation driving BlueRobotics ESCs for independent thruster actuation",
          "Multi-rail power design: 16V, 7.4V, and 3.3V lines managed via LDOs with optimized dropout voltages",
        ],
        stack: ["Altium Designer", "Motor Control", "CAN Bus", "PWM", "Power Distribution"],
      },
    ],
  },
  {
    id: "02",
    label: "Personal Projects",
    intro: "Side projects in hardware and infrastructure.",
    projects: [
      {
        id: "A",
        name: "Custom PCB Mechanical Keyboard",
        year: "Summer 2025",
        tagline:
          "Designed a 65% layout mechanical keyboard PCB from scratch in KiCad. Implemented hot-swap socket footprints for MX-compatible switches, per-key RGB via WS2812B LED daisy chain, and USB-C HID with an RP2040 microcontroller running QMK firmware. 2-layer board, manufactured through JLCPCB.",
        bullets: [
          "65% hot-swap PCB in KiCad with RP2040 + QMK firmware",
          "Per-key WS2812B RGB, USB-C HID, manufactured via JLCPCB",
        ],
        stack: ["KiCad", "RP2040", "QMK", "USB-C", "RGB"],
      },
      {
        id: "B",
        name: "Home Lab Networking Setup",
        year: "Ongoing",
        tagline:
          "Built a home networking lab for low-latency experimentation. Flashed OpenWrt on a TP-Link router, set up VLANs for traffic isolation, configured WireGuard VPN, and wired a 2.5GbE switch for inter-node throughput testing. Used for running local LLM inference and testing distributed computing setups.",
        bullets: [
          "OpenWrt router + VLANs + WireGuard VPN",
          "2.5GbE switch for inter-node throughput testing",
        ],
        stack: ["OpenWrt", "WireGuard", "VLANs", "Networking", "Linux"],
      },
    ],
  },
  {
    id: "03",
    label: "Networking / LLM Inference Research",
    intro: "",
    projects: [],
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
    when: "May 2026 — Present",
    role: "High Speed Network Researcher",
    org: "ByteDance",
    note: "LLM inference system R&D.",
  },
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
  {
    when: "Jun 2025 — Apr 2026",
    role: "Network Software Engineer",
    org: "ByteDance",
    note: "NCCL simulation for large clusters.",
  },
  {
    when: "Jun 2023 — Aug 2023",
    role: "FPGA Engineer",
    org: "Broadcom",
    note: "Verilog & FPGA validation.",
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
        <div id="hero">
          <Hero />
        </div>
        <About />
        <PcbDivider />
        <Ticker />
        <Work />
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
    <NavBar
      items={[
        { name: "Home", href: "#hero" },
        { name: "Work", href: "#work" },
        { name: "Experience", href: "#experience" },
        { name: "Contact", href: "#contact" },
      ]}
    />
  );
}

function Hero() {
  return (
    <CircuitHero />
  );
}

// ============================================================
// CircuitHero — engineered electronics architecture scene
// Single SVG (viewBox 1600x900). Every chip, pad, trace, via,
// component, lamp, button, and robot lives in this coordinate
// system. All routing snaps to a 20px invisible grid.
// ============================================================
const VB_W = 1600;
const VB_H = 900;

// ── Module catalog ──────────────────────────────────────────
type Pad = { x: number; y: number; w: number; h: number };
type ModuleSpec = {
  id: string;
  label: string;
  x: number; y: number; w: number; h: number;
  topX: number[];
  botX: number[];
  leftY: number[];
  rightY: number[];
  marker?: string;
};

// Pad coordinates are all grid-aligned (multiples of 20).
const MODULES: ModuleSpec[] = [
  {
    id: "CPU", label: "CPU", marker: "U1",
    x: 760, y: 150, w: 220, h: 90,
    topX:   [800, 840, 900, 940],
    botX:   [800, 840, 900, 940],
    leftY:  [180, 220],
    rightY: [180, 220],
  },
  {
    id: "CTRL", label: "CTRL", marker: "U2",
    x: 300, y: 250, w: 170, h: 75,
    topX:   [340, 420],
    botX:   [340, 420],
    leftY:  [280],
    rightY: [280, 300],
  },
  {
    id: "NET", label: "NET", marker: "U3",
    x: 540, y: 390, w: 220, h: 80,
    topX:   [580, 620, 680, 720],
    botX:   [580, 680, 720],
    leftY:  [420, 450],
    rightY: [420, 450],
  },
  {
    id: "IO", label: "I/O", marker: "U4",
    x: 1120, y: 180, w: 220, h: 80,
    topX:   [1160, 1220, 1300],
    botX:   [1160, 1220, 1300],
    leftY:  [200, 240],
    rightY: [200, 240],
  },
  {
    id: "DRV", label: "DRV", marker: "U5",
    x: 1040, y: 470, w: 260, h: 90,
    topX:   [1080, 1160, 1240],
    botX:   [],
    leftY:  [500, 540],
    rightY: [500, 540],
  },
  {
    id: "DSP", label: "DSP", marker: "U6",
    x: 300, y: 540, w: 180, h: 80,
    topX:   [340, 400, 460],
    botX:   [],
    leftY:  [580],
    rightY: [580],
  },
];

const EDGE_R = { x: 1430, y: 300, w: 40, h: 260, pinsY: [320, 360, 400, 440, 480, 520, 540] };
const HEADER_T = { x: 880, y: -10, w: 120, h: 26, pinsX: [900, 920, 940, 960, 980] };

const moduleById = (id: string) => MODULES.find((m) => m.id === id)!;

// Build pad arrays per module (rendered as little SMD pads on each side).
function modulePads(m: ModuleSpec): { pads: Pad[] } {
  const pads: Pad[] = [];
  for (const px of m.topX) pads.push({ x: px - 4, y: m.y - 6, w: 8, h: 6 });
  for (const px of m.botX) pads.push({ x: px - 4, y: m.y + m.h, w: 8, h: 6 });
  for (const py of m.leftY) pads.push({ x: m.x - 6, y: py - 4, w: 6, h: 8 });
  for (const py of m.rightY) pads.push({ x: m.x + m.w, y: py - 4, w: 6, h: 8 });
  return { pads };
}

// ── Trace data ──────────────────────────────────────────────
type Pt = { x: number; y: number };
type Trace = { id: string; d: string; w: number; o: number; pulse?: number };
type Inline =
  | { kind: "resistor";  x: number; y: number; rot?: 0 | 90 }
  | { kind: "capacitor"; x: number; y: number; rot?: 0 | 90 }
  | { kind: "diode";     x: number; y: number; rot?: 0 | 90 }
  | { kind: "inductor";  x: number; y: number; rot?: 0 | 90 };
type Via = { x: number; y: number };
type Built = { traces: Trace[]; vias: Via[]; parts: Inline[] };

function ptsToD(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

// Curated grid-routed traces. Backbone lanes y=130, 250, 370, 510, 660.
// Vertical trunks x=420, 700, 980, 1260.
function buildCircuit(): Built {
  const traces: Trace[] = [];
  const add = (id: string, pts: Pt[], w: number, o: number, pulse?: number) =>
    traces.push({ id, d: ptsToD(pts), w, o, pulse });

  const cpu = moduleById("CPU");
  const ctrl = moduleById("CTRL");
  const net = moduleById("NET");
  const io = moduleById("IO");
  const drv = moduleById("DRV");
  const dsp = moduleById("DSP");

  // ── CPU → I/O bus (top backbone y=130) ──
  add("CPU_IO_1",
    [{x: cpu.x + cpu.w, y: 180}, {x: 980, y: 180}, {x: 980, y: 130}, {x: 1260, y: 130}, {x: 1260, y: 200}, {x: io.x, y: 200}],
    1.4, 0.7, 5200);
  add("CPU_IO_2",
    [{x: cpu.x + cpu.w, y: 220}, {x: 1000, y: 220}, {x: 1000, y: 240}, {x: io.x, y: 240}],
    1.1, 0.55);

  // ── CPU top → top header pins ──
  add("CPU_H1", [{x: 900, y: cpu.y}, {x: 900, y: 36}], 1.0, 0.5);
  add("CPU_H2", [{x: 940, y: cpu.y}, {x: 940, y: 36}], 1.0, 0.45);
  add("CPU_H3", [{x: 840, y: cpu.y}, {x: 840, y: 80}, {x: 920, y: 80}, {x: 920, y: 36}], 1.0, 0.45);
  add("CPU_H4", [{x: 800, y: cpu.y}, {x: 800, y: 60}, {x: 980, y: 60}, {x: 980, y: 36}], 1.0, 0.42);
  add("CPU_H5", [{x: 880, y: cpu.y}, {x: 880, y: 50}, {x: 960, y: 50}, {x: 960, y: 36}], 1.0, 0.4);

  // ── CPU left → CTRL right (mid backbone y=250) ──
  add("CPU_CTRL_1",
    [{x: cpu.x, y: 180}, {x: 700, y: 180}, {x: 700, y: 250}, {x: ctrl.x + ctrl.w, y: 280}],
    1.2, 0.6, 4400);
  add("CPU_CTRL_2",
    [{x: cpu.x, y: 220}, {x: 720, y: 220}, {x: 720, y: 300}, {x: ctrl.x + ctrl.w, y: 300}],
    1.0, 0.5);

  // ── CPU bot → NET top (vertical trunk x=700/720) ──
  add("CPU_NET_1",
    [{x: 800, y: cpu.y + cpu.h}, {x: 800, y: 360}, {x: 700, y: 360}, {x: 700, y: 370}, {x: 720, y: 370}, {x: 720, y: net.y}],
    1.2, 0.6, 5800);
  add("CPU_NET_2",
    [{x: 840, y: cpu.y + cpu.h}, {x: 840, y: 340}, {x: 680, y: 340}, {x: 680, y: net.y}],
    1.0, 0.5);
  add("CPU_NET_3",
    [{x: 900, y: cpu.y + cpu.h}, {x: 900, y: 360}, {x: 620, y: 360}, {x: 620, y: net.y}],
    1.0, 0.45);
  add("CPU_NET_4",
    [{x: 940, y: cpu.y + cpu.h}, {x: 940, y: 380}, {x: 580, y: 380}, {x: 580, y: net.y}],
    1.0, 0.42);

  // ── NET → DRV bus (backbone y=510) ──
  add("NET_DRV_1",
    [{x: net.x + net.w, y: 420}, {x: 980, y: 420}, {x: 980, y: 510}, {x: drv.x, y: 510}],
    1.3, 0.65, 4800);
  add("NET_DRV_2",
    [{x: net.x + net.w, y: 450}, {x: 980, y: 450}, {x: 980, y: 540}, {x: drv.x, y: 540}],
    1.0, 0.55);

  // ── NET ↔ CTRL (left side) ──
  add("NET_CTRL",
    [{x: net.x, y: 420}, {x: 500, y: 420}, {x: 500, y: 250}, {x: ctrl.x + ctrl.w, y: 280}],
    1.0, 0.48);

  // ── NET bot → DSP top ──
  add("NET_DSP_1",
    [{x: 580, y: net.y + net.h}, {x: 580, y: 660}, {x: 460, y: 660}, {x: 460, y: dsp.y}],
    1.0, 0.5);
  add("NET_DSP_2",
    [{x: 680, y: net.y + net.h}, {x: 680, y: 640}, {x: 400, y: 640}, {x: 400, y: dsp.y}],
    1.0, 0.45);
  add("NET_DSP_3",
    [{x: 720, y: net.y + net.h}, {x: 720, y: 680}, {x: 340, y: 680}, {x: 340, y: dsp.y}],
    1.0, 0.42);

  // ── CTRL → DSP (left trunk x=300/280) ──
  add("CTRL_DSP_1",
    [{x: 340, y: ctrl.y + ctrl.h}, {x: 340, y: 380}, {x: 280, y: 380}, {x: 280, y: 660}, {x: 340, y: 660}, {x: 340, y: dsp.y}],
    1.0, 0.45);
  add("CTRL_DSP_2",
    [{x: 420, y: ctrl.y + ctrl.h}, {x: 420, y: 510}, {x: 400, y: 510}, {x: 400, y: dsp.y}],
    1.0, 0.42);

  // ── CTRL left → board edge ──
  add("CTRL_L1", [{x: ctrl.x, y: 280}, {x: 0, y: 280}], 1.0, 0.4);
  add("CTRL_T1", [{x: 340, y: ctrl.y}, {x: 340, y: 130}, {x: 420, y: 130}, {x: 420, y: 60}, {x: 420, y: 0}], 1.0, 0.4);
  add("CTRL_T2", [{x: 420, y: ctrl.y}, {x: 420, y: 130}, {x: 660, y: 130}, {x: 660, y: 60}], 1.0, 0.42);

  // ── I/O → EDGE_R (right backbone y=370 not crossing chips) ──
  add("IO_E1",
    [{x: io.x + io.w, y: 200}, {x: 1380, y: 200}, {x: 1380, y: 320}, {x: EDGE_R.x, y: 320}],
    1.2, 0.6, 5400);
  add("IO_E2",
    [{x: io.x + io.w, y: 240}, {x: 1400, y: 240}, {x: 1400, y: 360}, {x: EDGE_R.x, y: 360}],
    1.0, 0.5);

  // ── DRV → EDGE_R ──
  add("DRV_E1",
    [{x: drv.x + drv.w, y: 500}, {x: 1360, y: 500}, {x: 1360, y: 480}, {x: EDGE_R.x, y: 480}],
    1.2, 0.6);
  add("DRV_E2",
    [{x: drv.x + drv.w, y: 540}, {x: 1380, y: 540}, {x: 1380, y: 520}, {x: EDGE_R.x, y: 520}],
    1.0, 0.55);
  add("DRV_E3",
    [{x: drv.x + drv.w, y: 540}, {x: 1340, y: 540}, {x: EDGE_R.x, y: 540}],
    1.0, 0.45);

  // ── I/O bot → DRV top (vertical trunk x=1160/1240) ──
  add("IO_DRV_1",
    [{x: 1160, y: io.y + io.h}, {x: 1160, y: drv.y}],
    1.2, 0.6, 6200);
  add("IO_DRV_2",
    [{x: 1220, y: io.y + io.h}, {x: 1220, y: 340}, {x: 1240, y: 340}, {x: 1240, y: drv.y}],
    1.0, 0.5);
  add("IO_DRV_3",
    [{x: 1300, y: io.y + io.h}, {x: 1300, y: 360}, {x: 1320, y: 360}, {x: 1320, y: 440}, {x: 1300, y: 440}, {x: 1300, y: drv.y}],
    1.0, 0.42);

  // ── CPU → DRV diagonal (via y=370 and x=1260) ──
  add("CPU_DRV",
    [{x: cpu.x + cpu.w, y: cpu.y + 60}, {x: 1020, y: 220}, {x: 1020, y: 370}, {x: 1260, y: 370}, {x: 1260, y: drv.y}],
    1.0, 0.45);

  // ── I/O top → top header ──
  add("IO_H1", [{x: 1160, y: io.y}, {x: 1160, y: 130}, {x: 1260, y: 130}, {x: 1260, y: 60}], 1.0, 0.4);
  add("IO_H2", [{x: 1220, y: io.y}, {x: 1220, y: 100}, {x: 1340, y: 100}, {x: 1340, y: 0}], 1.0, 0.38);

  // ── Bottom edge fanouts from DSP and NET ──
  add("DSP_B1", [{x: 340, y: dsp.y + dsp.h}, {x: 340, y: 760}, {x: 220, y: 760}, {x: 220, y: 900}], 1.0, 0.42);
  add("DSP_B2", [{x: 400, y: dsp.y + dsp.h}, {x: 400, y: 800}, {x: 540, y: 800}, {x: 540, y: 900}], 1.0, 0.4);
  add("DRV_B1", [{x: 1080, y: drv.y + drv.h}, {x: 1080, y: 760}, {x: 980, y: 760}, {x: 980, y: 900}], 1.0, 0.4);
  add("DRV_B2", [{x: 1240, y: drv.y + drv.h}, {x: 1240, y: 780}, {x: 1340, y: 780}, {x: 1340, y: 900}], 1.0, 0.42);

  // ── Inline components — every one sits on a real straight trace segment ──
  const parts: Inline[] = [
    // Resistors (7) on horizontal runs
    { kind: "resistor", x: 880,  y: 180 },   // CPU_IO_1 segment y=180 (right of CPU)
    { kind: "resistor", x: 1100, y: 240 },   // CPU_IO_2 segment y=240
    { kind: "resistor", x: 600,  y: 180 },   // CPU_CTRL_1 y=180 between ctrl and cpu
    { kind: "resistor", x: 860,  y: 420 },   // NET_DRV_1 y=420
    { kind: "resistor", x: 1260, y: 200 },   // IO_E1 y=200
    { kind: "resistor", x: 1360, y: 480 },   // DRV_E1 y=480
    { kind: "resistor", x: 380,  y: 660 },   // NET_DSP_1 y=660
    // Capacitors (4)
    { kind: "capacitor", x: 800, y: 320, rot: 90 }, // CPU_NET_1 segment x=800 y 240..360
    { kind: "capacitor", x: 980, y: 460, rot: 90 }, // NET_DRV_1 x=980
    { kind: "capacitor", x: 1160, y: 320, rot: 90 }, // IO_DRV_1
    { kind: "capacitor", x: 540, y: 800, rot: 90 }, // DSP_B2
    // Diodes (3) inline on straight runs
    { kind: "diode", x: 1020, y: 240 },     // CPU_IO_2
    { kind: "diode", x: 460,  y: 420 },     // NET_CTRL y=420 segment
    { kind: "diode", x: 1380, y: 360 },     // IO_E2 y=360 around 1400..1430
    // Inductor (2) on open horizontal runs
    { kind: "inductor", x: 760,  y: 420 },  // NET_DRV_1 y=420 left of resistor
    { kind: "inductor", x: 280,  y: 520, rot: 90 }, // CTRL_DSP_1 vertical x=280 y=380..660
  ];

  // ── Vias only at real branch points / endpoints ──
  const vias: Via[] = [
    {x: 980, y: 180}, {x: 980, y: 130},  // CPU_IO_1 corner
    {x: 700, y: 250},                    // CPU_CTRL_1 corner
    {x: 720, y: 370},                    // CPU_NET_1 junction
    {x: 980, y: 510},                    // NET_DRV_1 corner
    {x: 500, y: 250},                    // NET_CTRL corner
    {x: 1380, y: 320},                   // IO_E1 corner
    {x: 1260, y: 130},                   // header trunk
    {x: 280, y: 380}, {x: 280, y: 660},  // CTRL_DSP_1 corners
    {x: 1240, y: 440},                   // IO_DRV_3
    {x: 700, y: 180},                    // CPU left corner
  ];

  return { traces, vias, parts };
}

// ── Module body renderer (CpuArchitecture-inspired) ─────────
function CircuitModule({ m, delay = 0 }: { m: ModuleSpec; delay?: number }) {
  const { pads } = modulePads(m);
  return (
    <g className="hero-part-in" style={{ animationDelay: `${delay}s` }}>
      {/* shadow under chip body */}
      <rect x={m.x + 1} y={m.y + 2} width={m.w} height={m.h} fill="#000" opacity={0.6} rx={4} />
      {/* body */}
      <rect
        x={m.x} y={m.y} width={m.w} height={m.h}
        fill="#0e0e0e" stroke="#3a3a3a" strokeWidth={1} rx={4}
      />
      {/* inner bevel */}
      <rect
        x={m.x + 3} y={m.y + 3} width={m.w - 6} height={m.h - 6}
        fill="none" stroke="#1f1f1f" strokeWidth={1} rx={3}
      />
      {/* orientation notch */}
      <circle cx={m.x + 10} cy={m.y + 10} r={2} fill="#2a2a2a" stroke="#4a4a4a" strokeWidth={0.5} />
      {/* pads */}
      <g fill="#262626" stroke="#4a4a4a" strokeWidth={0.6}>
        {pads.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={1} />
        ))}
      </g>
      {/* label */}
      <text
        x={m.x + m.w / 2} y={m.y + m.h / 2 + 6}
        textAnchor="middle"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontSize={m.w >= 220 ? 22 : 18}
        fontWeight={700}
        fill="#7a7a7a"
        letterSpacing="0.18em"
      >
        {m.label}
      </text>
      {/* part marker silkscreen */}
      {m.marker && (
        <text
          x={m.x + m.w - 6} y={m.y + 12}
          textAnchor="end"
          fontFamily="ui-monospace, monospace"
          fontSize={7}
          fill="#555"
        >
          {m.marker}
        </text>
      )}
    </g>
  );
}

function EdgeConnector() {
  return (
    <g className="hero-part-in" style={{ animationDelay: "0.4s" }}>
      <rect x={EDGE_R.x} y={EDGE_R.y} width={EDGE_R.w} height={EDGE_R.h} fill="#0e0e0e" stroke="#3a3a3a" strokeWidth={1} rx={2} />
      {EDGE_R.pinsY.map((py, i) => (
        <rect key={i} x={EDGE_R.x - 6} y={py - 4} width={6} height={8} fill="#262626" stroke="#4a4a4a" strokeWidth={0.5} />
      ))}
      <text
        x={EDGE_R.x + EDGE_R.w / 2}
        y={EDGE_R.y + EDGE_R.h + 14}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={9}
        fill="#555"
        letterSpacing="0.2em"
      >
        J1
      </text>
    </g>
  );
}

function TopHeader() {
  return (
    <g className="hero-part-in" style={{ animationDelay: "0.4s" }}>
      <rect x={HEADER_T.x} y={HEADER_T.y} width={HEADER_T.w} height={HEADER_T.h} fill="#0e0e0e" stroke="#3a3a3a" strokeWidth={1} />
      {HEADER_T.pinsX.map((px, i) => (
        <rect key={i} x={px - 4} y={HEADER_T.y + HEADER_T.h} width={8} height={6} fill="#262626" stroke="#4a4a4a" strokeWidth={0.5} />
      ))}
    </g>
  );
}

function InlineComponent(c: Inline) {
  const rot = c.rot ?? 0;
  return (
    <g transform={`translate(${c.x} ${c.y}) rotate(${rot})`}>
      {c.kind === "resistor" && (
        <g>
          <rect x={-9} y={-3.5} width={18} height={7} fill="#060606" />
          <rect x={-7} y={-3} width={14} height={6} fill="#1a1a1a" stroke="#6a6a6a" strokeWidth={0.6} />
          <rect x={-9} y={-2} width={2} height={4} fill="#3a3a3a" />
          <rect x={7}  y={-2} width={2} height={4} fill="#3a3a3a" />
        </g>
      )}
      {c.kind === "capacitor" && (
        <g>
          <rect x={-7} y={-3} width={14} height={6} fill="#060606" />
          <rect x={-6} y={-2.5} width={5} height={5} fill="#1a1a1a" stroke="#6a6a6a" strokeWidth={0.6} />
          <rect x={1}  y={-2.5} width={5} height={5} fill="#1a1a1a" stroke="#6a6a6a" strokeWidth={0.6} />
        </g>
      )}
      {c.kind === "diode" && (
        <g>
          <rect x={-8} y={-5} width={16} height={10} fill="#060606" />
          <rect x={-7} y={-4} width={12} height={8} fill="#1a1a1a" stroke="#6a6a6a" strokeWidth={0.6} />
          <rect x={3}  y={-4} width={2} height={8} fill="#cfcfcf" opacity={0.7} />
        </g>
      )}
      {c.kind === "inductor" && (
        <g>
          <rect x={-14} y={-5} width={28} height={9} fill="#060606" />
          <path d="M -12 0 q 4 -8 8 0 q 4 -8 8 0 q 4 -8 8 0" fill="none" stroke="#7a7a7a" strokeWidth={1.1} />
        </g>
      )}
    </g>
  );
}

// ── Lamp positioned above the headline (lower-left area of SVG) ──
// Lamp sits above the "ANI" headline (lower-left in viewport, but above
// the text baseline). With viewBox 1600x900 sliced at 1440x900 the
// headline starts around SVG y≈380 — so the lamp lives at y=340.
const LAMP = { cx: 240, cy: 340, w: 56, h: 32 };
const LAMP_PIN = { x: LAMP.cx, y: LAMP.cy + LAMP.h / 2 + 14 };

function StatusLamp({ on }: { on: boolean }) {
  return (
    <g transform={`translate(${LAMP.cx} ${LAMP.cy})`}>
      {on && (
        <ellipse cx={0} cy={120} rx={160} ry={100} fill="url(#lampHalo)" opacity={0.55} style={{ pointerEvents: "none" }} />
      )}
      <rect x={-20} y={LAMP.h / 2} width={7} height={5} fill="#262626" stroke="#3d3d3d" strokeWidth={0.5} />
      <rect x={13}  y={LAMP.h / 2} width={7} height={5} fill="#262626" stroke="#3d3d3d" strokeWidth={0.5} />
      <line x1={0} y1={LAMP.h / 2} x2={0} y2={LAMP.h / 2 + 14} stroke="#3d3d3d" strokeWidth={1} />
      <rect x={-LAMP.w / 2} y={-LAMP.h / 2} width={LAMP.w} height={LAMP.h} rx={7} fill="#0e0e0e" stroke="#3d3d3d" strokeWidth={1} />
      <text x={LAMP.w / 2 - 5} y={-LAMP.h / 2 - 4} fill="#555" fontFamily="ui-monospace, monospace" fontSize={7} textAnchor="end">D1</text>
      <circle r={11} fill={on ? "#fbbf24" : "#181818"} stroke={on ? "#fde68a" : "#5a5a5a"} strokeWidth={1} style={{ transition: "fill 250ms ease, stroke 250ms ease" }} />
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

// ── Signal path: button → bus down → left → up to lamp ──
const BUTTON_PAD = { x: 1200, y: 720 };
const SIGNAL_D = `M ${BUTTON_PAD.x} ${BUTTON_PAD.y} V 800 H ${LAMP_PIN.x} V ${LAMP_PIN.y}`;
const SIGNAL_DUR_MS = 1300;

// ── Inspection robot (upper-right) — moves on a short rail, probes a chip pad ──
function InspectionRobot({ hide }: { hide: boolean }) {
  if (hide) return null;
  const railY = 110;
  const railX1 = 1360;
  const railX2 = 1500;
  return (
    <g className="hero-part-in" style={{ animationDelay: "1.0s" }}>
      {/* rail */}
      <line x1={railX1} y1={railY} x2={railX2} y2={railY} stroke="#3a3a3a" strokeWidth={2} />
      <circle cx={railX1} cy={railY} r={3} fill="#262626" stroke="#4a4a4a" strokeWidth={0.6} />
      <circle cx={railX2} cy={railY} r={3} fill="#262626" stroke="#4a4a4a" strokeWidth={0.6} />
      <text x={railX1} y={railY - 8} fontFamily="ui-monospace, monospace" fontSize={7} fill="#555" letterSpacing="0.2em">PROBE</text>
      {/* moving carriage */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 18 0; 0 0" dur="6s" repeatCount="indefinite" />
        <g transform={`translate(${railX1 + 20} ${railY})`}>
          {/* carriage body */}
          <rect x={-12} y={-8} width={24} height={10} fill="#161616" stroke="#4a4a4a" strokeWidth={0.8} rx={1.5} />
          <rect x={-9} y={-6} width={18} height={4} fill="#222" />
          {/* probe arm going down */}
          <line x1={0} y1={2} x2={0} y2={28} stroke="#4a4a4a" strokeWidth={1.2} />
          <rect x={-2} y={28} width={4} height={6} fill="#262626" stroke="#5a5a5a" strokeWidth={0.5} />
          {/* probe light */}
          <circle cx={0} cy={36} r={2.5} fill="#7dd3fc">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={0} cy={36} r={6} fill="#7dd3fc" opacity={0.2}>
            <animate attributeName="r" values="4;10;4" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.05;0.3;0.05" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </g>
  );
}

function HeroText({ bp }: { bp?: "mobile" | "tablet" | "desktop" } = {}) {
  const breakpoint = bp ?? "desktop";
  const headline = (size: string) => (
    <h1
      className="font-display font-black uppercase text-white"
      style={{ fontSize: size, letterSpacing: "-0.05em", lineHeight: 0.86 }}
    >
      Ani<br />Velaga
    </h1>
  );
  const paragraph = (extra: string = "") => (
    <p
      className={`font-mono leading-relaxed text-neutral-400 ${extra}`}
      style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)", maxWidth: "38ch" }}
    >
      <span className="text-neutral-100">Electrical &amp; computer engineer</span> — I design
      hardware at the board level, then push it through the networking stack into LLM
      inference systems. Currently on CUAUV building PCBs for an autonomous submarine.
      <span className="blink-cursor">_</span>
    </p>
  );

  if (breakpoint === "mobile") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex flex-col items-center px-5 pb-10 text-center">
        <div className="pointer-events-auto w-full max-w-md">
          {headline("clamp(3.8rem, 16vw, 6rem)")}
          <div className="mt-5 flex justify-center">{paragraph("text-center")}</div>
        </div>
      </div>
    );
  }
  if (breakpoint === "tablet") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[3] mx-auto flex max-w-5xl items-end px-8 pb-20">
        <div className="pointer-events-auto" style={{ maxWidth: "52%" }}>
          {headline("clamp(4rem, 9vw, 7rem)")}
          <div className="mt-5">{paragraph()}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] mx-auto flex max-w-6xl items-end px-6 pb-24 sm:px-10 sm:pb-28">
      <div className="pointer-events-auto max-w-xl">
        {headline("clamp(5rem, 10vw, 12rem)")}
        <div className="mt-6">{paragraph()}</div>
      </div>
    </div>
  );
}

function CircuitHero() {
  const built = useMemo(() => buildCircuit(), []);
  const pulses = built.traces.filter((t) => t.pulse);
  const [lampOn, setLampOn] = useState(false);
  const [signaling, setSignaling] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pulseId, setPulseId] = useState(0);
  const [pressed, setPressed] = useState(false);
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const preserve = isMobile || isTablet ? "xMidYMin meet" : "xMidYMid slice";
  const timers = useRef<number[]>([]);
  const clearAllTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const triggerSignal = () => {
    clearAllTimers();
    setPressed(true);
    timers.current.push(window.setTimeout(() => setPressed(false), 180));
    if (lampOn || signaling) {
      setLampOn(false);
      setSignaling(false);
      return;
    }
    setPulseId((n) => n + 1);
    setSignaling(true);
    timers.current.push(window.setTimeout(() => setLampOn(true), SIGNAL_DUR_MS));
    timers.current.push(window.setTimeout(() => { setLampOn(false); setSignaling(false); }, SIGNAL_DUR_MS + 4000));
  };

  return (
    <section
      id="top"
      data-hero
      data-section="00"
      className="hero-shell"
      style={{ background: "#060606" }}
    >
      <div className="pointer-events-none absolute left-0 right-0 z-[1]" style={{ top: 0, bottom: 0 }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio={preserve}
          className="hero-circuit-fade absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
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
            </mask>
          </defs>

          {/* circuit layer (masked behind text zone) */}
          <g mask="url(#heroTraceMask)">
            {/* traces first, then modules render on top so endpoints sit cleanly under chip edges */}
            <g fill="none" strokeLinecap="square" strokeLinejoin="round">
              {built.traces.map((t, i) => (
                <path
                  key={t.id}
                  d={t.d}
                  pathLength={1}
                  stroke={t.w >= 1.3 ? "#525252" : "#3a3a3a"}
                  strokeOpacity={t.o}
                  strokeWidth={t.w}
                  className="hero-trace-draw"
                  style={{ animationDelay: `${0.15 + i * 0.04}s` }}
                />
              ))}
            </g>

            {/* modules */}
            {MODULES.map((m, i) => (
              <CircuitModule key={m.id} m={m} delay={0.3 + i * 0.08} />
            ))}
            <EdgeConnector />
            <TopHeader />

            {/* inline parts */}
            <g className="hero-part-in" style={{ animationDelay: "1.6s" }}>
              {built.parts.map((p, i) => (
                <InlineComponent key={i} {...p} />
              ))}
            </g>

            {/* vias */}
            <g className="hero-part-in" style={{ animationDelay: "1.5s" }}>
              {built.vias.map((v, i) => (
                <g key={i}>
                  <circle cx={v.x} cy={v.y} r={4} fill="none" stroke="#3a3a3a" strokeWidth={0.8} />
                  <circle cx={v.x} cy={v.y} r={2.5} fill="#0a0a0a" stroke="#5a5a5a" strokeWidth={0.8} />
                </g>
              ))}
            </g>

            {/* subtle signal pulses on selected traces */}
            {pulses.map((t, i) => (
              <g key={t.id}>
                <circle r={2.2} fill={i % 2 === 0 ? "rgba(140,180,255,0.9)" : "rgba(255,255,255,0.85)"}>
                  <animateMotion dur={`${t.pulse! / 1000}s`} repeatCount="indefinite" path={t.d} />
                </circle>
                <circle r={5} fill={i % 2 === 0 ? "rgba(140,180,255,0.25)" : "rgba(255,255,255,0.2)"}>
                  <animateMotion dur={`${t.pulse! / 1000}s`} repeatCount="indefinite" path={t.d} />
                </circle>
              </g>
            ))}

            {/* inspection robot — hidden on mobile */}
            <InspectionRobot hide={isMobile} />
          </g>

          {/* signal trace + lamp (above text mask so always visible) */}
          <g>
            <path
              d={SIGNAL_D}
              fill="none"
              stroke="#3a3a3a"
              strokeOpacity={0.5}
              strokeWidth={1.4}
              strokeLinecap="square"
              strokeLinejoin="round"
              pathLength={1}
              className="hero-trace-draw"
              style={{ animationDelay: "1.5s" }}
            />
            <path
              d={SIGNAL_D}
              fill="none"
              stroke="#fbbf24"
              strokeOpacity={signaling || lampOn ? 1 : 0}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={signaling || lampOn ? 0 : 1}
              style={{
                transition: signaling
                  ? `stroke-dashoffset ${SIGNAL_DUR_MS}ms linear, stroke-opacity 120ms ease`
                  : "stroke-dashoffset 400ms ease, stroke-opacity 400ms ease",
                filter: "drop-shadow(0 0 4px rgba(251,191,36,0.7))",
                pointerEvents: "none",
              }}
            />
            <g className="hero-part-in" style={{ animationDelay: "1.7s" }}>
              <circle cx={BUTTON_PAD.x} cy={800} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={LAMP_PIN.x} cy={800} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
            </g>
            {signaling && pulseId > 0 && (
              <g key={`dis-${pulseId}`} style={{ pointerEvents: "none" }}>
                <circle r={3.4} fill="#fff4d6">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={SIGNAL_D} />
                </circle>
                <circle r={8} fill="rgba(251,191,36,0.45)">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={SIGNAL_D} />
                </circle>
              </g>
            )}
            <g className="hero-part-in" style={{ animationDelay: "1.6s" }}>
              <StatusLamp on={lampOn} />
            </g>
          </g>

          {/* hardware switch module */}
          <g className="hero-part-in" style={{ animationDelay: "1.8s" }}>
            <line x1={BUTTON_PAD.x} y1={650} x2={BUTTON_PAD.x} y2={BUTTON_PAD.y} stroke="#3a3a3a" strokeWidth={1.2} />
            <circle cx={BUTTON_PAD.x} cy={BUTTON_PAD.y} r={3.5} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.9} />
            <foreignObject
              x={BUTTON_PAD.x - 110}
              y={555}
              width={220}
              height={140}
              style={{ overflow: "visible", pointerEvents: "auto" }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label="Click me"
                aria-pressed={lampOn}
                onClick={triggerSignal}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerSignal(); } }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
                style={{
                  position: "relative", width: "100%", height: "100%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  paddingBottom: 18, boxSizing: "border-box",
                  cursor: "pointer", outline: "none",
                }}
              >
                <div
                  style={{
                    width: 140, height: 40,
                    background: "linear-gradient(180deg, #131313 0%, #0a0a0a 100%)",
                    border: "1px solid #2c2c2c", borderRadius: 3,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                    boxShadow: hovering || signaling || lampOn
                      ? "0 0 0 1px rgba(251,191,36,0.4), 0 0 16px rgba(251,191,36,0.3)"
                      : undefined,
                    transition: "box-shadow 200ms ease",
                  }}
                >
                  {[{top:4,left:4},{top:4,right:4},{bottom:4,left:4},{bottom:4,right:4}].map((p,i)=>(
                    <span key={i} style={{ position:"absolute", width:3, height:3, borderRadius:999, background:"#1a1a1a", border:"0.5px solid #333", ...p}} />
                  ))}
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, ui-monospace, monospace",
                      fontSize: 11, letterSpacing: "0.24em", paddingLeft: "0.24em",
                      textTransform: "uppercase",
                      color: lampOn || signaling ? "#fbbf24" : hovering ? "#e8d28a" : "#9a9a9a",
                      transition: "color 200ms ease",
                    }}
                  >
                    Click me :)
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute", top: 36, left: "50%",
                    transform: "translateX(-50%)",
                    width: 76, height: 50,
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute", left: "50%", bottom: 0,
                      transform: "translateX(-50%)", width: 64, height: 9,
                      borderRadius: "2px 2px 1px 1px",
                      background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                      border: "1px solid #2c2c2c", borderBottom: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "relative", width: 48, height: 14,
                      marginBottom: 6, borderRadius: 3,
                      background: "linear-gradient(180deg, #5a0e0e 0%, #3a0707 60%, #1c0303 100%)",
                      boxShadow: pressed
                        ? "0 1px 0 rgba(0,0,0,0.85), inset 0 2px 3px rgba(0,0,0,0.55)"
                        : hovering
                          ? "0 4px 6px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,191,36,0.55), 0 0 18px rgba(251,191,36,0.45)"
                          : "0 2px 3px rgba(0,0,0,0.6)",
                      transform: (hovering && !pressed) ? "translateY(-2px)" : pressed ? "translateY(1px)" : "translateY(0)",
                      transition: "transform 120ms ease, box-shadow 200ms ease",
                      overflow: "hidden",
                      animation: !hovering && !pressed ? "hwBtnIdle 2.4s ease-in-out infinite" : undefined,
                    }}
                  >
                    <style>{`
                      @keyframes hwBtnIdle {
                        0%, 100% { transform: translateY(0); }
                        50%      { transform: translateY(-2px); }
                      }
                    `}</style>
                    <span
                      style={{
                        position: "absolute", left: 2, right: 2, top: 2, bottom: 3,
                        borderRadius: 2,
                        background: "linear-gradient(180deg, #ff5a5a 0%, #e02a2a 45%, #a51414 100%)",
                        boxShadow: pressed
                          ? "inset 0 2px 3px rgba(0,0,0,0.5)"
                          : "inset 0 -2px 3px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.22)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      <HeroText bp={bp} />

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
  cameraOrbit = "0deg 75deg 105%",
}: {
  embedded?: boolean;
  src?: string;
  idleElevation?: number;
  cameraOrbit?: string;
}) {
  const ref = useMouseSpin(20);
  return (
    <div
      className={embedded ? "h-full" : "col-span-12 mt-4"}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={embedded ? "overflow-hidden h-full" : "overflow-hidden border border-border"}
        style={{ backgroundColor: "#111", width: "100%", height: embedded ? 450 : 300 }}
      >
        <model-viewer
          ref={ref as unknown as React.Ref<HTMLElement>}
          src={src}
          alt="Serial Board 3D model"
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
          rotation-per-second="20deg"
          camera-orbit={cameraOrbit}
          interaction-prompt="none"
          loading="eager"
          reveal="auto"
            style={{ width: "100%", height: "100%", backgroundColor: "#111", transform: "translateY(8%)" } as React.CSSProperties}
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
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ? CATEGORIES.find((c) => c.id === selected) ?? null : null;

  const cards = [
    {
      id: "01",
      label: "01 / PCB DESIGN",
      title: "Circuit Board Design",
      desc: "3D-rendered PCBs designed for Cornell AUV — communication boards, thruster controllers, and more.",
      preview: "pcb" as const,
    },
    {
      id: "02",
      label: "02 / PERSONAL",
      title: "Personal Projects",
      desc: "Side projects and experiments outside of work.",
      preview: "code" as const,
    },
    {
      id: "03",
      label: "03 / RESEARCH",
      title: "LLM Inference Research",
      desc: "Doing some cool stuff @ByteDance with Charon, Vidur and LLM inference simulation. Will update soon :)",
      preview: "brain" as const,
    },
  ];

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="01" kicker="Selected Work" title="Things I've built." />

      <div className="mt-16">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {cards.map((card, i) => (
                <motion.button
                  key={card.id}
                  type="button"
                  onClick={() => setSelected(card.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col overflow-hidden border border-border bg-secondary/20 text-left transition-colors hover:border-mark/60"
                  style={{ borderRadius: 2 }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ height: 200, background: "#111" }}
                  >
                    {card.preview === "pcb" ? (
                      <model-viewer
                        src={SERIAL_INLINE_GLB}
                        alt="PCB preview"
                        auto-rotate
                        auto-rotate-delay={0}
                        rotation-per-second="22deg"
                        interaction-prompt="none"
                        loading="eager"
                        reveal="auto"
                        camera-orbit="35deg 70deg 110%"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#111",
                          pointerEvents: "none",
                          transform: "translateY(6%)",
                        } as React.CSSProperties}
                      />
                    ) : card.preview === "code" ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Terminal
                          className="text-mark/70 transition-transform duration-500 group-hover:scale-110"
                          size={64}
                          strokeWidth={1.25}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BrainCircuit
                          className="text-mark/70 transition-transform duration-500 group-hover:scale-110"
                          size={64}
                          strokeWidth={1.25}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mark">
                      {card.label}
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-dim">{card.desc}</p>
                    <div className="mt-auto pt-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground transition-colors group-hover:text-mark">
                        Explore
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`detail-${active.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="relative mb-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-2 rounded-sm border border-rule px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim transition-all hover:border-mark hover:text-mark sm:absolute sm:left-0"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <div className="relative inline-flex items-center gap-1 rounded-full border border-rule bg-secondary/30 p-1 backdrop-blur-md">
                  {cards.map((card) => {
                    const isActive = card.id === active.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelected(card.id)}
                        className={`relative z-10 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                          isActive ? "text-background" : "text-ink-dim hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="work-tab-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-mark"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative">{card.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`block-${active.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <CategoryBlock category={active} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CategoryBlock({ category: c }: { category: Category }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = c.projects.find((p) => p.id === openId) ?? null;
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-dim">
          <span className="text-mark">{c.id}</span> / Category
        </div>
        <h3 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {c.label}
        </h3>
        {c.intro ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-dim">{c.intro}</p>
        ) : null}
      </div>
      {c.projects.length === 0 ? (
        <div className="mt-12 flex items-center justify-center border-y border-border px-6 py-20">
          <p className="max-w-2xl text-center font-display text-lg leading-relaxed text-ink-dim sm:text-xl">
            Doing some cool stuff @ByteDance with Charon, Vidur and LLM inference simulation. Will update soon :)
          </p>
        </div>
      ) : (
      <ul
        className={
          c.id === "01"
            ? "mt-12 grid gap-4 sm:grid-cols-2"
            : "mt-12 divide-y divide-border border-y border-border"
        }
      >
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
                  <div className="flex flex-col">
                    <div
                      className="relative w-full"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", height: 450 }}
                    >
                      {!p.comingSoon ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(p.id);
                          }}
                          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-sm border-2 border-rule bg-background/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
                        >
                          <span>View details</span>
                          <span>→</span>
                        </button>
                      ) : null}
                      <InlineSerialModel embedded src={SERIAL_INLINE_GLB} cameraOrbit="35deg 70deg 105%" />
                    </div>
                    <div className="w-full">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
                        bare
                        hideViewDetails
                      />
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
                  <div className="flex flex-col">
                    <div
                      className="relative w-full"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", height: 450 }}
                    >
                      {!p.comingSoon ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(p.id);
                          }}
                          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-sm border-2 border-rule bg-background/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
                        >
                          <span>View details</span>
                          <span>→</span>
                        </button>
                      ) : null}
                      <InlineSerialModel embedded src={THRUSTER_INLINE_GLB} idleElevation={15} cameraOrbit="-120deg 80deg 105%" />
                    </div>
                    <div className="w-full">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        onOpen={p.comingSoon ? undefined : () => setOpenId(p.id)}
                        bare
                        hideViewDetails
                      />
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
      )}
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
  hideViewDetails = false,
}: {
  project: Project;
  categoryId: string;
  onOpen?: () => void;
  bare?: boolean;
  hideViewDetails?: boolean;
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
      className={`group transition-colors ${
        bare
          ? "flex flex-col gap-2 py-3 px-4"
          : "grid grid-cols-12 items-baseline gap-6 py-10"
      } ${
        p.comingSoon ? "opacity-50" : ""
      } ${clickable ? (bare ? "cursor-pointer" : "cursor-pointer hover:bg-secondary/40 -mx-4 px-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]") : ""}`}
    >
      <div className={`font-mono uppercase tracking-[0.25em] text-ink-faint ${bare ? "text-[10px]" : "col-span-12 text-xs sm:col-span-2"}`}>
        {categoryId}.{p.id}
        {p.year ? <> / {p.year}</> : null}
      </div>
      <div className={bare ? "" : "col-span-12 sm:col-span-7"}>
        <h4 className={`font-display font-bold tracking-tight text-foreground ${bare ? "text-base sm:text-lg" : "text-2xl sm:text-3xl"}`}>
          {p.name}
          {p.comingSoon ? (
            <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Coming Soon
            </span>
          ) : null}
        </h4>
        {p.bullets && p.bullets.length > 0 ? (
          <ul className={`max-w-2xl leading-relaxed text-ink-dim ${bare ? "mt-1.5 space-y-0.5 text-[11px]" : "mt-3 space-y-1.5 text-base"}`}>
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-ink-faint">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`max-w-2xl leading-relaxed text-ink-dim ${bare ? "mt-1.5 text-[11px]" : "mt-3 text-base"}`}>{p.tagline}</p>
        )}
        {p.stack.length > 0 ? (
          <div className={`flex flex-wrap gap-1.5 ${bare ? "mt-2" : "mt-5"}`}>
            {p.stack.map((s) => (
              <span key={s} className="tag-pill">{s}</span>
            ))}
          </div>
        ) : null}
        {clickable && !hideViewDetails ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
            className={`inline-flex items-center rounded-sm border-2 border-rule bg-secondary/40 font-mono uppercase tracking-[0.25em] text-foreground transition-all hover:border-mark hover:bg-mark/10 hover:text-mark ${bare ? "mt-2 gap-1.5 px-3 py-1.5 text-[10px]" : "mt-6 gap-2.5 px-6 py-3 text-sm"}`}
          >
            <span>View details</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        ) : null}
      </div>
      <div
        className={`flex flex-wrap text-sm ${bare ? "gap-3" : "col-span-12 gap-6 sm:col-span-3 sm:justify-end"}`}
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
                : ""}
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
      className="flex flex-col"
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
        className={`w-full px-4 py-3 ${clickable ? "cursor-pointer" : ""}`}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-faint">
          ↳ Sub-project &nbsp;·&nbsp; {categoryId}.{p.id}
        </div>
        <h5 className="mt-1 font-display text-xs font-bold tracking-tight text-foreground sm:text-sm">
          {p.name}
        </h5>
        <p className="mt-1 max-w-md text-[11px] leading-relaxed text-ink-dim">
          {p.tagline.split(".")[0]}.
        </p>
      </div>
      <div
        className="relative w-full"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", height: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        {clickable ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm border-2 border-rule bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
          >
            <span>View details</span>
            <span>→</span>
          </button>
        ) : null}
        <div style={{ width: "100%", height: "100%" }} className="overflow-hidden">
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
            style={{ width: "100%", height: "100%", backgroundColor: "transparent", transform: "translateY(8%)" } as React.CSSProperties}
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
  const isSerial = p.name === "Serial Communication Board";
  const isThruster =
    p.name === "High-Power Thruster Control Board" ||
    p.name.startsWith("Thruster Board");

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

      {isSerial ? (
        <>
          <SerialBoardGallery />
          <FabricatedBoard
            name="Serial Board"
            front={serialFabFrontAsset.url}
            back={serialFabBackAsset.url}
          />
        </>
      ) : null}
      {isThruster ? (
        <>
          <ThrusterBoardGallery />
          <FabricatedBoard
            name="Thruster Board"
            front={thrusterFabFrontAsset.url}
            back={thrusterFabBackAsset.url}
          />
        </>
      ) : null}

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

  return <BoardGallery images={images} />;
}

function FabricatedBoard({ name, front, back }: { name: string; front: string; back: string }) {
  return (
    <div className="mt-2">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        Fabricated + Soldered Board
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { src: front, label: "Front" },
          { src: back, label: "Back" },
        ].map((img) => (
          <div
            key={img.label}
            className="relative aspect-[4/3] overflow-hidden rounded-md border border-border"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <img
              src={img.src}
              alt={`${name} fabricated and soldered, ${img.label.toLowerCase()}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              {img.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardGallery({ images }: { images: { id: string; label: string; src: string; alt: string }[] }) {
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

function ThrusterBoardGallery() {
  const images = [
    { id: "layout", label: "2D Layout", src: thrusterLayoutAsset.url, alt: "Thruster Board 2D PCB schematic layout" },
    { id: "front", label: "3D Front", src: thrusterFrontAsset.url, alt: "Thruster Board 3D front render" },
    { id: "back", label: "3D Back", src: thrusterBackAsset.url, alt: "Thruster Board 3D back render" },
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
    <section
      id="about"
      className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeader index="02" kicker="About" title="About Me." />
      <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <div className="mx-auto w-full max-w-[440px] md:max-w-none">
            <img
              src={headshotAsset.url}
              alt="Ani Velaga"
              className="block h-auto w-full border border-border object-cover"
              style={{ aspectRatio: "4 / 5" }}
              loading="lazy"
            />
          </div>
        </div>
        <div className="md:col-span-7">
          <p className="text-base leading-relaxed text-ink-dim sm:text-lg">
            I'm an electrical and computer engineering student at Cornell, currently on
            CUAUV — Cornell's autonomous underwater vehicle team. I design production PCBs in
            Altium Designer: 4-layer stackups, differential pair routing, ESD protection,
            high-speed USB. The submarine goes in real water, so the boards have to work.
          </p>
          <p className="mt-6 text-base leading-relaxed text-ink-dim sm:text-lg">
            My work runs from board-level hardware through the networking stack up into LLM
            inference systems. I care about the full path: what the silicon is doing, how data
            moves between nodes, and where inference bottlenecks actually live. I'm looking for
            roles where that end-to-end view matters.
          </p>
          <div className="mt-10">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">
              Skills
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span key={s} className="tag-pill">{s}</span>
              ))}
            </div>
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
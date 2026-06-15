import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, BrainCircuit } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
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
// Shifted right by 48px to clear lamp (D1) on the left.
// New pins — tops: 452,476,500 (y=236) · bots: 452,476,500 (y=310) · lefts x=424 · rights x=528
const CHIP_C = { x: 428, y: 240, w: 96, h: 66 };
// CHIP_B — center-left support chip. xs(2): 520 + 40*(i+1) = 560,600. ys(2): 380+20*(i+1) = 400,420
const CHIP_B = { x: 520, y: 380, w: 120, h: 60 };
// CHIP_D — mid-canvas SOIC, fills the empty space between CHIP_B and portrait.
// Pads (w=160, pins=4): top/bot xs = 776 + 32*(i+1) = 808,840,872,904
const CHIP_D = { x: 776, y: 488, w: 160, h: 60 };
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

function ptsToD(pts: Pt[]): string {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

// Deterministic, declarative routed-graph circuit. No randomness.
// All bend points are multiples of 24 (the invisible routing grid).
// Endpoints land exactly on real pad/pin tips, chip pins, header pins,
// connector pins, or the canvas edge. Paths are strictly orthogonal.
// Keepout zones (component bodies) are enforced manually per trace.
function buildCircuit(_seed: number): Built {
  const traces: Trace[] = [];
  const add = (id: string, pts: Pt[], w: number, o: number, pulse?: number) => {
    traces.push({ id, d: ptsToD(pts), w, o, pulse });
  };

  // ── Routing lane plan (24px invisible grid) ───────────────────────
  // Horizontal backbone lanes (y):  72, 216, 360, 576, 672, 792
  // Vertical trunk lanes      (x): 264, 504, 688, 984, 1416
  // Every trace lives on one of these lanes (or a single-lane jog at a
  // chip-adjacent column) and lands on a real pad/pin tip or board edge.
  //
  // Keepouts respected:
  //   PORT  x 1060..1320, y 270..590     (portrait body)
  //   CTRL  x 1080..1300, y 585..725     (button/control module)
  //   CHIP_A x 680..824, y 110..182
  //   CHIP_B x 520..640, y 380..440
  //   CHIP_C x 380..476, y 240..306
  //   CHIP_D x 776..936, y 488..548
  //   EDGE_R x 1540..1600, y 360..580
  //   HEADER_T x 880..980, y -10..16

  // ── Portrait LEFT pads → buses (8) ──
  // L1 → header pin (922,20) via north backbone (y=72)
  add("L1", [{x:1052,y:296},{x:984,y:296},{x:984,y:72},{x:922,y:72},{x:922,y:20}], 1.5, 0.55, 6200);
  // L2 → CHIP_A right pin (828,134)
  add("L2", [{x:1052,y:332},{x:984,y:332},{x:984,y:134},{x:828,y:134}], 1.25, 0.5);
  // L3 → CHIP_A right pin (828,158)
  add("L3", [{x:1052,y:368},{x:960,y:368},{x:960,y:158},{x:828,y:158}], 1.25, 0.5, 7400);
  // L4 → CHIP_B right pin (644,400). Trunk at x=688, no chip-body crossing.
  add("L4", [{x:1052,y:404},{x:688,y:404},{x:688,y:400},{x:644,y:400}], 1.25, 0.5);
  // L5 → CHIP_B right pin (644,420)
  add("L5", [{x:1052,y:440},{x:688,y:440},{x:688,y:420},{x:644,y:420}], 1.0, 0.45);
  // L6 → CHIP_D top pin (808,484). Lane y=476 sits above chip body (y=488+).
  add("L6", [{x:1052,y:476},{x:808,y:476},{x:808,y:484}], 1.25, 0.5);
  // L7 → CHIP_D top pin (872,484). Jogs around chip body via y=476.
  add("L7", [{x:1052,y:512},{x:984,y:512},{x:984,y:476},{x:872,y:476},{x:872,y:484}], 1.0, 0.45);
  // L8 → CHIP_D top pin (904,484). Same lane discipline.
  add("L8", [{x:1052,y:548},{x:984,y:548},{x:984,y:476},{x:904,y:476},{x:904,y:484}], 1.25, 0.5);

  // ── Portrait TOP pads (5) ──
  add("T1", [{x:1103,y:262},{x:1103,y:0}], 1.0, 0.4);
  add("T2", [{x:1147,y:262},{x:1147,y:72},{x:954,y:72},{x:954,y:20}], 1.25, 0.5, 5600);
  add("T3", [{x:1190,y:262},{x:1190,y:0}], 1.5, 0.55, 4800);
  add("T4", [{x:1233,y:262},{x:1233,y:96},{x:1416,y:96},{x:1416,y:0}], 1.0, 0.45);
  add("T5", [{x:1277,y:262},{x:1277,y:120},{x:1488,y:120},{x:1488,y:0}], 1.0, 0.4);

  // ── Portrait RIGHT pads → EDGE_R / canvas right (4) ──
  add("R1", [{x:1328,y:296},{x:1600,y:296}], 1.25, 0.5, 6800);
  add("R2", [{x:1328,y:404},{x:1416,y:404},{x:1416,y:410},{x:1536,y:410}], 1.25, 0.5);
  add("R3", [{x:1328,y:476},{x:1416,y:476},{x:1416,y:470},{x:1536,y:470}], 1.25, 0.5);
  add("R4", [{x:1328,y:548},{x:1416,y:548},{x:1416,y:560},{x:1536,y:560}], 1.0, 0.45);

  // ── CHIP_A north / south (2) ──
  // header pin (938,20) → CHIP_A top pin (752,106)
  add("FA1", [{x:938,y:20},{x:938,y:72},{x:752,y:72},{x:752,y:106}], 1.0, 0.4);
  // CHIP_A bot pin (728,186) → CHIP_D top pin (840,484) via y=216 bus then x=840 trunk
  add("FA2", [{x:728,y:186},{x:728,y:216},{x:840,y:216},{x:840,y:484}], 1.0, 0.42);

  // ── CHIP_C (upper-left connector) fanout (4) ──
  add("C1", [{x:452,y:236},{x:452,y:72},{x:312,y:72},{x:312,y:0}], 1.0, 0.4);
  add("C2", [{x:424,y:262},{x:264,y:262},{x:264,y:168},{x:0,y:168}], 1.0, 0.4);
  // CHIP_C top pin (452,236) → CHIP_A left pin (676,134)
  add("C3", [{x:500,y:236},{x:500,y:134},{x:676,y:134}], 1.0, 0.42);
  // CHIP_C bot pin (404,310) → CHIP_B left pin (516,400) via y=360 bus and x=516 trunk
  add("C4", [{x:452,y:310},{x:452,y:360},{x:516,y:360},{x:516,y:400}], 1.0, 0.4);

  // ── Inter-chip pad-to-pad routes ──
  // CHIP_A bot pin (704,186) → CHIP_B top pin (560,376) via y=360 bus
  add("AB1", [{x:704,y:186},{x:704,y:360},{x:560,y:360},{x:560,y:376}], 1.0, 0.42);
  // CHIP_B bot pin (600,444) → CHIP_D top pin (808,484) via y=460 lane (24px clearance above chip)
  add("BD1", [{x:600,y:444},{x:600,y:460},{x:808,y:460},{x:808,y:484}], 1.0, 0.4);

  // ── Header → CHIP_A top fanout (2 more, all on y=72 backbone) ──
  add("HA1", [{x:890,y:20},{x:890,y:72},{x:704,y:72},{x:704,y:106}], 1.0, 0.4);
  add("HA2", [{x:906,y:20},{x:906,y:72},{x:728,y:72},{x:728,y:106}], 1.0, 0.38);

  // ── EDGE_R ↔ portrait right fanout (3 more, all share x=1416 trunk) ──
  add("EP1", [{x:1536,y:380},{x:1416,y:380},{x:1416,y:368},{x:1328,y:368}], 1.0, 0.42);
  add("EP2", [{x:1536,y:500},{x:1416,y:500},{x:1416,y:440},{x:1328,y:440}], 1.0, 0.4);
  add("EP3", [{x:1536,y:530},{x:1416,y:530},{x:1416,y:512},{x:1328,y:512}], 1.0, 0.4);

  // ── Extra pad-to-pad routes across the visible center board ──
  // CHIP_C right (480,262) → CHIP_A left (676,132) via y=200 lane
  add("CA1", [{x:528,y:262},{x:548,y:262},{x:548,y:200},{x:660,y:200},{x:660,y:132},{x:676,y:132}], 1.0, 0.4);
  // CHIP_C right (528,284) → CHIP_B right (644,420) — route around CHIP_B from the right
  add("CB1", [{x:528,y:284},{x:680,y:284},{x:680,y:420},{x:644,y:420}], 1.0, 0.4);
  // CHIP_C bot (452,310) → CHIP_B top (560,376) via y=328 lane (spaced apart from CB3/C4)
  add("CB2", [{x:452,y:310},{x:452,y:328},{x:560,y:328},{x:560,y:376}], 1.0, 0.38);
  // CHIP_C bot (500,310) → CHIP_B top (600,376) via y=352 lane
  add("CB3", [{x:500,y:310},{x:500,y:352},{x:600,y:352},{x:600,y:376}], 1.0, 0.38);
  // CHIP_A bot (776,186) → CHIP_D top pin3 (872,484). Long vertical drops only; shared y=228 lane sits far above CHIP_D.
  add("AD1", [{x:776,y:186},{x:776,y:228},{x:872,y:228},{x:872,y:484}], 1.0, 0.4);
  // CHIP_A bot (800,186) → CHIP_D top pin4 (904,484) via y=240 lane (well above chip)
  add("AD2", [{x:800,y:186},{x:800,y:240},{x:904,y:240},{x:904,y:484}], 1.0, 0.38);

  // ── CHIP_D bot pins → bottom board edge (2 outputs) ──
  add("DB1", [{x:840,y:552},{x:840,y:792},{x:760,y:792},{x:760,y:900}], 1.0, 0.4);
  add("DB2", [{x:872,y:552},{x:872,y:720},{x:1100,y:720},{x:1100,y:900}], 1.0, 0.38);

  // ── CHIP_C extra left-edge fanout ──
  add("CL1", [{x:424,y:284},{x:200,y:284},{x:200,y:216},{x:0,y:216}], 1.0, 0.38);

  // ── Header → CHIP_A more pins (use y=72 backbone) ──
  add("HA3", [{x:922,y:20},{x:922,y:88},{x:776,y:88},{x:776,y:106}], 1.0, 0.36);
  add("HA4", [{x:970,y:20},{x:970,y:88},{x:800,y:88},{x:800,y:106}], 1.0, 0.36);

  // ── Portrait BOTTOM pads (5) → escape routes. Center pin (1190,590) drops into
  //    the button (1190,700). Other 4 fan out to bottom/edges, avoiding the button. ──
  add("PB_CTR", [{x:1190,y:590},{x:1190,y:700}], 1.25, 0.5);
  add("PB1", [{x:1103,y:590},{x:1103,y:628},{x:980,y:628},{x:980,y:900}], 1.0, 0.4);
  add("PB2", [{x:1147,y:590},{x:1147,y:652},{x:1040,y:652},{x:1040,y:900}], 1.0, 0.38);
  add("PB3", [{x:1233,y:590},{x:1233,y:628},{x:1360,y:628},{x:1360,y:900}], 1.0, 0.4);
  add("PB4", [{x:1277,y:590},{x:1277,y:652},{x:1420,y:652},{x:1420,y:900}], 1.0, 0.38);

  // ── Fill right-side blank area (between CHIP_A right and portrait top) ──
  // EDGE_R extra pin → portrait right pad row at y=332
  add("ER1", [{x:1536,y:320},{x:1416,y:320},{x:1416,y:332},{x:1328,y:332}], 1.0, 0.38);
  // CHIP_A right pin (828,158) extension already exists via L3. Add header→CHIP_A top (824)
  add("HA5", [{x:954,y:20},{x:954,y:96},{x:824,y:96},{x:824,y:106}], 1.0, 0.36);

  // ── Inline parts — each centered exactly on a real straight segment.
  //    No part overlaps a chip body, the portrait, or the control module. ──
  const parts: Inline[] = [
    // Resistors (4) — SMD 0805 on horizontal runs
    { kind: "resistor",  x: 900,  y: 134, rot: 0 },   // on L2 segment y=134 x 828..984
    { kind: "resistor",  x: 876,  y: 158, rot: 0 },   // on L3 segment y=158 x 828..960
    { kind: "resistor",  x: 1464, y: 296, rot: 0 },   // on R1 segment y=296 x 1328..1600
    { kind: "resistor",  x: 576,  y: 134, rot: 0 },   // on C3 segment y=134 x 452..676
    // Capacitors (3) — vertical SMD on vertical runs
    { kind: "capacitor", x: 1103, y: 192, rot: 90 },  // on T1 trunk x=1103 y 0..262
    { kind: "capacitor", x: 1190, y: 228, rot: 90 },  // on T3 trunk x=1190 y 0..262
    { kind: "capacitor", x: 600,  y: 576, rot: 90 },  // on CB2 trunk x=600 y 444..672
    // Diodes (2) — horizontal, both anode-left/cathode-right
    { kind: "diode",     x: 912,  y: 476, rot: 0 },   // on L6/L7/L8 shared y=476 lane (x 808..984)
    { kind: "diode",     x: 840,  y: 72,  rot: 0 },   // on FA1 segment y=72 x 752..938
    // Inductor (1)
    { kind: "inductor",  x: 792,  y: 216, rot: 0 },   // on FA2 segment y=216 x 728..840
  ];

  // ── Vias: no electrical junctions in the graph, so render none.
  //    (Spec: remove all isolated dots and floating markers.) ──
  return { traces, vias: [], parts };
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
// Single grid-aligned signal trace from the red button (S1) up to the lamp
// (D1) above the name. Routes through y=740 (well below the text) and up the
// left side, avoiding the headline letters.
const SIGNAL_D =
  `M ${BUTTON_PAD.x} ${BUTTON_PAD.y} V 740 H 700 V 470 H ${LAMP_PIN.x} V ${LAMP_PIN.y}`;
const SIGNAL_DUR_MS = 1150;

function Lamp({ on, scale = 1 }: { on: boolean; scale?: number }) {
  return (
    <g transform={`translate(${LAMP.cx} ${LAMP.cy}) scale(${scale})`}>
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

// Through-hole electrolytic capacitor on the signal path. The two parallel
// plates are stacked vertically (signal trace is vertical here). `stored`
// indicates the cap is holding charge (slow amber pulse). `draining` shows a
// quick discharge flash.
function Capacitor({
  cx,
  cy,
  stored,
  draining,
}: {
  cx: number;
  cy: number;
  stored: boolean;
  draining: boolean;
}) {
  const glow =
    draining
      ? "drop-shadow(0 0 10px rgba(251,191,36,0.95))"
      : stored
      ? "drop-shadow(0 0 6px rgba(251,191,36,0.55))"
      : "none";
  const plateColor = draining
    ? "#fde68a"
    : stored
    ? "#c89832"
    : "#6a6a6a";
  return (
    <g transform={`translate(${cx} ${cy})`} style={{ pointerEvents: "none" }}>
      {/* clear background under the cap so the underlying trace doesn't
          poke through between the plates */}
      <rect x={-11} y={-9} width={22} height={18} fill="#060606" />
      {/* top plate (flat) — positive terminal, fed by CHARGE_FEED */}
      <line
        x1={-9}
        y1={-3}
        x2={9}
        y2={-3}
        stroke={plateColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        style={{ filter: glow, transition: "stroke 200ms ease" }}
      />
      {/* bottom plate (curved) — electrolytic style */}
      <path
        d="M -9 3 Q 0 7 9 3"
        fill="none"
        stroke={plateColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        style={{ filter: glow, transition: "stroke 200ms ease" }}
      />
      {/* polarity marker */}
      <text
        x={-12}
        y={-2}
        fill="#777"
        fontFamily="ui-monospace, monospace"
        fontSize={5}
        textAnchor="end"
      >
        +
      </text>
      {/* silkscreen label */}
      <text
        x={12}
        y={2}
        fill="#666"
        fontFamily="ui-monospace, monospace"
        fontSize={6}
        textAnchor="start"
      >
        C1
      </text>
      {/* stored-charge pulse: small inner glow that breathes while idle */}
      {stored && (
        <circle r={2.4} cx={0} cy={-3} fill="rgba(251,191,36,0.7)">
          <animate
            attributeName="opacity"
            values="0.25;0.9;0.25"
            dur="2.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="1.6;2.8;1.6"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
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
        <SecondaryChip {...CHIP_D} pinsTop={4} pinsBot={4} pinsLeft={0} pinsRight={0} />
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
  const [signaling, setSignaling] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pulseId, setPulseId] = useState(0);
  const [hoverPulseId, setHoverPulseId] = useState(0);
  const [pressed, setPressed] = useState(false);
  const isMobile = useIsMobile();
  // On mobile, focus the viewBox on the meaningful widgets (lamp on the
  // left, portrait + signal button on the right) and switch to `meet` so
  // nothing important gets cropped. Desktop keeps the wide cinematic crop.
  const mobileViewBox = `260 220 1100 560`;
  const viewBox = isMobile ? mobileViewBox : `0 0 ${VB_W} ${VB_H}`;
  const preserve = isMobile ? "xMidYMid meet" : "xMidYMid slice";
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
    // signal travels along SIGNAL_D from button to lamp
    setSignaling(true);
    // lamp lights when signal front reaches it
    timers.current.push(
      window.setTimeout(() => setLampOn(true), SIGNAL_DUR_MS),
    );
    // settle: lamp off
    timers.current.push(
      window.setTimeout(
        () => {
          setLampOn(false);
          setSignaling(false);
        },
        SIGNAL_DUR_MS + 4000,
      ),
    );
  };

  const onButtonEnter = () => {
    if (signaling || lampOn) return;
    setHovering(true);
    setHoverPulseId((n) => n + 1);
  };
  const onButtonLeave = () => setHovering(false);
  return (
    <section
      id="top"
      data-hero
      data-section="00"
      className="relative w-full overflow-hidden"
      style={{ minHeight: isMobile ? "100vh" : "100vh", background: "#060606" }}
    >
      {/* layer 2: circuit SVG */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-[1]"
        style={
          isMobile
            ? { top: "96px", height: "44vh" }
            : { top: 0, bottom: 0 }
        }
      >
        <svg
          viewBox={viewBox}
          preserveAspectRatio={preserve}
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

          {/* Interactive switch → lamp signal path. Drawn ABOVE the text
              mask so it stays fully visible. */}
          <g>
            {/* Base signal trace: button (S1) → lamp (D1) */}
            <path
              d={SIGNAL_D}
              fill="none"
              stroke="#3a3a3a"
              strokeOpacity={0.55}
              strokeWidth={1.4}
              strokeLinecap="square"
              strokeLinejoin="round"
              pathLength={1}
              className="hero-trace-draw"
              style={{ animationDelay: "1.5s" }}
            />

            {/* Progressive signal fill: button → lamp, one continuous line
                that fills via stroke-dashoffset. */}
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

            {/* Vias at every real bend in the signal path */}
            <g className="hero-part-in" style={{ animationDelay: "1.7s" }}>
              <circle cx={BUTTON_PAD.x} cy={740} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={700} cy={740} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={700} cy={470} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
              <circle cx={340} cy={470} r={3.2} fill="#0a0a0a" stroke="#4a4a4a" strokeWidth={0.8} />
            </g>

            {/* Leading dot — travels along SIGNAL with the fill */}
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
            {!signaling && !lampOn && (
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
                className={`hw-assembly${hovering || signaling || lampOn ? " is-hot" : ""}`}
                role="button"
                tabIndex={0}
                aria-label="Click me"
                aria-pressed={lampOn}
                onClick={triggerSignal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerSignal();
                  }
                }}
                onMouseEnter={onButtonEnter}
                onMouseLeave={onButtonLeave}
                onFocus={onButtonEnter}
                onBlur={onButtonLeave}
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
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <style>{`
                  @keyframes hwBoxPulse {
                    0%, 100% {
                      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04),
                                  0 0 0 1px rgba(251,191,36,0.10),
                                  0 0 10px rgba(251,191,36,0.10);
                      border-color: #3a3a3a;
                    }
                    50% {
                      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06),
                                  0 0 0 1px rgba(251,191,36,0.45),
                                  0 0 18px rgba(251,191,36,0.35);
                      border-color: #a07720;
                    }
                  }
                  @keyframes hwCapPulse {
                    0%, 100% {
                      box-shadow: 0 3px 4px rgba(0,0,0,0.55),
                                  0 0 0 1px rgba(251,191,36,0.10),
                                  0 0 10px rgba(251,191,36,0.15),
                                  inset 0 -2px 3px rgba(0,0,0,0.5);
                    }
                    50% {
                      box-shadow: 0 3px 4px rgba(0,0,0,0.55),
                                  0 0 0 1px rgba(251,191,36,0.45),
                                  0 0 16px rgba(251,191,36,0.40),
                                  inset 0 -2px 3px rgba(0,0,0,0.5);
                    }
                  }
                  @keyframes hwBtnBob {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50%      { transform: translateX(-50%) translateY(-5px); }
                  }
                  @keyframes hwSilhouettePulse {
                    0%, 100% { opacity: 0.35; }
                    50%      { opacity: 1; }
                  }
                  @keyframes hwAssemblyBob {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-4px); }
                  }
                  .hw-assembly { animation: hwAssemblyBob 2.0s ease-in-out infinite; }
                  .hw-assembly.is-hot { animation-duration: 1.2s; }
                  .hw-silhouette { animation: hwSilhouettePulse 2.0s ease-in-out infinite; }
                  .hw-silhouette.is-hot { animation-duration: 1.2s; }
                `}</style>

                {/* Unified glowing outline around button + box silhouette */}
                <svg
                  aria-hidden
                  className={`hw-silhouette${hovering || signaling || lampOn ? " is-hot" : ""}`}
                  width="220"
                  height="140"
                  viewBox="0 0 220 140"
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                >
                  <path
                    d="M 84 62 H 136 Q 140 62 140 66 V 77 H 142 V 86 H 174 Q 178 86 178 90 V 118 Q 178 122 174 122 H 46 Q 42 122 42 118 V 90 Q 42 86 46 86 H 78 V 77 H 80 V 66 Q 80 62 84 62 Z"
                    fill="none"
                    stroke={hovering || signaling || lampOn ? "#fbbf24" : "#c89832"}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    style={{
                      filter:
                        "drop-shadow(0 0 4px rgba(251,191,36,0.55)) drop-shadow(0 0 10px rgba(251,191,36,0.35))",
                      transition: "stroke 200ms ease",
                    }}
                  />
                </svg>

                {/* rectangular control housing */}
                <div
                  className={`hw-module${hovering || signaling || lampOn ? " is-hot" : ""}`}
                  style={{
                    width: 132,
                    height: 36,
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
                        lampOn || signaling
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
                    top: 38,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 72,
                    height: 48,
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
                      width: 60,
                      height: 9,
                      borderRadius: "2px 2px 1px 1px",
                      background:
                        "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                      border: "1px solid #2c2c2c",
                      borderBottom: "none",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.6)",
                    }}
                  />
                  <div
                    aria-hidden
                    className={
                      !pressed && !hovering && !signaling && !lampOn ? "hw-cap" : ""
                    }
                    style={{
                      position: "relative",
                      width: 44,
                      height: 13,
                      marginBottom: 6,
                      borderRadius: 3,
                      border: "none",
                      padding: 0,
                      pointerEvents: "none",
                      // darker red base / sides of the cap
                      background:
                        "linear-gradient(180deg, #5a0e0e 0%, #3a0707 60%, #1c0303 100%)",
                      boxShadow: pressed
                        ? "0 1px 0 rgba(0,0,0,0.85), inset 0 2px 3px rgba(0,0,0,0.55)"
                        : hovering
                          ? "0 4px 6px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,191,36,0.55), 0 0 18px rgba(251,191,36,0.45), inset 0 -2px 3px rgba(0,0,0,0.5)"
                          : undefined,
                      transform: hovering && !pressed ? "scale(1.04)" : "scale(1)",
                      transition:
                        "transform 120ms ease, box-shadow 200ms ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* red top surface */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 2,
                        right: 2,
                        top: 2,
                        bottom: 3,
                        borderRadius: 2,
                        background:
                          "linear-gradient(180deg, #ff5a5a 0%, #e02a2a 45%, #a51414 100%)",
                        boxShadow: pressed
                          ? "inset 0 2px 3px rgba(0,0,0,0.5), inset 0 -1px 1px rgba(255,255,255,0.04)"
                          : "inset 0 -2px 3px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.22)",
                        transform: pressed
                          ? "translateY(1.5px)"
                          : "translateY(0)",
                        transition:
                          "transform 100ms ease, box-shadow 200ms ease",
                      }}
                    />
                    {/* horizontal specular highlight */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: 3,
                        left: 6,
                        right: 6,
                        height: 2,
                        borderRadius: 2,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))",
                        opacity: pressed ? 0.2 : 0.55,
                        pointerEvents: "none",
                        transition: "opacity 150ms ease",
                      }}
                    />
                  </div>
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
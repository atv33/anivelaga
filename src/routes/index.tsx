import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useBreakpoint } from "@/hooks/use-mobile";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  thrusterGlbSrc,
  serialGlbSrc,
  serialTestGlbSrc,
} from "@/lib/pcbImages";
import {
  CATEGORIES,
  FPGA_DEMO_URL,
  FPGA_HARDWARE_VIDEO_SRC,
  FPGA_PROJECT_NOTES,
  projectPath,
  type Category,
  type Project,
} from "@/lib/projectData";
import { withBase } from "@/lib/siteBase";

const localImageAssets = import.meta.glob<string>("../assets/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const assetImage = (filename: string) => localImageAssets[`../assets/${filename}`];

const IMAGE_ASSETS = {
  headshot: assetImage("headshot.png"),
  broadcomLogo: assetImage("broadcom-logo.png"),
  cuauvLogo: assetImage("cuauv-logo.png"),
  bytedanceLogo: assetImage("bytedance-logo.png"),
  fpgaMusicPlayerDemo: assetImage("fpga-music-player-demo.png"),
  fpgaMusicPlayerPreview: assetImage("fpga-music-player-preview.jpg"),
  pepperGhostPreview: assetImage("pepper-ghost-preview.png"),
  pepperGhostPrototype: assetImage("pepper-ghost-prototype.jpg"),
  serialLayout: assetImage("serial-layout.png"),
  serialFront: assetImage("serial-front.png"),
  serialBack: assetImage("serial-back.png"),
  serialFabFront: assetImage("thruster-fab-1.png"),
  serialFabBack: assetImage("serial-fab-back.png"),
  thrusterLayout: assetImage("thruster-layout.png"),
  thrusterFront: assetImage("thruster-front.png"),
  thrusterBack: assetImage("thruster-back.png"),
  thrusterFabFront: assetImage("thruster-fab-2.png"),
  thrusterFabBack: assetImage("thruster-fab-back.png"),
};

const PROJECT_PREVIEWS: Record<string, { src?: string; label: string; alt: string }> = {
  "fpga-music-player": {
    src: IMAGE_ASSETS.fpgaMusicPlayerPreview,
    label: "Hardware Preview",
    alt: "DE0-CV FPGA music player hardware preview",
  },
  "peppers-ghost-planetarium-display": {
    src: IMAGE_ASSETS.pepperGhostPrototype,
    label: "Working Prototype",
    alt: "Working Pepper's Ghost planetarium display with floating star map",
  },
};

const localModelSrc = (src?: string) =>
  src && !/^https?:\/\//i.test(src) ? src : undefined;

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

const ABOUT_SKILL_GROUPS = [
  {
    label: "SYSTEMS",
    skills: [
      "Computer Architecture",
      "AI Inference Systems",
      "Network Modeling",
    ],
  },
  {
    label: "HARDWARE",
    skills: [
      "PCB Design",
      "Embedded Systems",
      "FPGA / ASIC Design",
      "Lab Equipment",
    ],
  },
  {
    label: "BUILD + VALIDATE",
    skills: ["Fusion 360", "3D Printing", "CAD", "Soldering", "Firmware Validation"],
  },
  {
    label: "TOOLS",
    skills: [
      "Altium Designer",
      "Verilog",
      "Python",
      "Linux",
      "CUDA",
      "PyTorch",
      "Git",
    ],
  },
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
    note: "PCB design and hardware bring-up for Cornell's autonomous submarine.",
  },
  {
    when: "Jun 2025 — Aug 2025",
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

const EXPERIENCE_LOGOS: Record<string, string | undefined> = {
  Broadcom: IMAGE_ASSETS.broadcomLogo,
  CUAUV: IMAGE_ASSETS.cuauvLogo,
  ByteDance: IMAGE_ASSETS.bytedanceLogo,
};

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
        { name: "About Me", href: "#about" },
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
    id: "CORE", label: "CORE",
    x: 680, y: 150, w: 260, h: 110,
    topX:   [740, 800, 860, 920],
    botX:   [740, 800, 860, 920],
    leftY:  [190, 230],
    rightY: [190, 230],
  },
  {
    id: "CTRL", label: "CTRL",
    x: 160, y: 100, w: 190, h: 90,
    topX:   [220, 280],
    botX:   [220, 280],
    leftY:  [130, 160],
    rightY: [130, 160],
  },
  {
    id: "NET", label: "NET",
    x: 560, y: 400, w: 250, h: 100,
    topX:   [620, 680, 740],
    botX:   [620, 680, 740],
    leftY:  [430, 470],
    rightY: [430, 470],
  },
  {
    id: "IO", label: "I/O",
    x: 1120, y: 200, w: 220, h: 100,
    topX:   [1180, 1240],
    botX:   [1180, 1240],
    leftY:  [230, 270],
    rightY: [230, 270],
  },
  {
    id: "DRV", label: "DRV",
    x: 1040, y: 520, w: 260, h: 110,
    topX:   [1100, 1160, 1220],
    botX:   [1100, 1160, 1220],
    leftY:  [560, 600],
    rightY: [560, 600],
  },
];

const EDGE_L = { x: 70, y: 100, w: 40, h: 90, pinsY: [130, 160] };
const EDGE_R = { x: 1430, y: 330, w: 48, h: 270, pinsY: [340, 360, 380, 400, 420, 440, 500, 540, 580] };
const HEADER_T = { x: 760, y: 86, w: 220, h: 34, pinsX: [800, 850, 900, 950] };

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
type Built = { traces: Trace[] };

function ptsToD(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

const detailTrace = (id: string, pts: Pt[], w = 0.8, o = 0.34): Trace => ({
  id,
  d: ptsToD(pts),
  w,
  o,
});

const DETAIL_ICS: ModuleSpec[] = [
  {
    id: "AUX_A", label: "AUX",
    x: 1140, y: 86, w: 130, h: 72,
    topX: [1180, 1220],
    botX: [1180, 1220],
    leftY: [110, 130, 150],
    rightY: [110, 130, 150],
  },
  {
    id: "AUX_B", label: "AUX",
    x: 840, y: 640, w: 120, h: 64,
    topX: [880, 920],
    botX: [880, 920],
    leftY: [660, 680],
    rightY: [660, 680],
  },
  {
    id: "AUX_C", label: "AUX",
    x: 430, y: 80, w: 110, h: 70,
    topX: [470, 510],
    botX: [470, 510],
    leftY: [105, 125],
    rightY: [105, 125, 145],
  },
];

const DETAIL_TRACES: Trace[] = [
  detailTrace("PWR_RAIL", [{ x: 520, y: 80 }, { x: 1220, y: 80 }, { x: 1220, y: 86 }], 1.05, 0.42),
  detailTrace("PWR_AUX_A", [{ x: 1180, y: 80 }, { x: 1180, y: 86 }], 0.8, 0.36),
  detailTrace("PWR_AUX_C", [{ x: 510, y: 80 }, { x: 520, y: 80 }], 0.8, 0.34),
  detailTrace("AUX_A_BUS_0", [{ x: 1270, y: 110 }, { x: 1350, y: 110 }, { x: 1350, y: 340 }, { x: 1424, y: 340 }], 0.85, 0.44),
  detailTrace("AUX_A_BUS_1", [{ x: 1270, y: 130 }, { x: 1360, y: 130 }, { x: 1360, y: 360 }, { x: 1424, y: 360 }], 0.85, 0.43),
  detailTrace("AUX_A_BUS_2", [{ x: 1270, y: 150 }, { x: 1370, y: 150 }, { x: 1370, y: 380 }, { x: 1424, y: 380 }], 0.85, 0.42),
  detailTrace("AUX_A_BUS_3", [{ x: 1220, y: 158 }, { x: 1220, y: 180 }, { x: 1380, y: 180 }, { x: 1380, y: 400 }, { x: 1424, y: 400 }], 0.8, 0.38),
  detailTrace("AUX_A_BUS_4", [{ x: 1180, y: 158 }, { x: 1180, y: 170 }, { x: 1390, y: 170 }, { x: 1390, y: 420 }, { x: 1424, y: 420 }], 0.8, 0.36),
  detailTrace("AUX_A_CAP", [{ x: 1140, y: 130 }, { x: 1100, y: 130 }], 0.75, 0.36),
  detailTrace("AUX_C_CTRL", [{ x: 430, y: 125 }, { x: 380, y: 125 }, { x: 380, y: 130 }, { x: 350, y: 130 }], 0.8, 0.34),
  detailTrace("AUX_C_CORE", [{ x: 540, y: 125 }, { x: 620, y: 125 }, { x: 620, y: 190 }, { x: 680, y: 190 }], 0.8, 0.36),
  detailTrace("AUX_B_DRV", [{ x: 960, y: 660 }, { x: 1000, y: 660 }, { x: 1000, y: 600 }, { x: 1040, y: 600 }], 0.85, 0.4),
  detailTrace("AUX_B_NET", [{ x: 840, y: 660 }, { x: 780, y: 660 }, { x: 780, y: 500 }, { x: 740, y: 500 }], 0.8, 0.36),
  detailTrace("AUX_B_TP_1", [{ x: 880, y: 704 }, { x: 880, y: 740 }, { x: 940, y: 740 }], 0.75, 0.34),
  detailTrace("AUX_B_TP_2", [{ x: 920, y: 704 }, { x: 920, y: 720 }, { x: 1000, y: 720 }], 0.75, 0.34),
  detailTrace("CORE_TP_1", [{ x: 740, y: 260 }, { x: 740, y: 320 }, { x: 700, y: 320 }], 0.75, 0.32),
  detailTrace("CORE_TP_2", [{ x: 860, y: 260 }, { x: 860, y: 320 }, { x: 900, y: 320 }], 0.75, 0.32),
  detailTrace("IO_TP_1", [{ x: 1180, y: 200 }, { x: 1180, y: 180 }, { x: 1120, y: 180 }], 0.75, 0.32),
  detailTrace("IO_TP_2", [{ x: 1340, y: 270 }, { x: 1410, y: 270 }, { x: 1410, y: 300 }], 0.75, 0.32),
  detailTrace("NET_TP_1", [{ x: 560, y: 470 }, { x: 500, y: 470 }, { x: 500, y: 520 }], 0.75, 0.32),
  detailTrace("DRV_TP_1", [{ x: 1100, y: 630 }, { x: 1100, y: 670 }, { x: 1040, y: 670 }], 0.75, 0.32),
  detailTrace("NET_CAP", [{ x: 620, y: 400 }, { x: 620, y: 360 }, { x: 600, y: 360 }], 0.75, 0.32),
  detailTrace("HEADER_AUX_1", [{ x: 950, y: 120 }, { x: 950, y: 100 }, { x: 1040, y: 100 }, { x: 1040, y: 130 }, { x: 1100, y: 130 }], 0.72, 0.3),
  detailTrace("CORE_RIGHT_TP", [{ x: 1040, y: 230 }, { x: 1080, y: 230 }, { x: 1080, y: 310 }], 0.72, 0.3),
  detailTrace("IO_EDGE_C", [{ x: 1240, y: 300 }, { x: 1240, y: 320 }, { x: 1320, y: 320 }, { x: 1320, y: 440 }, { x: 1424, y: 440 }], 0.78, 0.36),
  detailTrace("DRV_EDGE_C", [{ x: 1300, y: 600 }, { x: 1340, y: 600 }, { x: 1340, y: 500 }, { x: 1424, y: 500 }], 0.78, 0.34),
  detailTrace("NET_BOTTOM_TP", [{ x: 680, y: 500 }, { x: 680, y: 560 }, { x: 760, y: 560 }], 0.72, 0.28),
  detailTrace("LEFT_TEST_SPUR", [{ x: 116, y: 180 }, { x: 130, y: 180 }, { x: 130, y: 220 }], 0.72, 0.3),
  detailTrace("AUX_C_HEADER", [{ x: 510, y: 80 }, { x: 510, y: 60 }, { x: 800, y: 60 }, { x: 800, y: 86 }], 0.72, 0.28),
  detailTrace("GND_UPPER_FANOUT_STUB", [{ x: 1100, y: 130 }, { x: 1100, y: 144 }], 0.7, 0.34),
  detailTrace("GND_RIGHT_EDGE_STUB", [{ x: 1340, y: 500 }, { x: 1340, y: 514 }], 0.7, 0.34),
  detailTrace("GND_LOWER_MID_STUB", [{ x: 760, y: 560 }, { x: 760, y: 574 }], 0.7, 0.32),
  detailTrace("GND_LEFT_STUB_DROP", [{ x: 130, y: 220 }, { x: 130, y: 234 }], 0.7, 0.32),
  detailTrace("CTRL_TOP_TP", [{ x: 220, y: 100 }, { x: 220, y: 80 }, { x: 360, y: 80 }], 0.72, 0.32),
  detailTrace("CORE_RETURN_TP", [{ x: 920, y: 260 }, { x: 920, y: 300 }, { x: 980, y: 300 }, { x: 980, y: 360 }], 0.72, 0.32),
  detailTrace("NET_LEFT_TP_2", [{ x: 560, y: 430 }, { x: 480, y: 430 }, { x: 480, y: 400 }], 0.72, 0.3),
  detailTrace("AUX_A_LEFT_TP", [{ x: 1140, y: 110 }, { x: 1080, y: 110 }, { x: 1080, y: 100 }], 0.72, 0.32),
  detailTrace("RIGHT_BUS_SENSE", [{ x: 1360, y: 360 }, { x: 1320, y: 360 }, { x: 1320, y: 340 }], 0.72, 0.32),
  detailTrace("DRV_BOTTOM_TP", [{ x: 1100, y: 630 }, { x: 1100, y: 690 }, { x: 1040, y: 690 }], 0.72, 0.3),
  detailTrace("AUX_B_LEFT_TP", [{ x: 840, y: 680 }, { x: 800, y: 680 }, { x: 800, y: 620 }, { x: 760, y: 620 }], 0.72, 0.3),
  detailTrace("EDGE_LOW_BRANCH", [{ x: 1424, y: 580 }, { x: 1360, y: 580 }, { x: 1360, y: 620 }, { x: 1320, y: 620 }], 0.72, 0.32),
];

const DETAIL_VIAS: Pt[] = [
  { x: 520, y: 80 },
  { x: 1180, y: 80 },
  { x: 1220, y: 80 },
  { x: 1350, y: 340 },
  { x: 1360, y: 360 },
  { x: 1370, y: 380 },
  { x: 1380, y: 400 },
  { x: 1390, y: 420 },
  { x: 1100, y: 130 },
  { x: 700, y: 320 },
  { x: 900, y: 320 },
  { x: 1120, y: 180 },
  { x: 1410, y: 300 },
  { x: 500, y: 520 },
  { x: 1040, y: 670 },
  { x: 940, y: 740 },
  { x: 1000, y: 720 },
  { x: 600, y: 360 },
  { x: 1040, y: 100 },
  { x: 1080, y: 310 },
  { x: 1320, y: 320 },
  { x: 1340, y: 500 },
  { x: 760, y: 560 },
  { x: 130, y: 220 },
  { x: 800, y: 60 },
  { x: 360, y: 80 },
  { x: 980, y: 360 },
  { x: 480, y: 400 },
  { x: 1080, y: 100 },
  { x: 1320, y: 340 },
  { x: 1040, y: 690 },
  { x: 760, y: 620 },
  { x: 1320, y: 620 },
];

type PcbPart = {
  id: string;
  kind: "resistor" | "capacitor" | "diode" | "inductor";
  x: number;
  y: number;
  rot?: 0 | 90;
};

const PCB_PARTS: PcbPart[] = [
  { id: "R1", kind: "resistor", x: 970, y: 190 },
  { id: "R2", kind: "resistor", x: 990, y: 230 },
  { id: "R3", kind: "resistor", x: 680, y: 340 },
  { id: "R4", kind: "resistor", x: 720, y: 360 },
  { id: "R5", kind: "resistor", x: 870, y: 430 },
  { id: "R6", kind: "resistor", x: 890, y: 470 },
  { id: "R7", kind: "resistor", x: 1328, y: 560 },
  { id: "R8", kind: "resistor", x: 1350, y: 600 },
  { id: "C1", kind: "capacitor", x: 650, y: 190 },
  { id: "C2", kind: "capacitor", x: 1122, y: 130 },
  { id: "C3", kind: "capacitor", x: 620, y: 380, rot: 90 },
  { id: "C4", kind: "capacitor", x: 1320, y: 600 },
  { id: "D1", kind: "diode", x: 1080, y: 270 },
  { id: "D2", kind: "diode", x: 1010, y: 560 },
  { id: "L1", kind: "inductor", x: 650, y: 80 },
];

type SilkLabel = { text: string; x: number; y: number; size?: number; anchor?: "start" | "middle" | "end"; opacity?: number };
type GroundSymbol = { id: string; x: number; y: number; opacity?: number; scale?: number };

const SILK_LABELS: SilkLabel[] = [
  { text: "J1", x: 70, y: 112, size: 12, opacity: 0.34 },
  { text: "U2", x: 350, y: 96, size: 12, anchor: "end", opacity: 0.34 },
  { text: "U8", x: 546, y: 74, size: 11, opacity: 0.3 },
  { text: "J3", x: 760, y: 78, size: 12, opacity: 0.34 },
  { text: "U1", x: 946, y: 145, size: 12, opacity: 0.34 },
  { text: "U6", x: 1278, y: 80, size: 11, opacity: 0.3 },
  { text: "U4", x: 1348, y: 190, size: 12, opacity: 0.32 },
  { text: "J2", x: 1486, y: 322, size: 12, opacity: 0.34 },
  { text: "U3", x: 816, y: 392, size: 12, opacity: 0.32 },
  { text: "U5", x: 1306, y: 512, size: 12, opacity: 0.32 },
  { text: "U7", x: 964, y: 636, size: 11, opacity: 0.3 },
  { text: "S1", x: 1160, y: 682, size: 11, opacity: 0.3 },
  { text: "D1", x: 300, y: 216, size: 11, opacity: 0.3 },
  { text: "TP", x: 690, y: 314, size: 9, opacity: 0.22 },
  { text: "TP", x: 890, y: 314, size: 9, opacity: 0.22 },
];

const GROUND_SYMBOLS: GroundSymbol[] = [
  { id: "GND_UPPER_FANOUT", x: 1100, y: 144, opacity: 0.38 },
  { id: "GND_RIGHT_EDGE", x: 1340, y: 514, opacity: 0.4 },
  { id: "GND_LOWER_MID", x: 760, y: 574, opacity: 0.36 },
  { id: "GND_LEFT_STUB", x: 130, y: 234, opacity: 0.34 },
];

// Curated grid-routed traces. Main lanes sit at y=130, 340, 360, 430,
// 470, 560, and 600. Vertical trunks sit at x=520, 860, 980, 1000,
// 1040, 1360, 1380, and 1400.
function buildCircuit(): Built {
  const traces: Trace[] = [];
  const add = (id: string, pts: Pt[], w: number, o: number, pulse?: number) =>
    traces.push({ id, d: ptsToD(pts), w, o, pulse });

  const core = moduleById("CORE");
  const ctrl = moduleById("CTRL");
  const net = moduleById("NET");
  const io = moduleById("IO");
  const drv = moduleById("DRV");
  const leftPinX = EDGE_L.x + EDGE_L.w + 6;
  const rightPinX = EDGE_R.x - 6;
  const topPinY = HEADER_T.y + HEADER_T.h;

  // Left connector into controller.
  add("L_CTRL_A", [{ x: leftPinX, y: 130 }, { x: ctrl.x, y: 130 }], 1.1, 0.48);
  add("L_CTRL_B", [{ x: leftPinX, y: 160 }, { x: ctrl.x, y: 160 }], 1.1, 0.44);

  // Controller into core and network, using a shared vertical trunk.
  add("CTRL_CORE_A", [{ x: ctrl.x + ctrl.w, y: 130 }, { x: 520, y: 130 }, { x: 520, y: 190 }, { x: core.x, y: 190 }], 1.35, 0.66, 5200);
  add("CTRL_CORE_B", [{ x: ctrl.x + ctrl.w, y: 160 }, { x: 540, y: 160 }, { x: 540, y: 230 }, { x: core.x, y: 230 }], 1.05, 0.52);
  add("CTRL_NET_A", [{ x: 220, y: ctrl.y + ctrl.h }, { x: 220, y: 300 }, { x: 520, y: 300 }, { x: 520, y: 430 }, { x: net.x, y: 430 }], 1.0, 0.5);
  add("CTRL_NET_B", [{ x: 280, y: ctrl.y + ctrl.h }, { x: 280, y: 360 }, { x: 540, y: 360 }, { x: 540, y: 470 }, { x: net.x, y: 470 }], 0.95, 0.42);

  // Top connector into the core.
  add("TOP_CORE_A", [{ x: 800, y: topPinY }, { x: 800, y: 134 }, { x: 740, y: 134 }, { x: 740, y: core.y }], 0.95, 0.42);
  add("TOP_CORE_B", [{ x: 850, y: topPinY }, { x: 850, y: 128 }, { x: 800, y: 128 }, { x: 800, y: core.y }], 0.95, 0.45);
  add("TOP_CORE_C", [{ x: 900, y: topPinY }, { x: 900, y: 128 }, { x: 860, y: 128 }, { x: 860, y: core.y }], 0.95, 0.45);
  add("TOP_CORE_D", [{ x: 950, y: topPinY }, { x: 950, y: 134 }, { x: 920, y: 134 }, { x: 920, y: core.y }], 0.95, 0.42);

  // Core into I/O and network.
  add("CORE_IO_A", [{ x: core.x + core.w, y: 190 }, { x: 1000, y: 190 }, { x: 1000, y: 230 }, { x: io.x, y: 230 }], 1.3, 0.62, 5600);
  add("CORE_IO_B", [{ x: core.x + core.w, y: 230 }, { x: 1040, y: 230 }, { x: 1040, y: 270 }, { x: io.x, y: 270 }], 1.0, 0.5);
  add("CORE_NET_A", [{ x: 740, y: core.y + core.h }, { x: 740, y: 340 }, { x: 620, y: 340 }, { x: 620, y: net.y }], 1.05, 0.52);
  add("CORE_NET_B", [{ x: 800, y: core.y + core.h }, { x: 800, y: 360 }, { x: 680, y: 360 }, { x: 680, y: net.y }], 1.05, 0.48);
  add("CORE_NET_C", [{ x: 860, y: core.y + core.h }, { x: 860, y: 380 }, { x: 740, y: 380 }, { x: 740, y: net.y }], 0.95, 0.44);

  // Network and core into driver.
  add("CORE_DRV_A", [{ x: 920, y: core.y + core.h }, { x: 920, y: 360 }, { x: 980, y: 360 }, { x: 980, y: 560 }, { x: drv.x, y: 560 }], 1.05, 0.46, 6400);
  add("NET_DRV_A", [{ x: net.x + net.w, y: 430 }, { x: 920, y: 430 }, { x: 920, y: 560 }, { x: drv.x, y: 560 }], 1.35, 0.64, 5000);
  add("NET_DRV_B", [{ x: net.x + net.w, y: 470 }, { x: 960, y: 470 }, { x: 960, y: 600 }, { x: drv.x, y: 600 }], 1.0, 0.52);

  // I/O and driver out to the right connector.
  add("IO_EDGE_A", [{ x: io.x + io.w, y: 230 }, { x: 1380, y: 230 }, { x: 1380, y: 360 }, { x: rightPinX, y: 360 }], 1.2, 0.58, 6000);
  add("IO_EDGE_B", [{ x: io.x + io.w, y: 270 }, { x: 1400, y: 270 }, { x: 1400, y: 400 }, { x: rightPinX, y: 400 }], 1.0, 0.5);
  add("DRV_EDGE_A", [{ x: drv.x + drv.w, y: 560 }, { x: 1360, y: 560 }, { x: 1360, y: 540 }, { x: rightPinX, y: 540 }], 1.2, 0.58);
  add("DRV_EDGE_B", [{ x: drv.x + drv.w, y: 600 }, { x: 1390, y: 600 }, { x: 1390, y: 580 }, { x: rightPinX, y: 580 }], 1.0, 0.48);

  // I/O into driver through two clean vertical drops.
  add("IO_DRV_A", [{ x: 1180, y: io.y + io.h }, { x: 1180, y: 420 }, { x: 1100, y: 420 }, { x: 1100, y: drv.y }], 1.05, 0.5);
  add("IO_DRV_B", [{ x: 1240, y: io.y + io.h }, { x: 1240, y: 440 }, { x: 1220, y: 440 }, { x: 1220, y: drv.y }], 0.95, 0.44);

  return { traces };
}

// ── Module body renderer (CpuArchitecture-inspired) ─────────
function CircuitModule({ m, delay = 0 }: { m: ModuleSpec; delay?: number }) {
  const { pads } = modulePads(m);
  return (
    <g className="hero-part-in" data-module-id={m.id} style={{ animationDelay: `${delay}s` }}>
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
      <g opacity={0.55}>
        <rect
          x={m.x + m.w / 2 - 22}
          y={m.y + m.h / 2 - 16}
          width={44}
          height={32}
          fill="#151515"
          stroke="#2f2f2f"
          strokeWidth={0.6}
          rx={2}
        />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={m.x + m.w / 2 - 16 + col * 10}
              y={m.y + m.h / 2 - 10 + row * 8}
              width={5}
              height={3}
              fill="#292929"
            />
          )),
        )}
      </g>
      {/* pads */}
      <g fill="#262626" stroke="#4a4a4a" strokeWidth={0.6}>
        {pads.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={1} />
        ))}
      </g>
    </g>
  );
}

function SmallIcModule({ m, delay = 0 }: { m: ModuleSpec; delay?: number }) {
  const { pads } = modulePads(m);
  return (
    <g className="hero-part-in" data-module-id={m.id} style={{ animationDelay: `${delay}s` }}>
      <rect x={m.x + 1} y={m.y + 1.5} width={m.w} height={m.h} fill="#000" opacity={0.48} rx={3} />
      <rect x={m.x} y={m.y} width={m.w} height={m.h} fill="#0c0c0c" stroke="#343434" strokeWidth={0.9} rx={3} />
      <rect x={m.x + 4} y={m.y + 4} width={m.w - 8} height={m.h - 8} fill="none" stroke="#202020" strokeWidth={0.7} rx={2} />
      <circle cx={m.x + 9} cy={m.y + 9} r={2} fill="#242424" stroke="#464646" strokeWidth={0.5} />
      <g opacity={0.38}>
        {[0, 1].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${m.id}-${row}-${col}`}
              x={m.x + m.w / 2 - 14 + col * 10}
              y={m.y + m.h / 2 - 7 + row * 9}
              width={5}
              height={3}
              fill="#292929"
            />
          )),
        )}
      </g>
      <g fill="#262626" stroke="#4a4a4a" strokeWidth={0.55}>
        {pads.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={1} />
        ))}
      </g>
    </g>
  );
}

function PcbPartFootprint({ part }: { part: PcbPart }) {
  const rotation = part.rot ?? 0;
  const common = {
    stroke: "#4a4a4a",
    strokeWidth: 0.7,
  };

  return (
    <g transform={`translate(${part.x} ${part.y}) rotate(${rotation})`} data-part-id={part.id}>
      {part.kind === "resistor" ? (
        <>
          <line x1={-19} y1={0} x2={-12} y2={0} {...common} />
          <line x1={12} y1={0} x2={19} y2={0} {...common} />
          <rect x={-12} y={-4.5} width={24} height={9} rx={2} fill="#151515" stroke="#4a4a4a" strokeWidth={0.75} />
          <rect x={-3} y={-3} width={6} height={6} rx={1} fill="#262626" opacity={0.9} />
        </>
      ) : part.kind === "capacitor" ? (
        <>
          <line x1={-17} y1={0} x2={-8} y2={0} {...common} />
          <line x1={8} y1={0} x2={17} y2={0} {...common} />
          <rect x={-8} y={-5} width={6} height={10} rx={1} fill="#202020" stroke="#545454" strokeWidth={0.7} />
          <rect x={2} y={-5} width={6} height={10} rx={1} fill="#202020" stroke="#545454" strokeWidth={0.7} />
        </>
      ) : part.kind === "diode" ? (
        <>
          <line x1={-19} y1={0} x2={-10} y2={0} {...common} />
          <line x1={11} y1={0} x2={19} y2={0} {...common} />
          <polygon points="-10,-6 -10,6 3,0" fill="#161616" stroke="#5a5a5a" strokeWidth={0.75} />
          <line x1={7} y1={-6.5} x2={7} y2={6.5} stroke="#5a5a5a" strokeWidth={1.1} />
        </>
      ) : (
        <>
          <line x1={-25} y1={0} x2={-18} y2={0} {...common} />
          <line x1={18} y1={0} x2={25} y2={0} {...common} />
          <rect x={-18} y={-7} width={36} height={14} rx={3} fill="#151515" stroke="#4a4a4a" strokeWidth={0.75} />
          {[-9, 0, 9].map((x) => (
            <rect key={x} x={x - 1.5} y={-5} width={3} height={10} rx={1} fill="#2f2f2f" />
          ))}
        </>
      )}
    </g>
  );
}

function GroundSymbolGlyph({ x, y, opacity = 0.26, scale = 1 }: GroundSymbol) {
  return (
    <g
      data-ground-symbol
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke="#828282"
      strokeWidth={0.78}
      strokeLinecap="square"
      opacity={opacity}
      style={{ pointerEvents: "none" }}
    >
      <line x1={0} y1={0} x2={0} y2={7} />
      <line x1={-7} y1={7} x2={7} y2={7} />
      <line x1={-5} y1={10.5} x2={5} y2={10.5} />
      <line x1={-2.5} y1={14} x2={2.5} y2={14} />
    </g>
  );
}

function PcbDetailLayer() {
  return (
    <g className="hero-detail-layer" style={{ pointerEvents: "none" }}>
      <g fill="none" strokeLinecap="square" strokeLinejoin="round">
        {DETAIL_TRACES.map((t, i) => (
          <path
            key={t.id}
            d={t.d}
            pathLength={1}
            stroke={t.w >= 1 ? "#494949" : "#363636"}
            strokeOpacity={t.o}
            strokeWidth={t.w}
            className="hero-trace-draw"
            style={{ animationDelay: `${0.45 + i * 0.025}s` }}
          />
        ))}
      </g>
      <g fill="#090909" stroke="#4a4a4a" strokeWidth={0.75}>
        {DETAIL_VIAS.map((v, i) => (
          <g key={`${v.x}-${v.y}-${i}`} data-via-pad>
            <circle cx={v.x} cy={v.y} r={6} opacity={0.75} />
            <circle cx={v.x} cy={v.y} r={2.3} fill="#141414" stroke="#5a5a5a" strokeWidth={0.55} />
          </g>
        ))}
      </g>
      <g className="hero-part-in" style={{ animationDelay: "0.9s" }}>
        {GROUND_SYMBOLS.map((symbol) => (
          <GroundSymbolGlyph key={symbol.id} {...symbol} />
        ))}
      </g>
      <g className="hero-part-in" style={{ animationDelay: "0.85s" }}>
        {PCB_PARTS.map((part) => (
          <PcbPartFootprint key={part.id} part={part} />
        ))}
      </g>
      {DETAIL_ICS.map((m, i) => (
        <SmallIcModule key={m.id} m={m} delay={0.55 + i * 0.08} />
      ))}
    </g>
  );
}

function SilkLabelLayer() {
  return (
    <g
      data-silkscreen-labels
      fontFamily="JetBrains Mono, ui-monospace, monospace"
      fill="#777"
      letterSpacing="0.16em"
      style={{ pointerEvents: "none" }}
    >
      {SILK_LABELS.map((label) => (
        <text
          key={`${label.text}-${label.x}-${label.y}`}
          x={label.x}
          y={label.y}
          textAnchor={label.anchor ?? "start"}
          fontSize={label.size ?? 11}
          opacity={label.opacity ?? 0.28}
        >
          {label.text}
        </text>
      ))}
    </g>
  );
}

function EdgeConnectors() {
  return (
    <g className="hero-part-in" style={{ animationDelay: "0.4s" }} fill="#0e0e0e" stroke="#3a3a3a" strokeWidth={1}>
      <rect x={EDGE_L.x} y={EDGE_L.y} width={EDGE_L.w} height={EDGE_L.h} rx={2} />
      {EDGE_L.pinsY.map((py, i) => (
        <rect key={i} x={EDGE_L.x + EDGE_L.w} y={py - 4} width={6} height={8} fill="#262626" stroke="#4a4a4a" strokeWidth={0.5} />
      ))}
      <rect x={EDGE_R.x} y={EDGE_R.y} width={EDGE_R.w} height={EDGE_R.h} rx={2} />
      {EDGE_R.pinsY.map((py, i) => (
        <rect key={i} x={EDGE_R.x - 6} y={py - 4} width={6} height={8} fill="#262626" stroke="#4a4a4a" strokeWidth={0.5} />
      ))}
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

// ── Lamp positioned in a dedicated keep-out area above the headline. ──
const LAMP = { cx: 320, cy: 245, w: 84, h: 44 };
type LampSpec = typeof LAMP;

function StatusLamp({ lamp, on }: { lamp: LampSpec; on: boolean }) {
  const padY = -lamp.h / 2 - 12;
  const padCenterY = padY + 3;
  const housingX = -lamp.w / 2;
  const housingY = -lamp.h / 2;
  return (
    <g transform={`translate(${lamp.cx} ${lamp.cy})`} data-lamp-state={on ? "on" : "off"}>
      {on && (
        <g data-lamp-glow style={{ pointerEvents: "none" }}>
          <path d="M 0 0 C -42 64 -78 126 -104 178 H 104 C 78 126 42 64 0 0 Z" fill="url(#lampCone)" opacity={0.32} />
          <ellipse cx={0} cy={104} rx={126} ry={82} fill="url(#lampHalo)" opacity={0.34} />
        </g>
      )}
      <rect x={-28} y={padY} width={12} height={6} rx={1} fill="#242424" stroke="#4a4a4a" strokeWidth={0.65} />
      <rect x={16} y={padY} width={12} height={6} rx={1} fill="#242424" stroke="#4a4a4a" strokeWidth={0.65} />
      <line x1={-22} y1={padCenterY + 3} x2={-22} y2={housingY} stroke="#3d3d3d" strokeWidth={0.95} />
      <line x1={22} y1={padCenterY + 3} x2={22} y2={housingY} stroke="#3d3d3d" strokeWidth={0.95} />
      <rect
        data-lamp-housing
        x={housingX}
        y={housingY}
        width={lamp.w}
        height={lamp.h}
        rx={7}
        fill="#0d0d0d"
        stroke={on ? "#b88a32" : "#4a4a4a"}
        strokeWidth={on ? 1.35 : 1.15}
        style={{
          filter: on ? "drop-shadow(0 0 5px rgba(251,191,36,0.34))" : "none",
          transition: "stroke 250ms ease, stroke-width 250ms ease, filter 250ms ease",
        }}
      />
      <rect x={housingX + 6} y={housingY + 6} width={lamp.w - 12} height={lamp.h - 12} rx={4} fill="none" stroke={on ? "#4c3f1c" : "#242424"} strokeWidth={0.75} />
      {on && (
        <g data-lamp-lens-glow style={{ pointerEvents: "none" }}>
          <circle r={23} fill="#fbbf24" opacity={0.18} />
          <circle r={16} fill="#fbbf24" opacity={0.32} />
        </g>
      )}
      <circle r={16.5} fill="#100f0d" stroke={on ? "#5d4818" : "#29251a"} strokeWidth={1} />
      <circle
        data-lamp-lens
        r={13.5}
        fill={on ? "#fbbf24" : "#1f1a14"}
        stroke={on ? "#fde68a" : "#7a6a3a"}
        strokeWidth={1.35}
        style={{
          filter: on ? "drop-shadow(0 0 4px rgba(251,191,36,0.58))" : "none",
          transition: "fill 250ms ease, stroke 250ms ease, filter 250ms ease",
        }}
      />
      {on && <circle r={6.5} fill="#fff7c2" opacity={0.46} style={{ pointerEvents: "none" }} />}
    </g>
  );
}

// ── Signal path: top switch terminal → clean upper route → lamp. ──
const BUTTON_PAD = { x: 1230, y: 760 };
const SIGNAL_DUR_MS = 1300;

const SWITCH_GEOMETRY = {
  anchor: { x: 62, y: 132 },
  signalTerminal: { x: 62, y1: 36, y2: 45, padX: 56, padY: 28, padW: 12, padH: 8 },
  ground: { x: 100, y1: 120, y2: 132 },
  housing: { x: -4, y: 70, w: 132, h: 50, rx: 4 },
  panel: { x: 5, y: 78, w: 114, h: 32, rx: 2 },
  mount: { x: 30, y: 45, w: 64, h: 25, rx: 4 },
  slot: { x: 37, y: 51, w: 50, h: 10, rx: 2 },
  actuator: { x: 41, idleY: 51, hoverY: 47, pressedY: 56, raisedY: 46, w: 42, h: 14, rx: 2 },
  hit: { x: -8, y: 40, w: 140, h: 124 },
};

function switchFootprintPath(pad = 0): string {
  const h = SWITCH_GEOMETRY.housing;
  const m = SWITCH_GEOMETRY.mount;
  const xL = h.x - pad;
  const xR = h.x + h.w + pad;
  const yTop = h.y - pad;
  const yBot = h.y + h.h + pad;
  const tabL = m.x - pad;
  const tabR = m.x + m.w + pad;
  const tabTop = m.y - pad;
  const rH = Math.min(8, h.rx + pad * 0.45);
  const rT = Math.min(7, m.rx + pad * 0.45);

  return [
    `M ${tabL + rT} ${tabTop}`,
    `H ${tabR - rT}`,
    `Q ${tabR} ${tabTop} ${tabR} ${tabTop + rT}`,
    `V ${yTop}`,
    `H ${xR - rH}`,
    `Q ${xR} ${yTop} ${xR} ${yTop + rH}`,
    `V ${yBot - rH}`,
    `Q ${xR} ${yBot} ${xR - rH} ${yBot}`,
    `H ${xL + rH}`,
    `Q ${xL} ${yBot} ${xL} ${yBot - rH}`,
    `V ${yTop + rH}`,
    `Q ${xL} ${yTop} ${xL + rH} ${yTop}`,
    `H ${tabL}`,
    `V ${tabTop + rT}`,
    `Q ${tabL} ${tabTop} ${tabL + rT} ${tabTop}`,
    "Z",
  ].join(" ");
}

function SwitchModule({
  pad,
  hovering,
  pressed,
  signaling,
  lampOn,
  onTrigger,
  onHoverChange,
}: {
  pad: Pt;
  hovering: boolean;
  pressed: boolean;
  signaling: boolean;
  lampOn: boolean;
  onTrigger: () => void;
  onHoverChange: (hovering: boolean) => void;
}) {
  const active = signaling || lampOn;
  const calm = !hovering && !pressed && !active;
  const showPulse = !pressed && (hovering || active);
  const footprintPath = switchFootprintPath();
  const actuatorY = pressed
    ? SWITCH_GEOMETRY.actuator.pressedY
    : hovering
      ? SWITCH_GEOMETRY.actuator.hoverY
      : SWITCH_GEOMETRY.actuator.idleY;

  return (
    <g className="hero-part-in" style={{ animationDelay: "1.8s", pointerEvents: "all" }}>
      <g
        transform={`translate(${pad.x - SWITCH_GEOMETRY.anchor.x} ${pad.y - SWITCH_GEOMETRY.anchor.y})`}
        data-switch-module
        style={{ pointerEvents: "all" }}
      >
        <defs>
          <linearGradient id="switchInnerWarm" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0b85a" stopOpacity="0.18" />
            <stop offset="52%" stopColor="#b88d32" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#6d4b18" stopOpacity="0.04" />
          </linearGradient>
          <filter
            id="switchGoldGlow"
            x="-35%"
            y="-35%"
            width="170%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
            <feFlood floodColor="#c3a047" floodOpacity="0.56" result="gold" />
            <feComposite in="gold" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="switchActiveGlow"
            x="-45%"
            y="-45%"
            width="190%"
            height="190%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.4" result="blur" />
            <feFlood floodColor="#d0a546" floodOpacity="0.42" result="gold" />
            <feComposite in="gold" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line x1={SWITCH_GEOMETRY.signalTerminal.x} y1={SWITCH_GEOMETRY.signalTerminal.y1} x2={SWITCH_GEOMETRY.signalTerminal.x} y2={SWITCH_GEOMETRY.signalTerminal.y2} stroke={active ? "#75622f" : "#3a3a3a"} strokeWidth={1.1} />
        <rect
          x={SWITCH_GEOMETRY.signalTerminal.padX}
          y={SWITCH_GEOMETRY.signalTerminal.padY}
          width={SWITCH_GEOMETRY.signalTerminal.padW}
          height={SWITCH_GEOMETRY.signalTerminal.padH}
          rx={1}
          fill={active ? "#2a2212" : "#222"}
          stroke={active ? "#9f8130" : "#4a4a4a"}
          strokeWidth={0.65}
        />
        <line x1={SWITCH_GEOMETRY.ground.x} y1={SWITCH_GEOMETRY.ground.y1} x2={SWITCH_GEOMETRY.ground.x} y2={SWITCH_GEOMETRY.ground.y2} stroke="#5a5a5a" strokeWidth={0.7} opacity={0.52} />
        <GroundSymbolGlyph id="GND_SWITCH" x={SWITCH_GEOMETRY.ground.x} y={SWITCH_GEOMETRY.ground.y2} opacity={0.36} scale={0.82} />
        <rect
          data-button-housing
          x={SWITCH_GEOMETRY.housing.x}
          y={SWITCH_GEOMETRY.housing.y}
          width={SWITCH_GEOMETRY.housing.w}
          height={SWITCH_GEOMETRY.housing.h}
          rx={SWITCH_GEOMETRY.housing.rx}
          fill={active ? "#221b10" : "#0a0a0a"}
          stroke={active ? "#a28336" : hovering ? "#6d5d31" : "#313131"}
          strokeWidth={1.12}
          style={{
            filter: active ? "drop-shadow(0 0 9px rgba(195,160,71,0.32))" : "none",
            transition: "fill 180ms ease, stroke 180ms ease, filter 180ms ease",
          }}
        />
        <path
          data-switch-active-fill
          d={footprintPath}
          fill="url(#switchInnerWarm)"
          opacity={active ? 0.42 : hovering ? 0.16 : 0}
          vectorEffect="non-scaling-stroke"
          style={{
            transition: "opacity 180ms ease",
            pointerEvents: "none",
          }}
        />
        <rect
          x={SWITCH_GEOMETRY.panel.x}
          y={SWITCH_GEOMETRY.panel.y}
          width={SWITCH_GEOMETRY.panel.w}
          height={SWITCH_GEOMETRY.panel.h}
          rx={SWITCH_GEOMETRY.panel.rx}
          fill={active ? "#2b2112" : "#101010"}
          stroke={active ? "#806628" : "#292929"}
          strokeWidth={0.82}
          style={{
            transition: "fill 180ms ease, stroke 180ms ease",
          }}
        />
        <rect
          x={SWITCH_GEOMETRY.panel.x + 5}
          y={SWITCH_GEOMETRY.panel.y + 5}
          width={SWITCH_GEOMETRY.panel.w - 10}
          height={SWITCH_GEOMETRY.panel.h - 10}
          rx={2}
          fill="#18120a"
          opacity={active ? 0.28 : hovering ? 0.12 : 0}
          style={{
            transition: "opacity 180ms ease",
            pointerEvents: "none",
          }}
        />
        {[{ x: 8, y: 80 }, { x: 116, y: 80 }, { x: 8, y: 110 }, { x: 116, y: 110 }].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={2.3} fill={active ? "#201a10" : "#151515"} stroke={active ? "#5a4822" : "#3a3a3a"} strokeWidth={0.6} />
        ))}
        <text
          x={SWITCH_GEOMETRY.anchor.x}
          y={101}
          textAnchor="middle"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={9}
          letterSpacing="0.18em"
          fill={active ? "#f0d076" : hovering ? "#c9b277" : "#858585"}
          style={{
            filter: active ? "drop-shadow(0 0 3px rgba(240,208,118,0.28))" : "none",
            transition: "fill 180ms ease, filter 180ms ease",
          }}
        >
          Click me :)
        </text>
        <rect
          x={SWITCH_GEOMETRY.mount.x}
          y={SWITCH_GEOMETRY.mount.y}
          width={SWITCH_GEOMETRY.mount.w}
          height={SWITCH_GEOMETRY.mount.h}
          rx={SWITCH_GEOMETRY.mount.rx}
          fill={active ? "#21190e" : "#0e0e0e"}
          stroke={active ? "#8c7131" : "#3a3a3a"}
          strokeWidth={0.95}
          style={{
            filter: active ? "drop-shadow(0 0 6px rgba(195,160,71,0.26))" : "none",
            transition: "fill 180ms ease, stroke 180ms ease, filter 180ms ease",
          }}
        />
        <rect
          x={SWITCH_GEOMETRY.slot.x}
          y={SWITCH_GEOMETRY.slot.y}
          width={SWITCH_GEOMETRY.slot.w}
          height={SWITCH_GEOMETRY.slot.h}
          rx={SWITCH_GEOMETRY.slot.rx}
          fill={active ? "#20170d" : "#151515"}
          stroke={active ? "#4e3b19" : "#272727"}
          strokeWidth={0.65}
        />
        <g data-switch-footprint-highlight style={{ pointerEvents: "none" }}>
          <path
            data-switch-footprint-outline
            d={footprintPath}
            fill="none"
            stroke={active ? "#c3a047" : hovering ? "#a98b42" : "#3b3b3b"}
            strokeWidth={active ? 1.05 : hovering ? 0.9 : 0.62}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={active ? 0.76 : hovering ? 0.52 : 0.58}
            vectorEffect="non-scaling-stroke"
            filter={active ? "url(#switchActiveGlow)" : hovering ? "url(#switchGoldGlow)" : undefined}
          />
          {showPulse && (
            <path
              data-switch-hover-pulse
              d={footprintPath}
              fill="none"
              stroke="#c3a047"
              strokeWidth={active ? 1.12 : 0.92}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={active ? 0.24 : 0.14}
              vectorEffect="non-scaling-stroke"
              filter="url(#switchGoldGlow)"
            >
              <animate attributeName="opacity" values={active ? "0.18;0.46;0.18" : "0.1;0.3;0.1"} dur="2s" repeatCount="indefinite" />
              <animate attributeName="stroke-width" values={active ? "0.95;1.45;0.95" : "0.78;1.18;0.78"} dur="2s" repeatCount="indefinite" />
            </path>
          )}
        </g>
        <g transform={`translate(${SWITCH_GEOMETRY.actuator.x} ${actuatorY})`}>
          {calm && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`${SWITCH_GEOMETRY.actuator.x} ${SWITCH_GEOMETRY.actuator.idleY};${SWITCH_GEOMETRY.actuator.x} ${SWITCH_GEOMETRY.actuator.raisedY};${SWITCH_GEOMETRY.actuator.x} ${SWITCH_GEOMETRY.actuator.idleY}`}
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <rect
            x={0}
            y={0}
            width={SWITCH_GEOMETRY.actuator.w}
            height={SWITCH_GEOMETRY.actuator.h}
            rx={SWITCH_GEOMETRY.actuator.rx}
            fill="url(#buttonRed)"
            stroke={active || hovering ? "#c7a64a" : "#381010"}
            strokeWidth={0.8}
            style={{
              filter: active ? "drop-shadow(0 0 6px rgba(220,85,70,0.5)) drop-shadow(0 0 7px rgba(195,160,71,0.18))" : "none",
              transition: "filter 180ms ease, stroke 180ms ease",
            }}
          >
          </rect>
          <rect x={4} y={2} width={34} height={5} rx={1.5} fill="#e88383" opacity={active ? 0.72 : hovering ? 0.66 : pressed ? 0.34 : 0.58} />
          <rect x={4} y={9} width={34} height={3.5} rx={1} fill="#320707" opacity={0.74} />
        </g>
        <rect
          x={SWITCH_GEOMETRY.hit.x}
          y={SWITCH_GEOMETRY.hit.y}
          width={SWITCH_GEOMETRY.hit.w}
          height={SWITCH_GEOMETRY.hit.h}
          fill="transparent"
          role="button"
          tabIndex={0}
          aria-label="Click me"
          aria-pressed={lampOn}
          style={{ cursor: "pointer", pointerEvents: "all", outline: "none" }}
          onClick={onTrigger}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTrigger(); } }}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
        />
      </g>
    </g>
  );
}

function HeroText({ bp }: { bp?: "mobile" | "tablet" | "desktop" } = {}) {
  const breakpoint = bp ?? "desktop";
  const headline = (size: string) => (
    <h1
      className="font-display font-black uppercase text-white"
      style={{ fontSize: size, letterSpacing: 0, lineHeight: 0.86 }}
    >
      Ani<br />Velaga
    </h1>
  );
  const paragraph = (extra: string = "") => (
    <p
      className={`font-mono leading-relaxed text-neutral-400 ${extra}`}
      style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)", maxWidth: "38ch" }}
    >
      <span className="text-neutral-100">Cornell ECE student</span> exploring computer
      systems across layers — from PCBs, embedded firmware, FPGAs, and ASICs to the
      networking infrastructure behind LLM inference.
      <span className="blink-cursor">_</span>
    </p>
  );

  if (breakpoint === "mobile") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex flex-col items-center px-5 pb-10 text-center">
        <div className="w-full max-w-md">
          {headline("clamp(3.8rem, 16vw, 6rem)")}
          <div className="mt-5 flex justify-center">{paragraph("text-center")}</div>
        </div>
      </div>
    );
  }
  if (breakpoint === "tablet") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[3] mx-auto flex max-w-5xl items-end px-8 pb-20">
        <div style={{ maxWidth: "52%" }}>
          {headline("clamp(4rem, 9vw, 7rem)")}
          <div className="mt-5">{paragraph()}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] mx-auto flex max-w-6xl items-end px-6 pb-24 sm:px-10 sm:pb-28">
      <div className="max-w-xl">
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
  const lamp = isMobile
    ? { ...LAMP, cx: 900, cy: 520 }
    : isTablet
      ? { ...LAMP, cx: 630, cy: 543 }
      : LAMP;
  const lampPin = { x: lamp.cx + 22, y: lamp.cy - lamp.h / 2 - 9 };
  const buttonPad = isMobile
    ? { x: 920, y: 470 }
    : isTablet
      ? { x: 1060, y: 750 }
      : BUTTON_PAD;
  const switchSignalPad = {
    x: buttonPad.x,
    y: buttonPad.y - SWITCH_GEOMETRY.anchor.y + SWITCH_GEOMETRY.signalTerminal.padY + SWITCH_GEOMETRY.signalTerminal.padH / 2,
  };
  const signalLiftY = isMobile ? switchSignalPad.y - 28 : isTablet ? switchSignalPad.y - 28 : switchSignalPad.y - 20;
  const signalSideX = isMobile ? buttonPad.x + 80 : isTablet ? buttonPad.x + 120 : 1360;
  const signalUpperDropY = isMobile ? switchSignalPad.y - 48 : isTablet ? lampPin.y - 80 : 180;
  const signalUpperLaneY = isMobile ? switchSignalPad.y - 60 : isTablet ? lampPin.y - 110 : 140;
  const signalCornerX = isMobile ? signalSideX : isTablet ? signalSideX - 260 : 1040;
  const signalBridgeX = isMobile ? lampPin.x + 68 : isTablet ? lampPin.x + 110 : 560;
  const lampEntryY = lampPin.y - (isMobile || isTablet ? 24 : 14);
  const signalD = ptsToD([
    switchSignalPad,
    { x: switchSignalPad.x, y: signalLiftY },
    { x: signalSideX, y: signalLiftY },
    { x: signalSideX, y: signalUpperDropY },
    { x: signalCornerX, y: signalUpperDropY },
    { x: signalCornerX, y: signalUpperLaneY },
    { x: signalBridgeX, y: signalUpperLaneY },
    { x: signalBridgeX, y: lampEntryY },
    { x: lampPin.x, y: lampEntryY },
    { x: lampPin.x, y: lampPin.y },
  ]);
  // Use slice across all breakpoints so the circuit fills the hero on every
  // device — `meet` leaves a tall empty band under the SVG on mobile.
  const preserve = "xMidYMid slice";
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
      <div className="absolute left-0 right-0 z-[1]" style={{ top: 0, bottom: 0 }}>
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
            <linearGradient id="lampCone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
              <stop offset="58%" stopColor="#fbbf24" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="buttonRed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc5f5f" />
              <stop offset="48%" stopColor="#b72a2a" />
              <stop offset="100%" stopColor="#541010" />
            </linearGradient>
            <mask id="heroTraceMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#heroTextFade)" />
            </mask>
          </defs>

          {/* circuit layer (masked behind text zone) */}
          <g mask="url(#heroTraceMask)" style={{ pointerEvents: "none" }}>
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

            <PcbDetailLayer />

            {/* modules */}
            {MODULES.map((m, i) => (
              <CircuitModule key={m.id} m={m} delay={0.3 + i * 0.08} />
            ))}
            <EdgeConnectors />
            <TopHeader />
            <SilkLabelLayer />

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

          </g>

          {/* signal trace + lamp (above text mask so always visible) */}
          <g style={{ pointerEvents: "none" }}>
            <path
              data-signal-route="base"
              d={signalD}
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
              data-signal-route="active"
              d={signalD}
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
            {signaling && pulseId > 0 && (
              <g key={`dis-${pulseId}`} style={{ pointerEvents: "none" }}>
                <circle r={3.4} fill="#fff4d6">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={signalD} />
                </circle>
                <circle r={8} fill="rgba(251,191,36,0.45)">
                  <animateMotion dur={`${SIGNAL_DUR_MS / 1000}s`} repeatCount="1" fill="freeze" path={signalD} />
                </circle>
              </g>
            )}
            <g className="hero-part-in" style={{ animationDelay: "1.6s" }}>
              <StatusLamp lamp={lamp} on={lampOn} />
            </g>
          </g>

          <SwitchModule
            pad={buttonPad}
            hovering={hovering}
            pressed={pressed}
            signaling={signaling}
            lampOn={lampOn}
            onTrigger={triggerSignal}
            onHoverChange={setHovering}
          />
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



const SERIAL_INLINE_GLB = serialGlbSrc;
const SERIAL_TEST_INLINE_GLB = serialTestGlbSrc;
const THRUSTER_INLINE_GLB = thrusterGlbSrc;

function useMouseSpin(defaultSpeed = 20) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    let currentSpeed = defaultSpeed;
    let rafId = 0;
    let lastX: number | null = null;
    let lastTime = 0;
    let lastPushTime = 0;
    const setSpeed = (s: number) => {
      currentSpeed = s;
      el.setAttribute("rotation-per-second", `${s}deg`);
    };
    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));
    const easeBack = () => {
      const elapsed = performance.now() - lastPushTime;
      const decay = elapsed > 120 ? 0.08 : 0.025;
      const next = currentSpeed + (defaultSpeed - currentSpeed) * decay;
      setSpeed(Math.abs(next - defaultSpeed) < 0.15 ? defaultSpeed : next);
      rafId = requestAnimationFrame(easeBack);
    };
    setSpeed(defaultSpeed);
    rafId = requestAnimationFrame(easeBack);
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && lastTime) {
        const dt = Math.max(16, now - lastTime);
        const velocity = ((e.clientX - lastX) / dt) * 1000;
        setSpeed(clamp(currentSpeed + velocity * 0.18, -120, 160));
      }
      lastX = e.clientX;
      lastTime = now;
      lastPushTime = now;
    };
    const onLeave = () => {
      lastX = null;
      lastTime = 0;
      lastPushTime = performance.now();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
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
  return (
    <div
      className={embedded ? "h-full" : "col-span-12 mt-4"}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={embedded ? "overflow-hidden h-full" : "overflow-hidden border border-border"}
        style={{ backgroundColor: "#111", width: "100%", height: embedded ? 450 : 300 }}
      >
        <ModelPreview
          src={src}
          alt="Serial Board 3D model"
          height="100%"
          cameraOrbit={cameraOrbit}
          rotationPerSecond="20deg"
          transform="translateY(8%)"
          fallbackLabel="3D model missing"
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

function MissingImageBox({
  label = "Image missing",
  className = "",
  style,
}: {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center justify-center border border-border bg-secondary/40 text-center ${className}`}
      style={style}
      data-image-fallback
    >
      <div className="px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        {label}
      </div>
    </div>
  );
}

function SafeImage({
  src,
  alt,
  className = "",
  style,
  fit = "cover",
  fallbackLabel = "Image missing",
  loading = "lazy",
}: {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fit?: React.CSSProperties["objectFit"];
  fallbackLabel?: string;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <MissingImageBox
        label={fallbackLabel}
        className={className}
        style={style}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: fit, ...style }}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function ModelPreview({
  src,
  alt,
  height,
  cameraOrbit = "35deg 70deg 105%",
  rotationPerSecond = "20deg",
  transform = "translateY(8%)",
  fallbackLabel = "3D model missing",
}: {
  src?: string;
  alt: string;
  height: number | string;
  cameraOrbit?: string;
  rotationPerSecond?: string;
  transform?: string;
  fallbackLabel?: string;
}) {
  const ref = useMouseSpin(Number.parseFloat(rotationPerSecond) || 20);
  const modelSrc = localModelSrc(src);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    modelSrc ? "loading" : "error",
  );

  useEffect(() => {
    setStatus(modelSrc ? "loading" : "error");
    if (!modelSrc) return;
    const el = ref.current as (HTMLElement & {
      loaded?: boolean;
      modelIsVisible?: boolean;
      src?: string;
      alt?: string;
    }) | null;
    if (!el) return;

    el.setAttribute("src", modelSrc);
    el.src = modelSrc;
    el.setAttribute("alt", alt);
    el.alt = alt;

    const markReady = () => {
      if (el.getAttribute("src") || el.src) setStatus("ready");
    };
    const markError = () => setStatus("error");
    const handleProgress = (event: Event) => {
      const progress = (event as CustomEvent<{ totalProgress?: number }>).detail
        ?.totalProgress;
      if (typeof progress === "number" && progress >= 0.995) {
        markReady();
      }
    };
    const handleVisibility = (event: Event) => {
      const visible = (event as CustomEvent<{ visible?: boolean }>).detail
        ?.visible;
      if (visible !== false) markReady();
    };

    el.addEventListener("load", markReady);
    el.addEventListener("model-visibility", handleVisibility);
    el.addEventListener("progress", handleProgress);
    el.addEventListener("error", markError);

    const readyCheck = window.setTimeout(() => {
      if (el.loaded || el.modelIsVisible) markReady();
    }, 250);

    return () => {
      window.clearTimeout(readyCheck);
      el.removeEventListener("load", markReady);
      el.removeEventListener("model-visibility", handleVisibility);
      el.removeEventListener("progress", handleProgress);
      el.removeEventListener("error", markError);
    };
  }, [alt, modelSrc, ref]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ height, backgroundColor: "#111" }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {modelSrc && status !== "error" ? (
        <model-viewer
          ref={ref as unknown as React.Ref<HTMLElement>}
          src={modelSrc}
          alt={alt}
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
          rotation-per-second={rotationPerSecond}
          camera-orbit={cameraOrbit}
          interaction-prompt="none"
          loading="eager"
          reveal="auto"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#111",
            "--poster-color": "#111",
            cursor: "grab",
            pointerEvents: "auto",
            touchAction: "none",
            transform,
          } as React.CSSProperties}
        />
      ) : null}
      {status !== "ready" ? (
        <MissingImageBox
          label={status === "error" ? fallbackLabel : "Loading 3D preview"}
          className="pointer-events-none absolute inset-0 border-0 bg-[#111]"
        />
      ) : null}
    </div>
  );
}

function PcbOverviewPreview() {
  return (
    <ModelPreview
      src={SERIAL_INLINE_GLB}
      alt="Serial Board 3D model preview"
      height="100%"
      cameraOrbit="35deg 70deg 145%"
      rotationPerSecond="18deg"
      transform="translateY(8%)"
      fallbackLabel="3D PCB render missing"
    />
  );
}

function SideRail() {
  const [active, setActive] = useState("01");
  useEffect(() => {
    const ids: Array<[string, string]> = [
      ["about", "01"],
      ["work", "02"],
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
  const [selected, setSelected] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    const requestedCategory = new URLSearchParams(window.location.search).get("work");
    return requestedCategory && CATEGORIES.some((category) => category.id === requestedCategory)
      ? requestedCategory
      : null;
  });
  const active = selected ? CATEGORIES.find((c) => c.id === selected) ?? null : null;

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("work");
    if (requestedCategory && CATEGORIES.some((category) => category.id === requestedCategory)) {
      setSelected(requestedCategory);
    }
  }, []);

  const showOverview = () => {
    setSelected(null);
    if (window.location.search.includes("work=")) {
      window.history.replaceState(null, "", withBase("/#work"));
    }
  };

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
      label: "02 / SIDE PROJECTS",
      title: "Fun Side Projects + FPGA Work",
      desc: "FPGA music, embedded displays, CAD enclosures, and hardware builds outside the main PCB board work.",
      preview: "star" as const,
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
      <SectionHeader index="03" kicker="Selected Work" title="Things I've built." />

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
                <motion.div
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(card.id);
                    }
                  }}
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
                      <PcbOverviewPreview />
                    ) : card.preview === "star" ? (
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                        <img
                          src={IMAGE_ASSETS.pepperGhostPrototype}
                          alt="Pepper's Ghost planetarium display with floating star map"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/45" />
                        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground">
                          Floating Star Display
                        </div>
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
                </motion.div>
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
                  onClick={showOverview}
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
                        <a
                          href={projectPath(p)}
                          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-sm border-2 border-rule bg-background/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
                        >
                          <span>View details</span>
                          <span>→</span>
                        </a>
                      ) : null}
                      <InlineSerialModel embedded src={SERIAL_INLINE_GLB} cameraOrbit="35deg 70deg 105%" />
                    </div>
                    <div className="w-full">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        detailsHref={p.comingSoon ? undefined : projectPath(p)}
                        bare
                        hideViewDetails
                      />
                    </div>
                  </div>
                  {testBoard ? (
                    <SubProjectRow
                      project={testBoard}
                      categoryId={c.id}
                      detailsHref={testBoard.comingSoon ? undefined : projectPath(testBoard)}
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
                        <a
                          href={projectPath(p)}
                          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-sm border-2 border-rule bg-background/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
                        >
                          <span>View details</span>
                          <span>→</span>
                        </a>
                      ) : null}
                      <InlineSerialModel embedded src={THRUSTER_INLINE_GLB} idleElevation={15} cameraOrbit="-120deg 80deg 105%" />
                    </div>
                    <div className="w-full">
                      <ProjectRow
                        project={p}
                        categoryId={c.id}
                        detailsHref={p.comingSoon ? undefined : projectPath(p)}
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
                  detailsHref={p.comingSoon ? undefined : projectPath(p)}
                />
              )}
            </Reveal>
          );
        })}
      </ul>
      )}
    </div>
  );
}

function ProjectRow({
  project: p,
  categoryId,
  detailsHref,
  bare = false,
  hideViewDetails = false,
}: {
  project: Project;
  categoryId: string;
  detailsHref?: string;
  bare?: boolean;
  hideViewDetails?: boolean;
}) {
  const preview = !bare ? PROJECT_PREVIEWS[p.slug] : undefined;
  const previewSrc = preview?.src;

  if (preview && previewSrc) {
    return (
      <article
        className={`group grid grid-cols-12 items-center gap-6 py-10 transition-colors ${
          detailsHref ? "hover:bg-secondary/40 -mx-4 rounded-sm px-4 transition-transform duration-200 hover:scale-[1.01]" : ""
        }`}
      >
        <div className="col-span-12 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint sm:col-span-2">
          {categoryId}.{p.id}
          {p.year ? <> / {p.year}</> : null}
        </div>

        <div className="col-span-12 grid gap-6 lg:col-span-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(300px,0.38fr)] lg:items-center">
          <div className="min-w-0">
            <h4 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {p.name}
            </h4>
            {p.bullets && p.bullets.length > 0 ? (
              <ul className="mt-3 max-w-3xl space-y-1.5 text-base leading-relaxed text-ink-dim">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-ink-faint">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-dim">{p.tagline}</p>
            )}
            {p.stack.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="tag-pill">{s}</span>
                ))}
              </div>
            ) : null}
            {detailsHref ? (
              <a
                href={detailsHref}
                className="mt-6 inline-flex items-center gap-2.5 rounded-sm border-2 border-rule bg-secondary/40 px-6 py-3 font-mono text-sm uppercase tracking-[0.25em] text-foreground transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
              >
                <span>View details</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            ) : null}
          </div>

          <a
            href={detailsHref}
            className="group/preview relative block aspect-[4/3] w-full overflow-hidden border border-border bg-secondary/20 transition-colors hover:border-mark/70"
            aria-label={`View ${p.name}`}
          >
            <img
              src={previewSrc}
              alt={preview.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
              {preview.label}
            </div>
          </a>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group transition-colors ${
        bare
          ? "flex flex-col gap-2 py-3 px-4"
          : "grid grid-cols-12 items-baseline gap-6 py-10"
      } ${
        p.comingSoon ? "opacity-50" : ""
      } ${detailsHref ? (bare ? "" : "hover:bg-secondary/40 -mx-4 px-4 rounded-sm transition-transform duration-200 hover:scale-[1.02]") : ""}`}
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
        {detailsHref && !hideViewDetails ? (
          <a
            href={detailsHref}
            className={`inline-flex items-center rounded-sm border-2 border-rule bg-secondary/40 font-mono uppercase tracking-[0.25em] text-foreground transition-all hover:border-mark hover:bg-mark/10 hover:text-mark ${bare ? "mt-2 gap-1.5 px-3 py-1.5 text-[10px]" : "mt-6 gap-2.5 px-6 py-3 text-sm"}`}
          >
            <span>View details</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        ) : null}
      </div>
      <div
        className={`flex flex-wrap text-sm ${bare ? "gap-3" : "col-span-12 gap-4 sm:col-span-3 sm:justify-end"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {previewSrc ? (
          <a
            href={detailsHref}
            className="group/preview relative block aspect-[4/3] w-full max-w-[280px] overflow-hidden border border-border bg-secondary/20 transition-colors hover:border-mark/70"
            aria-label={`View ${p.name}`}
          >
            <img
              src={previewSrc}
              alt="DE0-CV FPGA music player hardware preview"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.22em] text-foreground">
              Hardware Preview
            </div>
          </a>
        ) : null}
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
              ? "— Personal project"
              : categoryId === "03"
                ? "— Research"
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
  detailsHref,
  modelSrc,
}: {
  project: Project;
  categoryId: string;
  detailsHref?: string;
  modelSrc: string;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
      className="flex flex-col"
    >
      <div
        className="w-full px-4 py-3"
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
        {detailsHref ? (
          <a
            href={detailsHref}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm border-2 border-rule bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur transition-all hover:border-mark hover:bg-mark/10 hover:text-mark"
          >
            <span>View details</span>
            <span>→</span>
          </a>
        ) : null}
        <div style={{ width: "100%", height: "100%" }} className="overflow-hidden">
          <ModelPreview
            src={modelSrc}
            alt={`${p.name} 3D model`}
            height="100%"
            cameraOrbit="35deg 70deg 105%"
            rotationPerSecond="20deg"
            transform="translateY(8%)"
            fallbackLabel="3D model missing"
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
  const isFpgaMusicPlayer = p.name === "FPGA Music Player";

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
            front={IMAGE_ASSETS.serialFabFront}
            back={IMAGE_ASSETS.serialFabBack}
          />
        </>
      ) : null}
      {isThruster ? (
        <>
          <ThrusterBoardGallery />
          <FabricatedBoard
            name="Thruster Board"
            front={IMAGE_ASSETS.thrusterFabFront}
            back={IMAGE_ASSETS.thrusterFabBack}
          />
        </>
      ) : null}
      {isFpgaMusicPlayer ? (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-secondary/10">
            <div className="border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Hardware Demo
            </div>
            <video
              className="aspect-video w-full bg-background object-cover"
              controls
              playsInline
              preload="metadata"
              poster={IMAGE_ASSETS.fpgaMusicPlayerDemo}
              aria-label="DE0-CV FPGA music player hardware demo"
            >
              <source src={FPGA_HARDWARE_VIDEO_SRC} type="video/quicktime" />
              <a className="text-mark underline" href={FPGA_HARDWARE_VIDEO_SRC}>
                View the hardware demo video
              </a>
            </video>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-secondary/10">
            <div className="border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Interactive Browser Demo
            </div>
            <iframe
              src={FPGA_DEMO_URL}
              title="FPGA Music Player interactive browser demo"
              className="h-[520px] w-full border-0 bg-[#111315]"
              loading="lazy"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {FPGA_PROJECT_NOTES.map(([label, copy]) => (
              <div key={label} className="rounded-md border border-border bg-secondary/10 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mark">
                  {label}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-dim">{copy}</p>
              </div>
            ))}
          </div>
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
  return (
    <SafeImage
      src={src}
      alt={alt}
      className="aspect-[16/10] w-full rounded-md border border-border object-cover"
      fallbackLabel="Image missing"
    />
  );
}

function SerialBoardGallery() {
  const images = [
    { id: "layout", label: "2D Layout", src: IMAGE_ASSETS.serialLayout, alt: "Serial Board 2D PCB schematic layout" },
    { id: "front", label: "3D Front", src: IMAGE_ASSETS.serialFront, alt: "Serial Board 3D front render" },
    { id: "back", label: "3D Back", src: IMAGE_ASSETS.serialBack, alt: "Serial Board 3D back render" },
  ];

  return <BoardGallery images={images} />;
}

function FabricatedBoard({ name, front, back }: { name: string; front?: string; back?: string }) {
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
            <SafeImage
              src={img.src}
              alt={`${name} fabricated and soldered, ${img.label.toLowerCase()}`}
              className="absolute inset-0 h-full w-full object-cover"
              fallbackLabel="Image missing"
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

function BoardGallery({ images }: { images: { id: string; label: string; src?: string; alt: string }[] }) {
  const [active, setActive] = useState(images[0].id);
  const current = images.find((i) => i.id === active) ?? images[0];
  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border" style={{ backgroundColor: "#1a1a1a" }}>
        <SafeImage
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-contain"
          fit="contain"
          fallbackLabel="Image missing"
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
            <SafeImage
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 h-full w-full object-cover"
              fallbackLabel="Image missing"
            />
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
    { id: "layout", label: "2D Layout", src: IMAGE_ASSETS.thrusterLayout, alt: "Thruster Board 2D PCB schematic layout" },
    { id: "front", label: "3D Front", src: IMAGE_ASSETS.thrusterFront, alt: "Thruster Board 3D front render" },
    { id: "back", label: "3D Back", src: IMAGE_ASSETS.thrusterBack, alt: "Thruster Board 3D back render" },
  ];
  const [active, setActive] = useState(images[0].id);
  const current = images.find((i) => i.id === active) ?? images[0];
  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border" style={{ backgroundColor: "#1a1a1a" }}>
        <SafeImage
          src={current.src}
          alt={current.alt}
          className="absolute inset-0 h-full w-full object-contain"
          fit="contain"
          fallbackLabel="Image missing"
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
            <SafeImage
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 h-full w-full object-cover"
              fallbackLabel="Image missing"
            />
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
      <ModelPreview
        src={serialGlbSrc}
        alt="Serial Board 3D model"
        height={400}
        cameraOrbit="35deg 70deg 105%"
        rotationPerSecond="20deg"
        transform="translateY(6%)"
        fallbackLabel="3D model missing"
      />
    </div>
  );
}

function ThrusterViewer() {
  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <ModelPreview
        src={thrusterGlbSrc}
        alt="Thruster Board 3D model"
        height={400}
        cameraOrbit="-120deg 80deg 105%"
        rotationPerSecond="20deg"
        transform="translateY(6%)"
        fallbackLabel="3D model missing"
      />
    </div>
  );
}

function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeader index="02" kicker="About" title="About Me." />

      <div className="mt-10 grid gap-7 md:grid-cols-2 md:items-start md:gap-9 lg:grid-cols-[minmax(300px,0.9fr)_minmax(380px,1fr)_minmax(320px,0.9fr)] lg:items-stretch lg:gap-10 xl:grid-cols-[minmax(320px,0.9fr)_minmax(380px,1fr)_minmax(340px,0.9fr)] xl:gap-12">
        <div className="order-1 md:order-1 lg:order-2 lg:h-full">
          <figure className="mx-auto w-full max-w-[460px] lg:h-full lg:max-w-none">
            <div className="aspect-[3/4] border border-border bg-secondary/20 p-1.5 lg:h-full lg:aspect-auto">
              <SafeImage
                src={IMAGE_ASSETS.headshot}
                alt="Ani Velaga"
                className="block h-full w-full object-cover"
                style={{ objectPosition: "center 35%" }}
                fit="cover"
                fallbackLabel="Headshot missing"
                loading="eager"
              />
            </div>
          </figure>
        </div>

        <div className="order-2 md:order-2 lg:order-1 lg:pr-2">
          <div className="h-full border border-border bg-secondary/10 p-5 sm:p-6 lg:flex lg:flex-col lg:justify-center">
            <div className="max-w-[34rem] space-y-3 font-mono text-[0.82rem] leading-[1.58] tracking-[0.02em] text-ink-dim sm:text-[0.86rem] sm:leading-[1.6] lg:max-w-none xl:text-[0.88rem]">
              <p>
                I&rsquo;m an Electrical and Computer Engineering student at Cornell interested in
                computer systems across layers, bridging PCB design, embedded firmware, FPGAs,
                and ASICs to the networking and software infrastructure behind LLM inference.
              </p>
              <p>
                My focus is computer networking and inference optimization: how hardware/software
                co-design, system architecture, and data movement influence performance. Through
                Cornell AUV, Broadcom, and ByteDance, I&rsquo;ve worked across board-level design,
                Verilog, hardware bring-up, and inference-system simulation to understand these
                systems from the ground up.
              </p>
            </div>
          </div>
        </div>

        <div className="order-3 md:col-span-2 lg:order-3 lg:col-span-1">
          <div className="h-full border border-border bg-secondary/10 p-5 sm:p-6 lg:flex lg:flex-col">
            <div className="font-mono text-[0.82rem] uppercase tracking-[0.3em] text-ink-faint">
              Core Skills
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-col lg:gap-5">
              {ABOUT_SKILL_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-ink-faint">
                      {group.label}
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex border border-border/55 bg-secondary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-dim"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <svg
              className="mt-6 hidden h-24 w-full text-ink-faint opacity-40 sm:block lg:mt-auto"
              viewBox="0 0 340 96"
              role="presentation"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="gpuLinkSignal" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#777" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#d3ad55" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#777" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="28" y="24" width="100" height="48" rx="4" fill="#101010" />
                <rect x="212" y="24" width="100" height="48" rx="4" fill="#101010" />
                {Array.from({ length: 7 }).map((_, i) => (
                  <g key={`gpu-left-pad-${i}`}>
                    <rect x={40 + i * 11} y="17" width="5" height="7" rx="1" fill="currentColor" stroke="none" />
                    <rect x={40 + i * 11} y="72" width="5" height="7" rx="1" fill="currentColor" stroke="none" />
                    <rect x={224 + i * 11} y="17" width="5" height="7" rx="1" fill="currentColor" stroke="none" />
                    <rect x={224 + i * 11} y="72" width="5" height="7" rx="1" fill="currentColor" stroke="none" />
                  </g>
                ))}
                <path d="M 128 36 H 158 V 28 H 182 V 36 H 212" />
                <path d="M 128 48 H 212" />
                <path d="M 128 60 H 158 V 68 H 182 V 60 H 212" />
                <path d="M 14 48 H 28 M 312 48 H 326" />
                <circle cx="14" cy="48" r="3" fill="#0b0b0b" />
                <circle cx="326" cy="48" r="3" fill="#0b0b0b" />
              </g>
              <path d="M 128 48 H 212" fill="none" stroke="url(#gpuLinkSignal)" strokeWidth="1.5" strokeLinecap="round" />
              <g fill="currentColor" opacity="0.42">
                <rect x="54" y="38" width="10" height="4" rx="1" />
                <rect x="72" y="38" width="10" height="4" rx="1" />
                <rect x="54" y="52" width="10" height="4" rx="1" />
                <rect x="72" y="52" width="10" height="4" rx="1" />
                <rect x="238" y="38" width="10" height="4" rx="1" />
                <rect x="256" y="38" width="10" height="4" rx="1" />
                <rect x="238" y="52" width="10" height="4" rx="1" />
                <rect x="256" y="52" width="10" height="4" rx="1" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
      <SectionHeader index="04" kicker="Experience" title="Where I've worked." />
      <ol className="mt-14 space-y-0">
        {EXPERIENCE.map((e, i) => (
          <Reveal as="li" key={i} delay={i * 70}>
            <div className="grid grid-cols-[54px_minmax(0,1fr)] gap-5 border-b border-border/80 py-6 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-7 sm:py-7">
              <div className="relative flex justify-center">
                {i < EXPERIENCE.length - 1 ? (
                  <svg
                    className="pointer-events-none absolute left-1/2 top-[54px] h-[calc(100%+0.25rem)] w-20 -translate-x-1/2 text-border"
                    viewBox="0 0 80 200"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      <>
                        <path d="M 30 0 V 18 H 34 V 184 H 30 V 200" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.56" vectorEffect="non-scaling-stroke" />
                        <path d="M 38 0 V 184 H 38 V 200" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.44" vectorEffect="non-scaling-stroke" />
                        <path d="M 54 0 V 18 H 46 V 184 H 46 V 200" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.34" vectorEffect="non-scaling-stroke" />
                      </>
                    ) : i === 1 ? (
                      <>
                        <path d="M 22 0 V 20 H 34 V 184 H 30 V 200" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.54" vectorEffect="non-scaling-stroke" />
                        <path d="M 38 0 V 20 H 38 V 184 H 46 V 200" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.42" vectorEffect="non-scaling-stroke" />
                        <path d="M 54 0 V 20 H 42 V 184 H 54 V 200" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.34" vectorEffect="non-scaling-stroke" />
                      </>
                    ) : (
                      <>
                        <path d="M 30 0 V 22 H 38 V 184 H 22 V 200" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.54" vectorEffect="non-scaling-stroke" />
                        <path d="M 38 0 V 22 H 42 V 184 H 38 V 200" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.42" vectorEffect="non-scaling-stroke" />
                        <path d="M 54 0 V 22 H 46 V 184 H 54 V 200" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.34" vectorEffect="non-scaling-stroke" />
                      </>
                    )}
                  </svg>
                ) : null}
                <div className="relative z-10 flex size-12 items-center justify-center border border-border bg-[#101010] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:size-14">
                  <div className="pointer-events-none absolute -left-[7px] top-2 flex flex-col gap-1">
                    {Array.from({ length: 5 }).map((_, padIndex) => (
                      <span key={`left-pad-${padIndex}`} className="h-1 w-2 border border-border/70 bg-[#151515]" />
                    ))}
                  </div>
                  <div className="pointer-events-none absolute -right-[7px] top-2 flex flex-col gap-1">
                    {Array.from({ length: 5 }).map((_, padIndex) => (
                      <span key={`right-pad-${padIndex}`} className="h-1 w-2 border border-border/70 bg-[#151515]" />
                    ))}
                  </div>
                  <div className="pointer-events-none absolute -top-[7px] left-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, padIndex) => (
                      <span key={`top-pad-${padIndex}`} className="h-2 w-1 border border-border/70 bg-[#151515]" />
                    ))}
                  </div>
                  <div className="pointer-events-none absolute -bottom-[7px] left-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, padIndex) => (
                      <span key={`bottom-pad-${padIndex}`} className="h-2 w-1 border border-border/70 bg-[#151515]" />
                    ))}
                  </div>
                  {e.org === "Broadcom" ? (
                    <svg
                      className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] h-12 w-14 -translate-x-1/2 text-border"
                      viewBox="0 0 56 48"
                      aria-hidden="true"
                    >
                      <path d="M 28 0 V 18" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.58" vectorEffect="non-scaling-stroke" />
                      <path d="M 18 18 H 38 M 21 24 H 35 M 24 30 H 32" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.58" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
                    </svg>
                  ) : null}
                  <div className="flex h-full w-full items-center justify-center border border-white/85 bg-white p-1.5">
                    <SafeImage
                      src={EXPERIENCE_LOGOS[e.org]}
                      alt={`${e.org} logo`}
                      className="h-full w-full object-contain"
                      fit="contain"
                      fallbackLabel={e.org.slice(0, 2).toUpperCase()}
                      loading="eager"
                    />
                  </div>
                  {e.when.includes("Present") ? (
                    <span className="absolute -right-1 -top-1 size-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
                  ) : null}
                </div>
              </div>
              <div className="min-w-0 pb-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint sm:text-[11px]">
                  {e.when}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {e.role}
                </h3>
                <div className="mt-1 text-sm text-ink-dim sm:text-base">{e.org}</div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim sm:text-[0.95rem]">
                  {e.note}
                </p>
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
    { k: "Email", v: "atv33@cornell.edu", href: "mailto:atv33@cornell.edu", icon: Mail },
    { k: "GitHub", v: "github.com/atv33", href: "https://github.com/atv33", icon: Github },
    { k: "LinkedIn", v: "linkedin.com/in/ani-vel", href: "https://www.linkedin.com/in/ani-vel/", icon: Linkedin },
  ];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <SectionHeader index="05" kicker="Get in touch" title="Let's talk." />
      <div className="mt-20 grid gap-10 sm:grid-cols-12">
        <p className="sm:col-span-5 text-lg leading-relaxed text-ink-dim">
          Open to full-time roles and research positions in hardware engineering, embedded
          systems, and ML infrastructure. I'm especially interested in teams working at the
          hardware-software boundary. Email is the fastest way to reach me.
        </p>
        <ul className="sm:col-span-7 sm:pl-12">
          {links.map((l) => {
            const Icon = l.icon;
            const isExternal = l.href.startsWith("http");

            return (
              <li key={l.k} className="grid grid-cols-12 items-center gap-4 border-t border-border py-6">
                <span className="col-span-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-ink-faint sm:col-span-3">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-secondary/20 text-ink-dim transition-colors group-hover:text-mark">
                    <Icon size={15} strokeWidth={1.7} />
                  </span>
                  <span>{l.k}</span>
                </span>
                <a
                  href={l.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="group col-span-12 inline-flex min-w-0 items-center gap-2 font-display text-2xl font-bold tracking-tight transition hover:text-mark sm:col-span-9 sm:text-3xl"
                >
                  <span className="min-w-0 break-words underline decoration-rule underline-offset-[6px] group-hover:decoration-mark">
                    {l.v}
                  </span>
                  <ExternalLink className="shrink-0" size={20} strokeWidth={2.1} />
                </a>
              </li>
            );
          })}
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

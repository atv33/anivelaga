import { withBase } from "./siteBase";

export type Project = {
  id: string;
  slug: string;
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

export type Category = {
  id: string;
  label: string;
  intro: string;
  projects: Project[];
};

export const FPGA_DEMO_URL = withBase("/fpga-music-player-demo/index.html");
export const FPGA_HARDWARE_VIDEO_SRC = withBase("/fpga-music-player/hardware-demo.mp4");
export const FPGA_HARDWARE_VIDEO_FALLBACK_SRC = withBase("/fpga-music-player/hardware-demo.mov");
export const FPGA_PROJECT_NOTES = [
  ["RTL Architecture", "Song ROM, note-player FSM, 16-bit counters, and board-level top module."],
  ["Quartus Netlist", "Inspected synthesized architecture output to understand how the RTL mapped into counters, adders, muxing, and board-level control logic."],
  ["Timing Closure", "Analyzed critical-path delay through the 16-bit counter path and used the timing model to reason about clock margin and FPGA implementation limits."],
  ["Verification", "Simulation testbenches, Python song model, and browser waveform visualization tied the RTL behavior back to audible square-wave output."],
] as const;

export const CATEGORIES: Category[] = [
  {
    id: "01",
    label: "PCB Design Projects",
    intro:
      "Through my work on Cornell's autonomous submarine team, I designed and brought up multiple PCBs for different systems on the vehicle. I identified signal and power requirements, structured schematics, referenced datasheets for layout decisions, and designed boards from schematic through assembly. I also soldered, debugged, and wrote firmware to bring each board to a reliable operating state.",
    projects: [
      {
        id: "A",
        slug: "serial-communication-board",
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
        slug: "serial-test-board",
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
        slug: "high-power-thruster-control-board",
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
    label: "Fun Side Projects + FPGA Work",
    intro: "Hands-on side projects spanning FPGA/RTL, embedded displays, CAD, 3D printing, and playful hardware builds.",
    projects: [
      {
        id: "A",
        slug: "fpga-music-player",
        name: "FPGA Music Player",
        year: "Fall 2025",
        tagline:
          "Built a SystemVerilog music-player codebase for a DE0-CV FPGA, with switch-selected songs, pushbutton start control, and square-wave piezo buzzer output.",
        bullets: [
          "Designed a modular RTL architecture with a song ROM, note-player FSM, 16-bit counters, and board-level top module",
          "Used Quartus-generated architecture and critical-path views to reason about counter delay, clock margin, and timing closure",
          "Included simulation testbenches, a Python song model, and a static browser demo that visualizes the waveform",
        ],
        stack: ["SystemVerilog", "FPGA", "RTL Design", "Quartus", "Timing Closure", "FSMs", "Signal Timing"],
      },
      {
        id: "B",
        slug: "peppers-ghost-planetarium-display",
        name: "Pepper's Ghost Planetarium Display",
        year: "Summer 2025",
        tagline:
          "Built a 3D-printed desktop planetarium that uses an ESP32-driven LCD and beamsplitter cube to make a rotating star map appear to float inside the enclosure.",
        bullets: [
          "Designed a stacked ESP32 + 2.8 in ILI9341 LCD layout around a 35mm beamsplitter cube for a compact Pepper's Ghost optical path",
          "Modeled a two-piece 3D-printed body and bevel-framed bezel with alignment tabs, wedge-fit ESP32 pegs, LCD pocket, and SD-reader clearance",
          "Tuned firmware geometry for cube centering, map scale, and horizontal mirroring so the reflected star map lands cleanly in the cube",
        ],
        stack: ["ESP32", "ILI9341 TFT", "Arduino", "CAD", "3D Printing", "Embedded Graphics"],
        links: [
          { label: "Blank Body 3MF", href: withBase("/pepper-ghost-planetarium/ghost_body_notext.3mf") },
          { label: "Firmware", href: withBase("/pepper-ghost-planetarium/StarMapGhost.ino") },
        ],
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

export const ALL_PROJECTS = CATEGORIES.flatMap((category) =>
  category.projects.map((project) => ({ project, category })),
);

export const projectPath = (project: Pick<Project, "slug">) => withBase(`/projects/${project.slug}`);

export const findProjectBySlug = (slug: string) =>
  ALL_PROJECTS.find(({ project }) => project.slug === slug) ?? null;

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import {
  CATEGORIES,
  FPGA_DEMO_URL,
  FPGA_HARDWARE_VIDEO_FALLBACK_SRC,
  FPGA_HARDWARE_VIDEO_SRC,
  FPGA_PROJECT_NOTES,
  findProjectBySlug,
  projectPath,
  type Project,
} from "@/lib/projectData";
import { withBase } from "@/lib/siteBase";
import {
  serialGlbSrc,
  serialTestGlbSrc,
  thrusterGlbSrc,
} from "@/lib/pcbImages";

const localImageAssets = import.meta.glob<string>("../assets/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const assetImage = (filename: string) => localImageAssets[`../assets/${filename}`];

const IMAGE_ASSETS = {
  fpgaMusicPlayerDemo: assetImage("fpga-music-player-demo.png"),
  fpgaMusicPlayerPreview: assetImage("fpga-music-player-preview.jpg"),
  pepperGhostPreview: assetImage("pepper-ghost-preview.png"),
  pepperGhostPrototype: assetImage("pepper-ghost-prototype.jpg"),
  pepperGhostBuild: assetImage("pepper-ghost-build.jpg"),
  pepperGhostVideoPoster: assetImage("pepper-ghost-video-poster.jpg"),
  fpgaQuartusArchitecture: assetImage("fpga-quartus-architecture.png"),
  fpgaCriticalPathDelay: assetImage("fpga-critical-path-delay.png"),
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
          "camera-orbit"?: string;
          "interaction-prompt"?: string;
          "shadow-intensity"?: string | number;
          exposure?: string | number;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const match = findProjectBySlug(params.slug);
    const title = match ? `${match.project.name} — Ani Velaga` : "Project — Ani Velaga";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: match?.project.tagline ?? "Project detail page for Ani Velaga's portfolio.",
        },
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const match = findProjectBySlug(slug);

  if (!match) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ProjectTopBar />
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">
            Project not found
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold">Nothing routed here.</h1>
          <Link
            to="/"
            hash="work"
            className="mt-8 inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-mark hover:text-mark"
          >
            Back to Work
            <span>→</span>
          </Link>
        </main>
      </div>
    );
  }

  const { project, category } = match;
  const categoryBackHref = withBase(`/?work=${category.id}#work`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProjectTopBar />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-40">
        <a
          href={categoryBackHref}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim transition-colors hover:text-mark"
        >
          <span>←</span>
          <span>Back to Work</span>
        </a>

        <header className="mt-10 grid gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-mark">
              {category.id}.{project.id}
              {project.year ? <> / {project.year}</> : null}
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-7xl">
              {project.name}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-dim sm:text-lg">
              {project.tagline}
            </p>
          </div>

          <aside className="border border-border bg-secondary/10 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              Category
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{category.label}</div>
            {project.stack.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </aside>
        </header>

        {project.bullets?.length ? (
          <section className="grid gap-4 border-b border-border py-8 sm:grid-cols-3">
            {project.bullets.map((bullet) => (
              <div key={bullet} className="border border-border bg-secondary/10 p-5">
                <span className="block h-px w-8 bg-mark/70" />
                <p className="mt-4 text-sm leading-relaxed text-ink-dim">{bullet}</p>
              </div>
            ))}
          </section>
        ) : null}

        <ProjectMedia project={project} />
        <RelatedProjects currentSlug={project.slug} />
      </main>
    </div>
  );
}

function ProjectTopBar() {
  return (
    <NavBar
      items={[
        { name: "Home", href: withBase("/#hero") },
        { name: "About Me", href: withBase("/#about") },
        { name: "Work", href: withBase("/#work") },
        { name: "Experience", href: withBase("/#experience") },
        { name: "Contact", href: withBase("/#contact") },
      ]}
    />
  );
}

function ProjectMedia({ project }: { project: Project }) {
  if (project.slug === "fpga-music-player") return <FpgaMusicPlayerMedia />;
  if (project.slug === "peppers-ghost-planetarium-display") {
    return <PepperGhostPlanetariumMedia project={project} />;
  }
  if (project.slug === "serial-communication-board") {
    return (
      <PcbProjectMedia
        modelSrc={serialGlbSrc}
        modelAlt="Serial Communication Board 3D model"
        cameraOrbit="35deg 70deg 105%"
        images={[
          { id: "layout", label: "2D Layout", src: IMAGE_ASSETS.serialLayout, alt: "Serial Board 2D PCB schematic layout" },
          { id: "front", label: "3D Front", src: IMAGE_ASSETS.serialFront, alt: "Serial Board 3D front render" },
          { id: "back", label: "3D Back", src: IMAGE_ASSETS.serialBack, alt: "Serial Board 3D back render" },
        ]}
        fabricated={[
          { label: "Front", src: IMAGE_ASSETS.serialFabFront },
          { label: "Back", src: IMAGE_ASSETS.serialFabBack },
        ]}
      />
    );
  }
  if (project.slug === "serial-test-board") {
    return (
      <PcbProjectMedia
        modelSrc={serialTestGlbSrc}
        modelAlt="Serial Test Board 3D model"
        cameraOrbit="35deg 70deg 105%"
      />
    );
  }
  if (project.slug === "high-power-thruster-control-board") {
    return (
      <PcbProjectMedia
        modelSrc={thrusterGlbSrc}
        modelAlt="High-Power Thruster Control Board 3D model"
        cameraOrbit="-120deg 80deg 105%"
        images={[
          { id: "layout", label: "2D Layout", src: IMAGE_ASSETS.thrusterLayout, alt: "Thruster Board 2D PCB schematic layout" },
          { id: "front", label: "3D Front", src: IMAGE_ASSETS.thrusterFront, alt: "Thruster Board 3D front render" },
          { id: "back", label: "3D Back", src: IMAGE_ASSETS.thrusterBack, alt: "Thruster Board 3D back render" },
        ]}
        fabricated={[
          { label: "Front", src: IMAGE_ASSETS.thrusterFabFront },
          { label: "Back", src: IMAGE_ASSETS.thrusterFabBack },
        ]}
      />
    );
  }

  return (
    <section className="py-10">
      <div className="border border-border bg-secondary/10 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Project Notes
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-dim">
          This project now has its own route, so it can grow into a fuller write-up without crowding
          the home page.
        </p>
      </div>
    </section>
  );
}

function PepperGhostPlanetariumMedia({ project }: { project: Project }) {
  const notes = [
    ["Optical path", "A 35mm beamsplitter cube sits above the LCD and reflects the mirrored star-map render so it appears suspended inside the cube."],
    ["Embedded display", "An ESP32 drives a 2.8 in ILI9341 TFT, with firmware controls for map centering, scale, calibration, and horizontal mirroring."],
    ["Printed enclosure", "The blank-front body uses a stacked electronics layout, slide-on ESP32 pegs, LCD pocket, bezel alignment tabs, and SD-reader clearance."],
  ] as const;
  const gallery = [
    {
      label: "Working Prototype",
      src: IMAGE_ASSETS.pepperGhostPrototype,
      alt: "Working Pepper's Ghost planetarium display with floating star map",
      fit: "cover",
    },
    {
      label: "Electronics + Optics",
      src: IMAGE_ASSETS.pepperGhostBuild,
      alt: "ESP32, ILI9341 display, printed enclosure, bezel, and beamsplitter cube for the planetarium display",
      fit: "cover",
    },
    {
      label: "CAD Stack",
      src: IMAGE_ASSETS.pepperGhostPreview,
      alt: "Exploded CAD render of the Pepper's Ghost planetarium display",
      fit: "contain",
    },
  ] as const;

  return (
    <section className="grid gap-6 py-10 lg:grid-cols-[minmax(360px,0.52fr)_minmax(0,0.48fr)]">
      <div className="overflow-hidden border border-border bg-secondary/10">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Interactive CAD Model
        </div>
        <model-viewer
          suppressHydrationWarning
          src={withBase("/pepper-ghost-planetarium/ghost-enclosure.glb")}
          alt="Rotating CAD model of the Pepper's Ghost enclosure body, lifted lid, and beamsplitter cube"
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
          rotation-per-second="16deg"
          camera-orbit="-42deg 68deg 118%"
          interaction-prompt="none"
          shadow-intensity="0.72"
          exposure="0.95"
          loading="eager"
          reveal="auto"
          style={{
            width: "100%",
            height: "430px",
            backgroundColor: "#111",
            cursor: "grab",
          }}
        />
        <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-ink-dim">
          Body and flat bezel/lid shown as a slightly separated CAD stack, with the 35mm cube
          included for optical context.
        </div>
      </div>

      <div className="flex flex-col overflow-hidden border border-border bg-secondary/10">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Floating Star Map Demo
        </div>
        <div className="flex flex-1 items-center bg-background">
          <video
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={IMAGE_ASSETS.pepperGhostVideoPoster}
            aria-label="Pepper's Ghost planetarium display showing a floating star map"
          >
            <source src={withBase("/pepper-ghost-planetarium/pepper-ghost-demo.mp4")} type="video/mp4" />
            <a className="text-mark underline" href={withBase("/pepper-ghost-planetarium/pepper-ghost-demo.mp4")}>
              View the floating star-map demo video
            </a>
          </video>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:col-span-2">
        {notes.map(([label, copy]) => (
          <div key={label} className="border border-border bg-secondary/10 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mark">
              {label}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{copy}</p>
          </div>
        ))}
      </div>

      {project.links?.length ? (
        <div className="border border-border bg-secondary/10 p-5 lg:col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mark">
            Project files
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-mark hover:text-mark"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden border border-border bg-secondary/10 lg:col-span-2">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Prototype + Build Views
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.label} className="overflow-hidden border border-border bg-background">
              <div className={`relative aspect-[4/3] ${item.fit === "contain" ? "bg-[#f4f4f1]" : "bg-[#111]"}`}>
                <SafeImage
                  src={item.src}
                  alt={item.alt}
                  className={`absolute inset-0 h-full w-full ${item.fit === "contain" ? "object-contain" : "object-cover"}`}
                />
              </div>
              <figcaption className="border-t border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FpgaMusicPlayerMedia() {
  return (
    <section className="grid gap-6 py-10 lg:grid-cols-[minmax(320px,0.42fr)_minmax(0,0.58fr)]">
      <div className="flex flex-col overflow-hidden border border-border bg-secondary/10">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Hardware Demo
        </div>
        <div className="flex flex-1 items-center bg-background">
          <video
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={IMAGE_ASSETS.fpgaMusicPlayerPreview}
            aria-label="DE0-CV FPGA music player hardware demo"
          >
            <source src={FPGA_HARDWARE_VIDEO_SRC} type="video/mp4" />
            <source src={FPGA_HARDWARE_VIDEO_FALLBACK_SRC} type="video/quicktime" />
            <a className="text-mark underline" href={FPGA_HARDWARE_VIDEO_SRC}>
              View the hardware demo video
            </a>
          </video>
        </div>
      </div>

      <div className="grid gap-4">
        {FPGA_PROJECT_NOTES.map(([label, copy]) => (
          <div key={label} className="border border-border bg-secondary/10 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mark">
              {label}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{copy}</p>
          </div>
        ))}
      </div>

      <TimingClosureEvidence />

      <div className="overflow-hidden border border-border bg-secondary/10 lg:col-span-2">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Interactive Browser Demo
        </div>
        <iframe
          src={FPGA_DEMO_URL}
          title="FPGA Music Player interactive browser demo"
          className="h-[680px] w-full border-0 bg-[#111315]"
          loading="lazy"
        />
      </div>
    </section>
  );
}

function TimingClosureEvidence() {
  const evidence = [
    {
      label: "Quartus Architecture",
      title: "Synthesized RTL Architecture",
      src: IMAGE_ASSETS.fpgaQuartusArchitecture,
      alt: "Quartus architecture view for the FPGA music player datapath and control logic",
      caption:
        "Schematic-level view used to inspect how the song control path, counter logic, and board outputs mapped after synthesis.",
    },
    {
      label: "Critical Path",
      title: "Counter Delay Analysis",
      src: IMAGE_ASSETS.fpgaCriticalPathDelay,
      alt: "Annotated critical path delay analysis for a 16-bit FPGA counter",
      caption:
        "Annotated timing path used to reason about ripple/carry propagation, per-stage delay, clock margin, and where the design would hit timing limits.",
    },
  ];

  return (
    <div className="overflow-hidden border border-border bg-secondary/10 lg:col-span-2">
      <div className="grid gap-3 border-b border-border px-5 py-4 sm:grid-cols-[minmax(0,0.7fr)_minmax(220px,0.3fr)] sm:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-mark">
            Quartus + Timing Closure
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Beyond the simulator.
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-dim">
          The project also documents the synthesized hardware structure and the delay path that
          constrains clock speed.
        </p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {evidence.map((item) => (
          <figure key={item.label} className="overflow-hidden border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                {item.label}
              </div>
              <figcaption className="mt-1 font-display text-xl font-bold text-foreground">
                {item.title}
              </figcaption>
            </div>
            <div className="relative aspect-[16/9] bg-[#eeeeee]">
              <SafeImage
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-ink-dim">
              {item.caption}
            </p>
          </figure>
        ))}
      </div>
    </div>
  );
}

function PcbProjectMedia({
  modelSrc,
  modelAlt,
  cameraOrbit,
  images,
  fabricated,
}: {
  modelSrc: string;
  modelAlt: string;
  cameraOrbit: string;
  images?: { id: string; label: string; src?: string; alt: string }[];
  fabricated?: { label: string; src?: string }[];
}) {
  return (
    <section className="grid gap-6 py-10 lg:grid-cols-[minmax(280px,0.75fr)_minmax(520px,1.25fr)]">
      <div className="overflow-hidden border border-border bg-secondary/10">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Interactive 3D Model
        </div>
        <model-viewer
          suppressHydrationWarning
          src={modelSrc}
          alt={modelAlt}
          camera-controls
          auto-rotate
          auto-rotate-delay={0}
          rotation-per-second="18deg"
          camera-orbit={cameraOrbit}
          interaction-prompt="none"
          shadow-intensity="0.65"
          exposure="0.92"
          loading="eager"
          reveal="auto"
          style={{
            width: "100%",
            height: "430px",
            backgroundColor: "#111",
            cursor: "grab",
          }}
        />
      </div>

      {images?.length ? (
        <BoardGallery images={images} />
      ) : (
        <div className="border border-border bg-secondary/10 p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            Validation Board
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            A focused 3D board view is available for this test/validation PCB.
          </p>
        </div>
      )}

      {fabricated?.length ? (
        <div className="overflow-hidden border border-border bg-secondary/10 lg:col-span-2">
          <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            Fabricated + Soldered Board
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {fabricated.map((image) => (
              <div key={image.label} className="relative aspect-[4/3] overflow-hidden border border-border bg-[#1a1a1a]">
                <SafeImage
                  src={image.src}
                  alt={`${modelAlt}, ${image.label.toLowerCase()}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  {image.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function BoardGallery({ images }: { images: { id: string; label: string; src?: string; alt: string }[] }) {
  const [active, setActive] = useState(images[0].id);
  const current = images.find((image) => image.id === active) ?? images[0];

  return (
    <div className="overflow-hidden border border-border bg-secondary/10">
      <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        Board Renders
      </div>
      <div className="p-4">
        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-[#1a1a1a]">
          <SafeImage
            src={current.src}
            alt={current.alt}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-mark">
              {String(images.findIndex((image) => image.id === active) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-foreground">
              {current.label}
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image.id)}
              className={`relative aspect-[4/3] flex-1 overflow-hidden border transition ${
                active === image.id ? "border-mark" : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-x-0 bottom-0 p-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground">
                {image.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className ?? ""} flex items-center justify-center bg-secondary/20 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint`}>
        Image missing
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function RelatedProjects({ currentSlug }: { currentSlug: string }) {
  const related = CATEGORIES.flatMap((category) => category.projects)
    .filter((project) => project.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section className="border-t border-border pt-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        More Projects
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((project) => (
          <a
            key={project.slug}
            href={projectPath(project)}
            className="group border border-border bg-secondary/10 p-4 transition-colors hover:border-mark/70"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              {project.year ?? "Project"}
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-foreground transition-colors group-hover:text-mark">
              {project.name}
            </h2>
          </a>
        ))}
      </div>
    </section>
  );
}

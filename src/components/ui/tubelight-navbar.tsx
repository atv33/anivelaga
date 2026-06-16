import { MouseEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NavItem = {
  name: string;
  href: string; // hash anchor, e.g. "#work"
};

export function NavBar({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.name ?? "");
  const clickedActiveRef = useRef<string | null>(null);
  const releaseClickRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (clickedActiveRef.current) return;
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = items[0]?.name ?? "";
      for (const item of items) {
        const el = document.getElementById(item.href.replace("#", ""));
        if (el && el.offsetTop <= y) current = item.name;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.href).join("|")]);

  useEffect(() => {
    return () => {
      if (releaseClickRef.current) window.clearTimeout(releaseClickRef.current);
    };
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    const id = item.href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) {
      setActive(item.name);
      return;
    }

    event.preventDefault();
    clickedActiveRef.current = item.name;
    setActive(item.name);
    window.history.pushState(null, "", item.href);
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (releaseClickRef.current) window.clearTimeout(releaseClickRef.current);
    releaseClickRef.current = window.setTimeout(() => {
      clickedActiveRef.current = null;
      const scrollEvent = new Event("scroll");
      window.dispatchEvent(scrollEvent);
    }, 850);
  };

  return (
    <div
      className={cn(
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 sm:top-6",
        className,
      )}
    >
      <div className="flex max-w-[calc(100vw-16px)] items-center justify-center gap-0 rounded-full border border-border bg-background/70 px-1 py-1 shadow-lg backdrop-blur-md sm:gap-1 sm:px-1.5 sm:py-1.5">
        {items.map((item) => {
          const isActive = active === item.name;
          const mobileName =
            item.name === "About Me" ? "About" : item.name === "Experience" ? "Exp" : item.name;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-full px-2 py-1.5 font-mono text-[9px] uppercase leading-none tracking-[0.12em] transition-colors min-[390px]:px-2.5 min-[390px]:text-[10px] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]",
                "text-ink-dim hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              <span className="relative z-10 sm:hidden">{mobileName}</span>
              <span className="relative z-10 hidden sm:inline">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="tubelight-lamp"
                  className="absolute inset-0 -z-0 rounded-full bg-mark/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <div className="absolute -top-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-mark sm:-top-2 sm:h-1 sm:w-8">
                    <div className="absolute -top-1.5 -left-1.5 h-4 w-9 rounded-full bg-mark/30 blur-md sm:-top-2 sm:-left-2 sm:h-6 sm:w-12" />
                    <div className="absolute -top-1 left-0 h-4 w-6 rounded-full bg-mark/30 blur-md sm:h-6 sm:w-8" />
                    <div className="absolute top-0 left-2 h-3 w-3 rounded-full bg-mark/30 blur-sm sm:h-4 sm:w-4" />
                  </div>
                </motion.div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

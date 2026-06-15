import { useEffect, useState } from "react";
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

  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const onScroll = () => {
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

  return (
    <div
      className={cn(
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 sm:top-6",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/70 px-1.5 py-1.5 shadow-lg backdrop-blur-md">
        {items.map((item) => {
          const isActive = active === item.name;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActive(item.name)}
              className={cn(
                "relative cursor-pointer rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors sm:text-xs",
                "text-ink-dim hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="tubelight-lamp"
                  className="absolute inset-0 -z-0 rounded-full bg-mark/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-mark">
                    <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-mark/30 blur-md" />
                    <div className="absolute -top-1 left-0 h-6 w-8 rounded-full bg-mark/30 blur-md" />
                    <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-mark/30 blur-sm" />
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
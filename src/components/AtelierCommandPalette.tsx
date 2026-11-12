"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  MapPin,
  Search,
  Server,
  Sparkles,
} from "lucide-react";
import { ATELIER_EASE, ATELIER_SPRING } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export function AtelierCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "commander",
        label: "Commander mon site offert (0 €)",
        hint: "Tunnel en 3 étapes",
        icon: Sparkles,
        action: () => router.push("/commander"),
      },
      {
        id: "rdv",
        label: "Réserver un appel avec Léo (10 min)",
        hint: "rdv.boubane.com",
        icon: Calendar,
        action: () => window.open("https://rdv.boubane.com/boubane", "_blank", "noopener,noreferrer"),
      },
      {
        id: "modele",
        label: "Le Manifeste du 0 €",
        hint: "Section 01",
        icon: Home,
        action: () => router.push("/#modele"),
      },
      {
        id: "hebergement",
        label: "Hébergement Direct & Pass 15 €/an",
        hint: "/hebergement",
        icon: Server,
        action: () => router.push("/hebergement"),
      },
      {
        id: "segre",
        label: "Création de site à Segré (49500)",
        hint: "Haut-Anjou 49/53",
        icon: MapPin,
        action: () => router.push("/creation-site-internet-segre"),
      },
      {
        id: "blog",
        label: "Journal & Analyses Stratégiques",
        hint: "/blog",
        icon: FileText,
        action: () => router.push("/blog"),
      },
      {
        id: "dashboard",
        label: "Cockpit Boubane",
        hint: "/dashboard",
        icon: LayoutDashboard,
        action: () => router.push("/dashboard"),
      },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        setOpen(false);
        target.action();
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: ATELIER_EASE }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[150] flex items-start justify-center pt-[16vh] px-4 bg-[#0B0A09]/55 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={ATELIER_SPRING}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleListKeyDown}
              className="w-full max-w-lg rounded-[20px] bg-[#141311] text-[#FAF8F5] border border-white/[0.12] shadow-[0_32px_90px_-15px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
                <Search className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Aller vers une page, commander, appeler..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <kbd className="font-mono text-[10px] text-white/40 border border-white/10 rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => {
                    const Icon = item.icon;
                    const active = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          setOpen(false);
                          item.action();
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                          active
                            ? "bg-white/[0.09] text-white"
                            : "text-white/70 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#ED5B04]" : "text-white/40"
                            }`}
                          />
                          <span className="truncate font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[10px] text-white/40">{item.hint}</span>
                          {active && <ArrowRight className="w-3.5 h-3.5 text-[#ED5B04]" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs font-mono text-white/40">
                    Aucun résultat pour &quot;{query}&quot;
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


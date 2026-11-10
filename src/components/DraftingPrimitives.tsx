"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaperTone = "cream" | "kraft" | "coral" | "blueprint" | "ink";

const TONE_MAP: Record<
  PaperTone,
  {
    surface: string;
    border: string;
    tabBg: string;
    tabText: string;
    text: string;
    muted: string;
  }
> = {
  cream: {
    surface: "bg-[#FDFBF5]",
    border: "border-[#424242]/25",
    tabBg: "bg-[#FDFBF5]",
    tabText: "text-[#0C0A08]",
    text: "text-[#0C0A08]",
    muted: "text-[#57534E]",
  },
  kraft: {
    surface: "bg-[#E8DAC1]",
    border: "border-[#424242]/30",
    tabBg: "bg-[#E8DAC1]",
    tabText: "text-[#0C0A08]",
    text: "text-[#0C0A08]",
    muted: "text-[#4A433B]",
  },
  coral: {
    surface: "bg-[#ED5B04]",
    border: "border-[#0C0A08]/20",
    tabBg: "bg-[#ED5B04]",
    tabText: "text-white",
    text: "text-white",
    muted: "text-white/85",
  },
  blueprint: {
    surface: "bg-[#192841] drafting-grid-dark",
    border: "border-white/20",
    tabBg: "bg-[#192841]",
    tabText: "text-[#F3F6FA]",
    text: "text-[#F3F6FA]",
    muted: "text-[#CBD5E1]",
  },
  ink: {
    surface: "bg-[#141311] drafting-grid-dark",
    border: "border-white/15",
    tabBg: "bg-[#141311]",
    tabText: "text-[#FAF7F0]",
    text: "text-[#FAF7F0]",
    muted: "text-[#A8A29E]",
  },
};

/**
 * Physical paper folder / drafting sheet with optional protruding trapezoid tab and hard offset shadow.
 */
export function FolderSheet({
  children,
  tone = "cream",
  tabIndex,
  tabLabel,
  className,
  innerClassName,
  tiltClassName,
  registrationMarks = false,
}: {
  children: React.ReactNode;
  tone?: PaperTone;
  tabIndex?: string;
  tabLabel?: string;
  className?: string;
  innerClassName?: string;
  tiltClassName?: string;
  registrationMarks?: boolean;
}) {
  const palette = TONE_MAP[tone];

  return (
    <div className={cn("relative", tiltClassName, className)}>
      {(tabIndex || tabLabel) && (
        <div className="paper-tab-shadow relative z-10 inline-flex">
          <div
            className={cn(
              "folder-tab-cut inline-flex items-center gap-2.5 pl-4 pr-7 py-2 border border-b-0 rounded-tl-md font-mono text-[11px] uppercase tracking-[0.12em]",
              palette.tabBg,
              palette.border,
              palette.tabText
            )}
          >
            {tabIndex && (
              <span className="font-semibold text-[#ED5B04] bg-[#ED5B04]/10 px-1.5 py-0.5 rounded-[2px]">
                {tabIndex}
              </span>
            )}
            {tabLabel && <span className="opacity-85">{tabLabel}</span>}
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative rounded-md border paper-sheet-shadow-lg transition-transform duration-300",
          (tabIndex || tabLabel) && "rounded-tl-none",
          palette.surface,
          palette.border,
          palette.text,
          innerClassName
        )}
      >
        {registrationMarks && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2.5 left-3 font-mono text-[10px] opacity-30"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-2.5 right-3 font-mono text-[10px] opacity-30"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-2 left-3 font-mono text-[10px] opacity-30"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-2 right-3 font-mono text-[10px] opacity-30"
            >
              +
            </span>
          </>
        )}
        {children}
      </div>
    </div>
  );
}

/**
 * Illoca-inspired tactile paper button with an attached square arrow cell that swaps colors on hover.
 */
export function PaperSquareButton({
  href,
  label,
  variant = "coral",
  external = false,
  className,
}: {
  href: string;
  label: string;
  variant?: "coral" | "ink" | "cream";
  external?: boolean;
  className?: string;
}) {
  const styles =
    variant === "coral"
      ? {
          wrap: "bg-[#ED5B04] text-white border-[#0C0A08]/20 hover:bg-[#D64E00]",
          square: "bg-[#FAF7F0] text-[#ED5B04] group-hover:bg-[#0C0A08] group-hover:text-white",
        }
      : variant === "ink"
        ? {
            wrap: "bg-[#141311] text-[#FAF7F0] border-white/15 hover:bg-[#23201C]",
            square: "bg-[#ED5B04] text-white group-hover:bg-[#FAF7F0] group-hover:text-[#0C0A08]",
          }
        : {
            wrap: "bg-[#FDFBF5] text-[#0C0A08] border-[#424242]/35 hover:bg-[#F3EFE7]",
            square: "bg-[#0C0A08] text-white group-hover:bg-[#ED5B04] group-hover:text-white",
          };

  const inner = (
    <span className="inline-flex items-center gap-3 pl-4 pr-2 py-2 min-h-[46px]">
      <span className="text-[13px] sm:text-sm font-semibold tracking-[-0.01em] whitespace-nowrap">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "w-8 h-8 rounded-[3px] flex items-center justify-center shrink-0 transition-colors duration-200",
          styles.square
        )}
      >
        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </span>
  );

  const classes = cn(
    "group inline-flex items-center rounded-[4px] border paper-sheet-shadow transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    styles.wrap,
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/**
 * Repeating dotted ink underline (crisp SVG pattern, subtle slide on hover).
 */
export function DottedInkLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={cn("group relative inline-flex items-center gap-1 pb-1 font-medium", className)}>
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 4"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-0 w-full h-[3px] overflow-visible"
      >
        <line
          x1="0"
          y1="2"
          x2="120"
          y2="2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 5"
          className="opacity-45 group-hover:opacity-100 transition-opacity"
        />
      </svg>
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}

/**
 * Margin handwritten annotation rendered in Caveat, never clipping on mobile.
 */
export function HandwrittenNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-[family-name:var(--font-caveat)] text-[1.3rem] sm:text-[1.45rem] leading-[1.15] text-[#ED5B04] select-none",
        className
      )}
    >
      {children}
    </p>
  );
}

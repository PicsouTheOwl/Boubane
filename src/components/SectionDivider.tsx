"use client";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
      <div className="w-1 h-1 rounded-full bg-text-dim mx-3" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function AnimatedLogo({ size = 40 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      initial="hidden"
      animate="visible"
    >
      {/* Outer ring */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        stroke="#5e6ad2"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* B letter - stylized */}
      <motion.path
        d="M35 25 L35 75 L55 75 C65 75 72 68 72 60 C72 53 67 48 60 47 C66 46 71 41 71 34 C71 27 64 25 55 25 L35 25 Z M44 33 L53 33 C58 33 63 35 63 40 C63 45 58 47 53 47 L44 47 L44 33 Z M44 55 L56 55 C62 55 66 58 66 62 C66 67 61 70 56 70 L44 70 L44 55 Z"
        fill="#5e6ad2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ transformOrigin: "50% 50%" }}
      />

      {/* Connection nodes */}
      {[
        { cx: 25, cy: 20, delay: 0.8 },
        { cx: 75, cy: 20, delay: 1.0 },
        { cx: 80, cy: 50, delay: 1.2 },
        { cx: 75, cy: 80, delay: 1.4 },
        { cx: 25, cy: 80, delay: 1.6 },
        { cx: 20, cy: 50, delay: 1.8 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="3"
          fill="#5e6ad2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6], scale: [0, 1.5, 1] }}
          transition={{ duration: 0.6, delay: node.delay }}
        />
      ))}

      {/* Connection lines */}
      <motion.line x1="25" y1="20" x2="35" y2="25" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.9 }} />
      <motion.line x1="75" y1="20" x2="71" y2="25" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.1 }} />
      <motion.line x1="80" y1="50" x2="72" y2="50" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.3 }} />
      <motion.line x1="75" y1="80" x2="71" y2="75" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.5 }} />
      <motion.line x1="25" y1="80" x2="35" y2="75" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.7 }} />
      <motion.line x1="20" y1="50" x2="35" y2="50" stroke="#5e6ad2" strokeWidth="0.5" opacity="0.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay:1.9 }} />
    </motion.svg>
  );
}

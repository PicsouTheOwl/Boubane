"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-px w-16 bg-gradient-to-r from-transparent to-border origin-left"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="w-1 h-1 rounded-full bg-text-dim mx-3"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-px w-16 bg-gradient-to-l from-transparent to-border origin-right"
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";

const navLinks = [
  { href: "#produit", label: "Produit" },
  { href: "#hardware", label: "Hardware" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/80 backdrop-blur-xl border-b border-border shadow-[0_1px_0_rgba(255,255,255,0.03)]"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AnimatedLogo size={28} />
            <span className="text-sm font-semibold text-text tracking-tight group-hover:text-[#5e6ad2] transition-colors">
              Boubane
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:text-text transition-colors rounded-lg hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="#contact"
              className="px-4 py-1.5 rounded-lg bg-[#5e6ad2] text-white text-[12px] font-medium hover:bg-[#4f58b8] transition-colors"
            >
              Démarrer
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-border-hover transition-colors"
          >
            {mobileOpen ? <X size={16} className="text-text" /> : <Menu size={16} className="text-text" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-xl pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-lg font-medium text-text hover:text-[#5e6ad2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5e6ad2] text-white font-medium text-[14px] hover:bg-[#4f58b8] transition-colors w-full justify-center"
                >
                  Démarrer
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

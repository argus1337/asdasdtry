"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const navItems = [
  {
    label: "Services",
    hasArrow: true,
    dropdown: [
      { label: "TikTok", href: "#", disabled: true, comingSoon: true },
      { label: "Instagram", href: "#", disabled: true, comingSoon: true },
      { label: "YouTube", href: "/services/youtube" },
    ],
  },
  {
    label: "How it works",
    hasArrow: false,
    dropdown: [
      { label: "For brands", href: "/how-it-works" },
      { label: "For creators", href: "/creators" },
    ],
  },
  {
    label: "Results",
    hasArrow: false,
    dropdown: [
      { label: "Clients", href: "/clients" },
    ],
  },
  {
    label: "About",
    hasArrow: false,
    dropdown: [
      { label: "About CreateSync", href: "/about" },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScroll();
  
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navbarBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  }, []);

  return (
    <motion.nav 
      className={`sticky top-0 z-50 glass-nav border-b border-border transition-all ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{
        opacity: navbarOpacity,
        backdropFilter: `blur(${navbarBlur}px)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">CreateSync</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-all">
                  {item.label}
                  {item.hasArrow ? (
                    <span className="text-xs ml-0.5">&#8599;</span>
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </button>
                {openDropdown === item.label && (
                  <motion.div 
                    className="absolute top-full left-0 mt-2 w-48 bg-[#141c2f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.dropdown.map((subItem: any, index: number) => (
                      <motion.div
                        key={subItem.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {subItem.disabled ? (
                          <div className="block px-5 py-3 text-sm text-white/40 cursor-not-allowed relative">
                            {subItem.label}
                            {subItem.comingSoon && (
                              <span className="ml-2 text-xs text-purple-400">(Coming Soon)</span>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={subItem.href}
                            className="block px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="ml-4 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all whitespace-nowrap"
              >
                Collaborations
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <div key={item.label} className="py-2">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.label ? null : item.label)
                  }
                  className="flex items-center justify-between w-full px-4 py-2 text-white/80 hover:text-white"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === item.label && (
                  <motion.div 
                    className="pl-6 mt-2 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.dropdown.map((subItem: any, index: number) => (
                      <motion.div
                        key={subItem.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {subItem.disabled ? (
                          <div className="block px-4 py-2 text-sm text-white/40 cursor-not-allowed">
                            {subItem.label}
                            {subItem.comingSoon && (
                              <span className="ml-2 text-xs text-purple-400">(Coming Soon)</span>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
            <div className="px-4 pt-4">
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                Collaborations
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

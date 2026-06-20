import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    {
      name: "Product",
      href: "#product",
    },
    {
      name: "Modules",
      href: "#modules",
    },
    {
      name: "How it works",
      href: "#how-it-works",
    },
    {
      name: "Reporting",
      href: "#reporting",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-2 leading-none">
              <span
                className="text-[2rem] text-gray-900"
                style={{ fontFamily: '"Caveat Brush", cursive' }}
              >
                Odoo
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gray-700">
                Cafe
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.odoo.com/web/login"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
            >
              Sign in
            </a>
            <a
              href="#demo"
              className="bg-brand hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              Request Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-brand"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-gray-800 hover:text-brand"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <a
                href="https://www.odoo.com/web/login"
                target="_blank"
                rel="noreferrer"
                className="text-base font-medium text-gray-800 hover:text-brand"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </a>
              <a
                href="#demo"
                className="bg-brand text-white text-center font-medium px-5 py-3 rounded-xl mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

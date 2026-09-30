"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { RESUME_FILE_NAME } from "@/lib/resume-data";

export function Navbar() {
  const { language, data, ui } = useLanguage();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pdfHref = `/api/resume?lang=${language}`;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="font-heading text-sm font-semibold tracking-tight"
          aria-label={ui.nav.backToTop}
        >
          {data.name}
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label={ui.nav.mainNav}>
          {ui.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <a href={pdfHref} download={RESUME_FILE_NAME}>
              <Download className="size-4" />
              {ui.nav.resume}
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={ui.nav.toggleMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-md md:hidden"
            aria-label={ui.nav.mobileNav}
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {ui.nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-2 justify-start" size="sm">
                <a
                  href={pdfHref}
                  download={RESUME_FILE_NAME}
                  onClick={() => setMenuOpen(false)}
                >
                  <Download className="size-3.5" />
                  {ui.nav.resume}
                </a>
              </Button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

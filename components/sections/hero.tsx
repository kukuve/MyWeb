"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { HeroBackground } from "@/components/hero-background";
import { HeroConsole } from "@/components/hero-console";
import { Button } from "@/components/ui/button";
import { RESUME_FILE_NAME } from "@/lib/resume-data";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero() {
  const { language, data, ui } = useLanguage();

  /** Feed the pointer position to the background spotlight (Layer 0). */
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      {/* Ambient background glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--brand)_12%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(40%_30%_at_80%_100%,color-mix(in_oklch,var(--brand)_8%,transparent),transparent)]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-24 pb-20 sm:px-6 lg:grid-cols-2"
      >
        {/* Left column: intro */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {data.availability}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl"
          >
            {ui.hero.greeting} <span className="text-gradient">{data.name}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 font-heading text-lg text-muted-foreground sm:text-xl"
          >
            {data.role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-muted-foreground"
          >
            {data.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Button asChild size="lg" className="rounded-full px-5">
              <a
                href={`/api/resume?lang=${language}`}
                download={RESUME_FILE_NAME}
              >
                <Download className="size-4" />
                {ui.hero.downloadPdf}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-5"
            >
              <a href="#projects">
                {ui.hero.viewProjects}
                <ArrowDown className="size-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-brand" />
              {data.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-brand" />
              {data.location}
            </span>
            {data.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground hover:underline underline-offset-4"
              >
                {social.label}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right column: dual-tab geek console */}
        <motion.div
          variants={item}
          className="flex justify-center lg:justify-end"
        >
          <HeroConsole />
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label={ui.hero.scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/resume-data";

export function ProjectCard({ project }: { project: Project }) {
  const { ui } = useLanguage();
  const cardRef = React.useRef<HTMLDivElement>(null);

  /** Track the pointer and feed it to the CSS-driven spotlight overlay. */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="spotlight-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60 p-6 transition-colors duration-300 hover:border-brand/50"
    >
      {/* Tinted gradient header */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-70 transition-opacity duration-300 group-hover:opacity-100",
          project.gradient,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-background/80 px-2.5 backdrop-blur">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
            {project.badge ?? project.title.slice(0, 2).toUpperCase()}
          </span>
        </div>
      
        <div className="flex items-center gap-1.5">
          {project.featured ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="gap-1 bg-brand/10 text-brand hover:bg-brand/10">
                  <Sparkles className="size-3" />
                  {ui.projects.featured}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{ui.projects.featuredHint}</TooltipContent>
            </Tooltip>
          ) : null}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${ui.projects.viewSource}: ${project.title}`}
                >
                  <GithubIcon className="size-3.5" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{ui.projects.viewSource}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <h3 className="relative mt-5 font-heading text-lg font-semibold tracking-tight">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
        >
          {project.title}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </h3>

      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <ul className="relative mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <span className="inline-flex items-center rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {tag}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

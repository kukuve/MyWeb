"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  const { data, ui } = useLanguage();

  return (
    <section
      id="experience"
      className="relative scroll-mt-16 border-y border-border/60 bg-muted/30 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={ui.experience.eyebrow}
          title={ui.experience.title}
          description={ui.experience.description}
        />

        <div className="relative">
          {/* Timeline rail */}
          <div
            aria-hidden
            className="absolute top-1 bottom-1 left-[7px] w-px bg-border sm:left-[9px]"
          />
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1 bottom-1 left-[7px] w-px origin-top bg-gradient-to-b from-brand via-brand/60 to-transparent sm:left-[9px]"
          />

          <ol className="space-y-12">
            {data.experience.map((job, index) => (
              <li key={job.company} className="relative pl-8 sm:pl-12">
                {/* Timeline dot */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.2 + index * 0.1,
                  }}
                  className="absolute top-1.5 left-0 flex size-4 items-center justify-center sm:size-5"
                >
                  <span className="size-2.5 rounded-full border-2 border-brand bg-background sm:size-3" />
                </motion.span>

                <Reveal delay={index * 0.06}>
                  <div className="rounded-xl border border-border bg-card/60 p-6 transition-colors hover:border-brand/40 sm:p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-heading text-lg font-semibold tracking-tight">
                        {job.role}
                        <span className="text-brand"> · </span>
                        {job.company}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs font-normal"
                      >
                        {job.period}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {job.location}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {job.summary}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {job.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand" />
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

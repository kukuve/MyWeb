"use client";

import { Reveal } from "@/components/motion/reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 space-y-3 sm:mb-16">
      <Reveal>
        <p className="font-mono text-xs font-medium tracking-widest text-brand uppercase">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p className="max-w-2xl text-muted-foreground text-pretty">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

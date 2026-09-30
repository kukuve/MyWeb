"use client";

import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export function About() {
  const { data, ui, language } = useLanguage();

  return (
    <section id="about" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={ui.about.eyebrow}
          title={ui.about.title}
          description={ui.about.description}
        />

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            {data.about.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <p className="leading-relaxed text-muted-foreground text-pretty">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {data.education[0].degree}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.education[0].school} · {data.education[0].period}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* key 随语言变化重建，避免新 item 继承已完成的 hidden 状态 */}
          <Stagger key={language} className="grid grid-cols-2 gap-4 content-start">
            {ui.about.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="group p-5 transition-colors hover:border-brand/40">
                  <p className="font-heading text-3xl font-semibold tracking-tight text-brand">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

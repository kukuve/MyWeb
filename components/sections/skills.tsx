"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Skills() {
  const { data, ui, language } = useLanguage();

  return (
    <section id="skills" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={ui.skills.eyebrow}
          title={ui.skills.title}
          description={ui.skills.description}
        />

        {/* key 随语言变化重建，避免新 item 继承已完成的 hidden 状态 */}
        <Stagger key={language} className="grid gap-6 sm:grid-cols-2">
          {data.skills.map((group) => (
            <StaggerItem key={group.title}>
              <div className="h-full rounded-xl border border-border bg-card/60 p-6 transition-colors hover:border-brand/40">
                <h3 className="font-mono text-xs font-medium tracking-widest text-brand uppercase">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      whileHover={{ y: -3, scale: 1.04 }}
                      transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    >
                      <span className="inline-flex cursor-default items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground">
                        {skill}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-center text-sm text-muted-foreground">
            {ui.skills.exploringPrefix}{" "}
            <span className="text-brand">{ui.skills.exploringTopics[0]}</span>{" "}
            {ui.skills.exploringAnd}{" "}
            <span className="text-brand">{ui.skills.exploringTopics[1]}</span>
            {ui.skills.exploringSuffix}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

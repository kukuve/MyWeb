"use client";

import { useLanguage } from "@/components/language-provider";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
  const { data, ui, language } = useLanguage();

  return (
    <section
      id="projects"
      className="relative scroll-mt-16 border-y border-border/60 bg-muted/30 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={ui.projects.eyebrow}
          title={ui.projects.title}
          description={ui.projects.description}
        />

        {/* key 随语言变化重建，避免新 item 继承已完成的 hidden 状态 */}
        <Stagger key={language} className="grid gap-6 sm:grid-cols-2">
          {data.projects.map((project) => (
            <StaggerItem key={project.title} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

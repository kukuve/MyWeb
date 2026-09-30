"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/brand-icons";
import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { RESUME_FILE_NAME } from "@/lib/resume-data";

/** Resolve a brand icon from the social link target (works for both languages). */
function socialIcon(href: string): React.ReactNode {
  if (href.includes("github")) return <GithubIcon className="size-4" />;
  if (href.includes("linkedin")) return <LinkedinIcon className="size-4" />;
  if (href.startsWith("mailto")) return <Mail className="size-4" />;
  return <XIcon className="size-4" />;
}

export function Contact() {
  const { language, data, ui } = useLanguage();

  return (
    <section id="contact" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={ui.contact.eyebrow}
          title={ui.contact.title}
          description={ui.contact.description}
        />

        <div className="flex flex-col items-center gap-10">
          <Reveal>
            <motion.a
              href={`mailto:${data.email}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3"
            >
              <span className="text-gradient font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
                {data.email}
              </span>
              <ArrowUpRight className="size-8 text-brand transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-10" />
            </motion.a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-5">
                <a href={`mailto:${data.email}`}>
                  <Mail className="size-4" />
                  {ui.contact.sayHello}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-5"
              >
                <a href={`/api/resume?lang=${language}`} download={RESUME_FILE_NAME}>
                  <Download className="size-4" />
                  {ui.contact.downloadPdf}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <ul className="flex items-center gap-2">
              {data.socials.map((social) => (
                <li key={social.label}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="flex size-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
                  >
                    {socialIcon(social.href)}
                  </motion.a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

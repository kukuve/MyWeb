"use client";

import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { data, ui } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          © {year} {data.name} · {ui.footer.rights}
        </p>
        <p className="font-mono text-xs">{ui.footer.builtWith}</p>
      </div>
    </footer>
  );
}

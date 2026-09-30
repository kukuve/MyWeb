"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { language, ui, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      title={ui.languageToggle.title}
      aria-label={ui.languageToggle.title}
      className="h-8 rounded-md border border-border font-mono text-xs tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {language === "en" ? "中 / EN" : "EN / 中"}
    </Button>
  );
}

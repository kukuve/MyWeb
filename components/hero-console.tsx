"use client";

import * as React from "react";
import { useLanguage } from "@/components/language-provider";
import { MATRIX_EVENT } from "@/components/matrix-easter-egg";
import { cn } from "@/lib/utils";

const CODE_LINES = [
  "const engineer: Profile = {",
  '  name: "Donovan Su",',
  '  focus: ["Systems", "Edge AI", "Full-Stack"],',
  '  status: "Building next-gen tools...",',
  "};",
];

const FULL_TEXT = CODE_LINES.join("\n");

type HistoryItem = {
  command?: string;
  output: React.ReactNode;
};

type Tab = "code" | "terminal";

/** Highlights `help` and `matrix` command tokens inside the intro hint. */
function HighlightCommands({ text }: { text: string }) {
  const parts = text.split(/(\bhelp\b|\bmatrix\b)/g);
  return (
    <>
      {parts.map((part, index) =>
        part === "help" || part === "matrix" ? (
          <span key={index} className="text-brand font-semibold">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

/**
 * Dual-tab "geek workbench": a VS Code-style code tab with a typewriter
 * effect, and an interactive terminal tab (help / whoami / skills / matrix /
 * clear) that can summon the Matrix easter egg.
 */
export function HeroConsole() {
  const { ui } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<Tab>("code");

  // ---- Typewriter ---------------------------------------------------------
  const [renderedText, setRenderedText] = React.useState("");

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setRenderedText(FULL_TEXT.slice(0, index));
      index++;
      if (index > FULL_TEXT.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // ---- Terminal -----------------------------------------------------------
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the prompt without moving the page.
  React.useEffect(() => {
    if (activeTab === "terminal") {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [activeTab]);

  // Pin the terminal's inner scroll area to the latest entry without
  // scrolling the page itself.
  React.useEffect(() => {
    if (activeTab !== "terminal") return;
    const container = terminalEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [activeTab, history]);

  const handleCommand = (event: React.FormEvent) => {
    event.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response: React.ReactNode = "";

    switch (cmd) {
      case "help":
        response = ui.console.help;
        break;
      case "whoami":
        response = ui.console.whoami;
        break;
      case "skills":
        response = ui.console.skills;
        break;
      case "matrix":
        response = ui.console.matrix;
        window.dispatchEvent(new Event(MATRIX_EVENT));
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        response = `${ui.console.notFound}${cmd}`;
    }

    setHistory((prev) => [...prev, { command: input, output: response }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border/80 bg-zinc-950/85 font-mono text-xs shadow-2xl backdrop-blur-md">
      {/* Tab bar with macOS traffic lights */}
      <div className="flex items-center border-b border-border/50 bg-zinc-900/50 px-3 py-2">
        <div className="mr-3 flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-red-500/80" />
          <div className="size-2.5 rounded-full bg-yellow-500/80" />
          <div className="size-2.5 rounded-full bg-green-500/80" />
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-zinc-200",
            activeTab === "code" &&
              "border-b-2 border-brand bg-zinc-950/60 text-zinc-100",
          )}
        >
          <span className="text-brand">{"</>"}</span>
          {ui.console.codeTab}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("terminal")}
          className={cn(
            "flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-zinc-200",
            activeTab === "terminal" &&
              "border-b-2 border-brand bg-zinc-950/60 text-zinc-100",
          )}
        >
          <span className="text-brand">{"❯_"}</span>
          {ui.console.terminalTab}
        </button>
      </div>

      {activeTab === "code" ? (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2 text-[11px] text-muted-foreground">
            <span>{ui.console.codeTab}</span>
            <span className="text-brand">TypeScript</span>
          </div>
          <pre className="h-36 overflow-x-auto text-zinc-300 leading-relaxed">
            <code>
              {renderedText}
              <span className="inline-block h-3.5 w-1.5 animate-pulse bg-brand align-middle" />
            </code>
          </pre>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2 text-[11px] text-muted-foreground">
            <span>{ui.console.bashTitle}</span>
          </div>

          {/* Output history */}
          <div className="h-36 space-y-1.5 overflow-y-auto pr-1 text-zinc-300">
            {/* Welcome hint — rendered live so it follows the current language */}
            <div className="text-zinc-200">
              <span className="text-zinc-400">
                <HighlightCommands text={ui.console.hint} />
              </span>
            </div>
            {history.map((item, index) => (
              <div key={index} className="space-y-0.5">
                {item.command ? (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="text-brand">➜</span>
                    <span>~ {item.command}</span>
                  </div>
                ) : null}
                <div className="text-zinc-200">{item.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Input line */}
          <form
            onSubmit={handleCommand}
            className="mt-3 flex items-center gap-1.5"
          >
            <span className="text-brand">➜</span>
            <span className="text-zinc-400">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
              placeholder={ui.console.placeholder}
              aria-label={ui.console.placeholder}
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      )}
    </div>
  );
}

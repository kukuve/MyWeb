/**
 * Layer 0 hero backdrop: a faint dot-matrix grid (masked to fade out toward
 * the bottom) plus a radial spotlight that follows the pointer via the
 * --mouse-x / --mouse-y custom properties set on the hero section.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Static dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_9%,transparent)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_55%,transparent_100%)]" />

      {/* Pointer-following spotlight */}
      <div
        style={{
          background:
            "radial-gradient(460px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), color-mix(in oklch, var(--brand) 12%, transparent), transparent 75%)",
        }}
        className="absolute inset-0 transition-opacity duration-300"
      />
    </div>
  );
}

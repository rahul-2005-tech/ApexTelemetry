export default function Logo({ showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent shadow-[0_0_24px_-4px_var(--color-accent)]">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true">
          <path d="M6 25 16 6l10 19h-5.4L16 15.8 11.4 25z" fill="#fff" />
        </svg>
      </div>
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-ink">
          Apex<span className="text-accent">Telemetry</span>
        </span>
      )}
    </div>
  );
}

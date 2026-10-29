const TONES = {
  neutral: "border-line-strong bg-surface-2 text-ink-muted",
  accent: "border-accent/40 bg-accent/10 text-accent-hover",
  demo: "border-demo/40 bg-demo/10 text-demo",
  positive: "border-positive/30 bg-positive/10 text-positive",
};

export default function Badge({ tone = "neutral", className = "", children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}

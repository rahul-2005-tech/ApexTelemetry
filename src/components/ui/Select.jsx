import { useId } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Styled native select (accessible and mobile-friendly by default).
 * `options` is an array of `{ value, label }`.
 */
export default function Select({ label, value, onChange, options, disabled = false }) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-medium tracking-wider text-ink-dim uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-line-strong bg-surface-2 py-2.5 pr-10 pl-3.5 text-sm text-ink transition-colors hover:border-ink-dim disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </div>
  );
}

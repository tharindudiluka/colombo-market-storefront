"use client";

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number | null;
  onChange: (next: number) => void;
  label: string;
}) {
  const atMax = max !== null && value >= max;

  return (
    <div className="inline-flex items-center rounded-full border border-black/10" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="−"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-brand-teal-dark disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold text-brand-teal-dark">{value}</span>
      <button
        type="button"
        aria-label="+"
        disabled={atMax}
        onClick={() => onChange(max !== null ? Math.min(max, value + 1) : value + 1)}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-brand-teal-dark disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

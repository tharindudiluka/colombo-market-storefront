export type CarouselArrowState = "active" | "muted" | "disabled";

const base =
  "z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none sm:h-12 sm:w-12";

const states: Record<CarouselArrowState, string> = {
  active: "cursor-pointer bg-brand-teal text-white shadow-md hover:scale-105 hover:bg-brand-teal-dark hover:shadow-lg active:scale-95",
  // First position: grey-green but still clickable.
  muted: "cursor-pointer bg-[color-mix(in_srgb,var(--color-brand-teal)_40%,var(--color-neutral-400))] text-white shadow-md hover:scale-105 hover:bg-brand-teal active:scale-95",
  disabled: "cursor-not-allowed bg-neutral-200 text-neutral-400 shadow-none",
};

/**
 * Round green carousel arrow shared by the hero slider and the homepage product rows. Disabled uses aria-disabled (not
 * `disabled`) so keyboard focus is not lost at either end; the parent decides the position through `className`.
 */
export function CarouselArrow({ direction, label, state, onClick, className = "" }: {
  direction: "left" | "right";
  label: string;
  state: CarouselArrowState;
  onClick: () => void;
  className?: string;
}) {
  const disabled = state === "disabled";
  return (
    <button type="button" aria-label={label} aria-disabled={disabled} onClick={() => { if (!disabled) onClick(); }} className={`${base} ${states[state]} ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

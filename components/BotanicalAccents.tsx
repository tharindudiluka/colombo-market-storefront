/** Static, non-interactive decoration; the section's content stays above this layer. */
export function BotanicalAccents({ variant }: { variant: "hero" | "faq" | "store" }) {
  return (
    <div aria-hidden="true" className={`botanical-accents botanical-accents--${variant}`}>
      <span className="botanical-leaf botanical-leaf--first" />
      <span className="botanical-leaf botanical-leaf--second" />
      <span className="botanical-curry" />
      {variant !== "faq" && <span className="botanical-chili" />}
    </div>
  );
}

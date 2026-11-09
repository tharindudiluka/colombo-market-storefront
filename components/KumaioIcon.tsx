/**
 * The Kumaio mark (the "K" and the leaf shape around it, taken from the brand logo without the wordmark). The artwork
 * is a transparent PNG used as a mask, so it takes the surrounding text colour like the line icons in the mobile menu.
 */
export function KumaioIcon({ className }: { className?: string }) {
  const mask = "url(/images/brand/kumaio-mark.png)";
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className ?? ""}`}
      style={{ maskImage: mask, WebkitMaskImage: mask, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: "contain", WebkitMaskSize: "contain" }}
    />
  );
}

import "server-only";
import sanitizeHtml from "sanitize-html";

/** Keep merchant copy and rich text, without embedded scripts or pasted layout styles. */
export function productDescriptionHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "span", "div", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "a", "table", "thead", "tbody", "tr", "th", "td", "img", "sub", "sup"],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    transformTags: { h1: "h2" },
  });
}

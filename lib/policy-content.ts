// Prepares Shopify policy / page HTML for the shared policy layout. The wording is never changed. Only structure
// is added: section ids and an "On this page" list, bold-only paragraphs promoted to headings (the merchant authored
// sections that way), wide tables made scrollable, and email addresses / phone numbers made tappable.
// No imports, so it is easy to exercise outside Next.js.

export type PolicyTocItem = { id: string; title: string };

const entities: Record<string, string> = { "&amp;": "&", "&nbsp;": " ", "&quot;": '"', "&#39;": "'", "&lt;": "<", "&gt;": ">" };

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&(amp|nbsp|quot|#39|lt|gt);/g, (match) => entities[match] ?? match).replace(/\s+/g, " ").trim();
}

function slugify(text: string): string {
  const folded = text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "");
  return folded.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const PHONE = /\+\d{2}[\d ]{7,14}\d/g;

function linkify(html: string): string {
  let anchorDepth = 0;
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<a[\s>]/i.test(part)) anchorDepth += 1;
        else if (/^<\/a>/i.test(part)) anchorDepth = Math.max(0, anchorDepth - 1);
        return part;
      }
      if (anchorDepth > 0) return part;
      return part
        .replace(EMAIL, (email) => `<a href="mailto:${email}">${email}</a>`)
        .replace(PHONE, (phone) => `<a href="tel:${phone.replace(/\s/g, "")}">${phone}</a>`);
    })
    .join("");
}

export function preparePolicyHtml(source: string, pageTitle = ""): { html: string; toc: PolicyTocItem[] } {
  let html = source;

  // Empty spacer paragraphs.
  html = html.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");

  // A link such as href="name@example.com" (no mailto:) would resolve as a relative URL. Repair it; mailto/tel links
  // do not need target=_blank.
  html = html.replace(/<a\b([^>]*)>/gi, (tag, attributes: string) => {
    let next = attributes.replace(/href="([^"]+)"/i, (match, href: string) => (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(href) ? `href="mailto:${href}"` : match));
    if (/href="(mailto|tel):/i.test(next)) next = next.replace(/\s*target="_blank"/i, "");
    return `<a${next}>`;
  });

  // The merchant wrote section titles as a paragraph holding only bold text. Promote them to real headings.
  const normalizedTitle = plainText(pageTitle).toLowerCase();
  html = html.replace(/^\s*<p>\s*<strong>([^<]{2,90})<\/strong>\s*<\/p>\s*/i, (match, text: string) => (plainText(text).toLowerCase() === normalizedTitle ? "" : match));
  // A bold line right after a paragraph ending in ":" is a label or reference, not a section title.
  html = html.replace(/<p>\s*<strong>([^<]{2,90})<\/strong>\s*<\/p>/gi, (match, text: string, offset: number) => {
    if (/[:：]\s*$/.test(text.trim())) return match;
    if (/[:：]\s*(<\/p>\s*)?$/.test(html.slice(Math.max(0, offset - 24), offset))) return match;
    return `<h2>${text.trim()}</h2>`;
  });

  // A rule right before a heading doubles the heading's own divider.
  html = html.replace(/<hr\s*\/?>\s*(?=<h[23]\b)/gi, "");

  // Section ids and the table of contents (h2 only).
  const used = new Set<string>();
  const toc: PolicyTocItem[] = [];
  html = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level: string, attributes: string, inner: string) => {
    const title = plainText(inner);
    if (!title) return match;
    let id = /\sid="([^"]+)"/i.exec(attributes)?.[1] ?? slugify(title);
    for (let n = 2; used.has(id); n += 1) id = `${slugify(title)}-${n}`;
    used.add(id);
    if (level === "2") toc.push({ id, title });
    const withoutId = attributes.replace(/\sid="[^"]*"/i, "");
    return `<h${level}${withoutId} id="${id}">${inner}</h${level}>`;
  });

  // Wide tables scroll inside their own box instead of the page.
  html = html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => `<div class="policy-table">${table}</div>`);

  return { html: linkify(html), toc };
}

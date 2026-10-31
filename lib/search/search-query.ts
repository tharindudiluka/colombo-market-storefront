// Storefront search normalization: a small controlled synonym map plus a tiered query, so exact user
// terms stay first, synonyms follow, and taxonomy tags (family:rice, type:basmati, storage:frozen,
// diet:*) never leak into customer-facing results.
//
// Shopify's default product search indexes every tag token, so "family" matched every product
// tagged "family:rice". The Storefront API cannot exclude those tags from the default search, so:
//   1. exact tier    - fielded search (title/vendor prefix, product type, exact non-technical tag). Fielded
//                      `tag:` matches whole tag values only, so technical tags can never match a stray word.
//   2. synonym tier  - the same fielded search over the controlled synonyms, plus the matching Product
//                      Types and technical tags used deliberately (e.g. tiefkühl -> "Frozen Foods").
//   3. text tier     - the original default query (keeps description matches) with a verification step that
//                      drops any product whose only match is a technical tag.
// This file has no imports so it can also be exercised outside Next.js.

export const TECHNICAL_TAG = /^(family|type|storage|diet):/i;

export type SearchNode = {
  id: string;
  title: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  description?: string;
  availableForSale?: boolean;
};

export type SearchTier = "fielded" | "text";

type Concept = { productTypes?: string[]; tags?: string[] };

const FROZEN: Concept = { productTypes: ["Frozen Foods"], tags: ["family:frozen"] };
const RICE: Concept = { productTypes: ["Rice"], tags: ["family:rice"] };
const TEA: Concept = { productTypes: ["Tea"] };
const COCONUT: Concept = { productTypes: ["Coconut Products"] };
const DAL: Concept = { tags: ["type:urad-dal", "type:toor-dal", "type:moong-dal", "type:masoor-dal", "type:chana-dal"] };
const PARATHA: Concept = { tags: ["type:paratha"] };
const ATTA: Concept = { tags: ["type:atta"] };
const RAWA: Concept = { tags: ["type:rawa"] };

// key (folded) -> extra terms. One direction per entry, exactly as agreed; the typed term always stays first.
const SYNONYMS: Record<string, string[]> = {
  tiefkuehl: ["frozen"],
  gefroren: ["frozen"],
  reis: ["rice"],
  rice: ["reis"],
  tee: ["tea"],
  tea: ["tee"],
  kokos: ["coconut"],
  coconut: ["kokos"],
  dal: ["daal", "dhal"],
  daal: ["dal"],
  dhal: ["dal"],
  paratha: ["parotta", "roti"],
  parotta: ["paratha"],
  roti: ["paratha"],
  atta: ["weizenmehl"],
  weizenmehl: ["atta"],
  griess: ["rawa", "rava", "semolina"],
  rawa: ["rava", "grieß"],
  rava: ["rawa", "grieß"],
};

const CONCEPTS: Record<string, Concept> = {
  tiefkuehl: FROZEN, gefroren: FROZEN, frozen: FROZEN,
  reis: RICE, rice: RICE,
  tee: TEA, tea: TEA,
  kokos: COCONUT, coconut: COCONUT,
  dal: DAL, daal: DAL, dhal: DAL,
  paratha: PARATHA, parotta: PARATHA, roti: PARATHA,
  atta: ATTA, weizenmehl: ATTA,
  griess: RAWA, rawa: RAWA, rava: RAWA,
};

/** Lower-case and fold German umlauts/ß and accents so "Tiefkühl", "tiefkuehl" and "Grieß"/"griess" compare equal. */
export function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Keys of 6+ characters also match as a prefix ("tiefkühlprodukte", "tiefkuehlware"); short keys match exactly
// so "reis" does not drag in "reismehl" and "dal" does not drag in "dalchini".
function lookupKey(folded: string): string | null {
  if (folded in SYNONYMS || folded in CONCEPTS) return folded;
  const keys = new Set([...Object.keys(SYNONYMS), ...Object.keys(CONCEPTS)]);
  for (const key of keys) if (key.length >= 6 && folded.startsWith(key)) return key;
  return null;
}

function sanitize(token: string): string {
  return token.replace(/["():\\*]/g, "").replace(/^[-+]+/, "").trim();
}

function fieldedTerm(term: string): string[] {
  const wild = term.length >= 4 ? `${term}*` : term; // prefix wildcard only from 4 characters (dal must not become dalchini)
  return [`title:${wild}`, `vendor:${wild}`, `product_type:${term}`, `tag:${term}`];
}

function group(terms: string[], concept?: Concept): string {
  const parts = terms.flatMap(fieldedTerm);
  for (const type of concept?.productTypes ?? []) parts.push(`product_type:"${type}"`);
  for (const tag of concept?.tags ?? []) parts.push(`tag:"${tag}"`);
  return `(${parts.join(" OR ")})`;
}

type TokenGroup = { typed: string; synonyms: string[]; productTypes: string[] };

export type SearchPlan = {
  /** Cleaned user terms (lower-case not forced; used for verification). */
  tokens: string[];
  groups: TokenGroup[];
  exact: string | null;
  synonym: string | null;
  text: string;
  /** Advanced Shopify syntax (field:value, parentheses) is passed through untouched. */
  passthrough: boolean;
};

export function buildSearchPlan(raw: string): SearchPlan {
  const text = raw.trim();
  if (!text) return { tokens: [], groups: [], exact: null, synonym: null, text: "", passthrough: true };
  if (/[:()]/.test(text)) return { tokens: [], groups: [], exact: null, synonym: null, text, passthrough: true };

  const tokens = text.split(/\s+/).map(sanitize).filter((t) => t && !/^(AND|OR|NOT)$/.test(t));
  if (!tokens.length) return { tokens: [], groups: [], exact: null, synonym: null, text, passthrough: true };

  const exact = tokens.map((t) => group([t])).join(" AND ");
  let expanded = false;
  const groups: TokenGroup[] = [];
  const synonym = tokens.map((t) => {
    const key = lookupKey(fold(t));
    if (!key) { groups.push({ typed: t, synonyms: [], productTypes: [] }); return group([t]); }
    expanded = true;
    const extra = SYNONYMS[key] ?? [];
    const terms = [t, ...extra].filter((v, i, a) => a.findIndex((x) => fold(x) === fold(v)) === i);
    // a folded variant of ß/umlaut spellings is searched too (grieß/griess)
    for (const term of [...terms]) { const f = fold(term); if (f !== term.toLowerCase() && !terms.some((x) => x.toLowerCase() === f)) terms.push(f); }
    groups.push({ typed: t, synonyms: terms.filter((x) => x !== t), productTypes: CONCEPTS[key]?.productTypes ?? [] });
    return group(terms, CONCEPTS[key]);
  }).join(" AND ");

  return { tokens, groups, exact, synonym: expanded ? synonym : null, text, passthrough: false };
}

// Ordering inside the exact + synonym results: the typed word as a whole title word beats a prefix, the matching
// Product Type is a strong signal (so "rice" ranks real rice above rice flour), synonyms rank below typed terms.
function score(node: SearchNode, plan: SearchPlan): number {
  const words = fold(node.title).split(/[^a-z0-9]+/).filter(Boolean);
  const typeWords = fold(node.productType ?? "").split(/[^a-z0-9]+/).filter(Boolean);
  let total = 0;
  for (const g of plan.groups) {
    const typed = fold(g.typed);
    if (words.includes(typed)) total += 4;
    else if (words.some((w) => w.startsWith(typed))) total += 2;
    for (const synonym of g.synonyms.map(fold)) {
      if (words.includes(synonym)) { total += 3; break; }
      if (words.some((w) => w.startsWith(synonym))) { total += 2; break; }
    }
    if (typeWords.includes(typed) || g.productTypes.includes(node.productType ?? "")) total += 5;
    if (fold(node.vendor ?? "").startsWith(typed)) total += 1;
  }
  return total;
}

/** True if every typed term appears in the product's customer-visible text (not just in a technical tag). */
export function matchesVisibleText(node: SearchNode, tokens: string[]): boolean {
  const visibleTags = (node.tags ?? []).filter((t) => !TECHNICAL_TAG.test(t));
  const haystack = fold([node.title, node.vendor, node.productType, node.description, ...visibleTags].filter(Boolean).join(" "));
  return tokens.every((t) => haystack.includes(fold(t)));
}

/**
 * Runs the tiers and merges them: exact matches first, then synonym matches, then description/text matches,
 * each product once. A failing fielded tier degrades to the text tier instead of breaking search.
 */
export async function runTieredSearch<T extends SearchNode>(
  raw: string,
  fetchTier: (query: string, tier: SearchTier) => Promise<T[]>
): Promise<T[]> {
  const plan = buildSearchPlan(raw);
  if (!plan.text) return [];
  if (plan.passthrough) return fetchTier(plan.text, "fielded"); // advanced syntax / vendor pages: no description needed

  const safe = async (query: string | null, tier: SearchTier) => {
    if (!query) return [] as T[];
    try { return await fetchTier(query, tier); } catch { return [] as T[]; }
  };
  const [exact, synonym, text] = await Promise.all([
    safe(plan.exact, "fielded"),
    safe(plan.synonym, "fielded"),
    fetchTier(plan.text, "text"),
  ]);

  const seen = new Set<string>();
  const out: T[] = [];
  const push = (nodes: T[]) => { for (const n of nodes) if (!seen.has(n.id)) { seen.add(n.id); out.push(n); } };
  push(exact);
  push(synonym);
  // Best matches first; available products before sold-out ones at the same score; Shopify's order breaks ties.
  const ranked = out
    .map((node, index) => ({ node, index, score: score(node, plan) }))
    .sort((a, b) => b.score - a.score || Number(b.node.availableForSale !== false) - Number(a.node.availableForSale !== false) || a.index - b.index)
    .map((entry) => entry.node);
  const rankedIds = new Set(ranked.map((n) => n.id));
  // Description matches come last, and only if the typed words really appear in visible text (not just in a taxonomy tag).
  const rest = text.filter((n) => !rankedIds.has(n.id) && matchesVisibleText(n, plan.tokens));
  return [...ranked, ...rest];
}

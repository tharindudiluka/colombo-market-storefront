import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { CollectionDiscoveryIcon } from "@/components/CollectionDiscoveryIcon";
import { CollectionDiscoveryTabsClient } from "@/components/CollectionDiscoveryTabsClient";
import { discoveryDepartments, discoveryIcons } from "@/config/collection-discovery";
import { catalogCategoryPresentation, catalogCategoryFallback } from "@/config/catalog-categories";
import type { NavigationEntry } from "@/lib/shopify/navigation";

function handleOf(entry: NavigationEntry) {
  return entry.href.match(/^\/collections\/([^/?#]+)(?:[?#]|$)/)?.[1];
}

function FoodIcon({ entry, light = false }: { entry: NavigationEntry; light?: boolean }) {
  const handle = handleOf(entry) ?? "";
  const icon = discoveryIcons[handle] ?? catalogCategoryPresentation[handle]?.icon ?? catalogCategoryFallback.icon;
  return <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${light ? "bg-white/10 text-category-turmeric" : "bg-category-sage/60 text-brand-teal-dark"}`}><CollectionDiscoveryIcon name={icon} className="h-5 w-5" /></span>;
}

/** Keep children attached to their parent rather than flattening the hierarchy. */
function Subcategories({ entries, compact = false, nested = false }: { entries: NavigationEntry[]; compact?: boolean; nested?: boolean }) {
  const seen = new Set<string>();
  const links = entries.filter(entry => {
    if (!handleOf(entry) || seen.has(entry.href)) return false;
    seen.add(entry.href);
    return true;
  });
  return (
    <ul className={nested ? "ml-4 border-l border-brand-teal/20 pl-3" : compact ? "grid grid-cols-1 items-start gap-x-3 gap-y-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2" : "columns-1 gap-4 md:columns-2 xl:columns-3"}>
      {links.map(entry => <li key={entry.id} className="min-w-0 break-inside-avoid py-1">
        <Link href={entry.href} className={`group flex min-h-12 w-fit max-w-full items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-category-sage/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${nested ? "" : "bg-category-sage/20"}`}>
          {!nested && <FoodIcon entry={entry} />}
          <span className={`min-w-0 text-sm leading-snug text-brand-teal-dark ${compact ? "" : "sm:text-base"} ${entry.children.length ? "font-semibold" : "font-medium"}`}>{entry.title}</span>
          <span aria-hidden="true" className="shrink-0 text-brand-teal/60 transition group-hover:translate-x-1">→</span>
        </Link>
        {entry.children.length > 0 && <Subcategories entries={entry.children} nested />}
      </li>)}
    </ul>
  );
}

/** Smooth banana-leaf, curry-leaf and spice forms share one restrained line weight. */
function TropicalCorner({ section = false }: { section?: boolean }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 400 280" className={section ? "pointer-events-none absolute left-1/2 top-0 hidden h-full w-56 text-brand-teal/5 2xl:block" : "pointer-events-none absolute right-8 top-4 hidden h-64 w-80 text-category-turmeric/20 xl:block"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <g>
      <path fill="currentColor" fillOpacity=".15" d="M320 22C243 26 174 76 165 134C160 162 167 184 187 196C244 191 302 144 319 88C326 65 327 40 320 22Z" />
      <path d="M157 221C194 174 246 104 320 22" />
      <path d="M185 186Q174 162 176 142M203 163Q185 139 189 114M224 136Q205 108 211 86M244 111Q229 84 238 62M265 86Q257 59 265 44M285 62Q283 42 292 31" />
      <path d="M185 186Q217 185 239 170M203 163Q238 163 263 144M224 136Q260 134 284 114M244 111Q279 107 302 84M265 86Q296 77 319 54M285 62Q308 46 320 22" />
    </g>
    <g transform="translate(12 16)">
      <path d="M64 235C75 190 92 147 106 98" />
      <path fill="currentColor" fillOpacity=".12" d="M77 196C53 196 38 178 42 159C62 163 76 177 77 196ZM83 178C104 179 122 163 122 144C100 146 87 159 83 178ZM91 151C69 150 58 134 63 116C80 121 91 134 91 151ZM97 132C116 133 133 119 135 103C115 102 102 116 97 132ZM103 112C87 107 80 93 86 80C101 86 107 99 103 112ZM108 94C124 91 133 79 130 65C115 69 108 80 108 94Z" />
    </g>
    <g transform="translate(215 216) rotate(-8)">
      <path d="M0 8C1 2 13 0 17 5L78 5C85 5 88 10 85 15C82 19 74 18 73 13C72 9 77 7 80 10M0 8L0 17L76 20M17 5L17 13L73 13" />
      <path d="M15 29C16 24 27 23 30 27L91 27C98 28 101 33 97 37C93 41 86 38 86 34C86 30 90 29 93 32M15 29L15 39L89 42M30 27L30 35L86 34" />
    </g>
    <g transform="translate(328 159) rotate(18)">
      <path fill="currentColor" fillOpacity=".1" d="M17 0C-4 15-6 38 16 51C38 36 37 14 17 0Z" />
      <path d="M17 4C12 19 12 34 16 47M19 5C26 20 26 33 18 46M12 10C5 23 6 34 12 41" />
    </g>
  </svg>;
}

export async function CollectionDiscovery({ entries }: { entries: NavigationEntry[] }) {
  const t = await getTranslations("collectionDiscovery");
  const departments = discoveryDepartments.flatMap(department => {
    const entry = entries.find(entry => entry.id === `gid://shopify/MenuItem/${department.menuId}`);
    return entry ? [{ ...department, entry }] : [];
  });
  return (
    <div className="collection-discovery bg-category-peach/20">
      <div className="collection-discovery-inner">
        <div className="relative isolate overflow-clip rounded-2xl bg-brand-teal-dark px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <TropicalCorner />
          <div className="relative max-w-3xl sm:pr-20 lg:pr-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-category-turmeric">{t("eyebrow")}</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{t("title")}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 lg:text-lg">{t("intro")}</p>
          </div>
        </div>
        <CollectionDiscoveryTabsClient
          label={t("jumpLabel")}
          tabs={departments.map(department => ({ key: department.key, title: t(`${department.key}.title`), icon: <span aria-hidden="true"><HomepageCategoryIcon name={department.icon} className="h-4 w-4" /></span> }))}
          panels={departments.map(department => {
          const main = handleOf(department.entry) ? department.entry : "parentHandle" in department
            ? { ...department.entry, href: `/collections/${department.parentHandle}` } : null;
          const grouped = "grouped" in department && department.grouped;
          const children = department.entry.children.filter(entry => entry.href !== main?.href);
          return <section key={department.key} id={`department-${department.key}`} aria-labelledby={`heading-${department.key}`} className="scroll-mt-52 rounded-2xl border border-brand-teal/10 bg-white/95 shadow-sm">
            <div className="relative isolate flex flex-col gap-5 rounded-t-2xl border-b border-brand-teal/10 bg-category-sage/25 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <TropicalCorner section />
              <div className="relative max-w-3xl">
                <div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-category-sage text-brand-teal-dark"><HomepageCategoryIcon name={department.icon} className="h-7 w-7" /></span><h2 id={`heading-${department.key}`} className="font-heading text-2xl font-bold text-brand-teal-dark sm:text-3xl">{t(`${department.key}.title`)}</h2></div>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-teal-dark/75">{t(`${department.key}.intro`)}</p>
              </div>
              {main && <Link href={main.href} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-brand-teal-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-teal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal lg:self-center">{t("viewDepartment")}<span aria-hidden="true">→</span></Link>}
            </div>
            <div className="p-5 sm:p-6">
              <div className={grouped ? "mx-auto grid min-w-0 max-w-screen-2xl gap-5 lg:grid-cols-3 lg:gap-5" : "mx-auto min-w-0 max-w-screen-xl"}>
                {grouped ? department.entry.children.filter(entry => handleOf(entry)).map(group => <div key={group.id} className="min-w-0">
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-brand-teal-dark px-4 py-3"><FoodIcon entry={group} light /><div className="min-w-0"><h3 className="font-heading text-lg font-bold text-white sm:text-xl">{group.title}</h3><Link href={group.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-category-turmeric underline decoration-category-turmeric/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-category-turmeric">{t("viewGroup")}<span aria-hidden="true">→</span></Link></div></div>
                  <Subcategories entries={group.children} compact />
                </div>) : children.length > 0 ? <Subcategories entries={children} /> : main ? <Link href={main.href} className="flex min-h-32 items-center justify-between gap-5 rounded-2xl bg-category-turmeric/40 p-6 text-brand-teal-dark transition hover:bg-category-turmeric/60 focus-visible:outline-2 focus-visible:outline-brand-teal"><div><p className="font-heading text-2xl font-bold">{main.title}</p><p className="mt-2 text-base">{t("offers.action")}</p></div><span aria-hidden="true"><HomepageCategoryIcon name="tag" className="h-12 w-12" /></span></Link> : null}
              </div>
            </div>
          </section>;
          })}
        />
      </div>
    </div>
  );
}

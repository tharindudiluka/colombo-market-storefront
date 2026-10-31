import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

// Root-level fallback: it renders outside the [locale] layout, so it brings its own
// <html>, font and stylesheet, and uses neutral DE/EN copy because no locale is resolved.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootNotFound() {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col">
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <Link href="/" aria-label={site.name} className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
            <Image src={site.logo} alt={site.name} width={96} height={96} priority className="h-20 w-20 object-contain" />
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-brand-terracotta">404</p>
          <h1 className="font-heading mt-3 text-3xl font-extrabold text-brand-teal-dark sm:text-4xl">
            Seite nicht gefunden
          </h1>
          <p className="mt-1 text-lg font-semibold text-brand-teal-dark/70">Page not found</p>
          <p className="mt-4 max-w-md text-base leading-7 text-brand-teal-dark/80">
            Diese Seite gibt es nicht oder sie wurde verschoben.
            <br />
            This page doesn’t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full bg-brand-teal-dark px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-teal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              Zur Startseite
            </Link>
            <Link
              href="/en"
              className="inline-flex min-h-11 items-center rounded-full border border-brand-teal-dark px-6 py-3 text-sm font-bold text-brand-teal-dark transition-colors hover:bg-brand-teal-dark hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              Back to the shop
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

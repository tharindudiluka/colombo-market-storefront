import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main>
          <p>404</p>
          <h1>Page not found</h1>
          <p>The page you requested could not be found.</p>
          <Link href="/">Back to Colombo Market</Link>
        </main>
      </body>
    </html>
  );
}

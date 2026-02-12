import "./globals.css";
import Link from "next/link";
import { CookieBanner } from "@/components/CookieBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1><Link href="/">Filmarchiv</Link></h1>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/privacy">Datenschutz</Link>
            <Link href="/imprint">Impressum</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <CookieBanner />
      </body>
    </html>
  );
}

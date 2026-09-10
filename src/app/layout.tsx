import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "./providers";
import Header from "./components/Header";
import BackToTop from "./components/BackToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookli - Discover Your Next Great Read",
  description:
    "Find your next book, save your favorites, and build your library.",
};

const themeScript = `(function(){try{var s=localStorage.getItem("bookli:theme");var t=s?JSON.parse(s).state.theme:null;if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}

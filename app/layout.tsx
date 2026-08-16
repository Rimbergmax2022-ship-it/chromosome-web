import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const suez = localFont({
  src: "./fonts/SuezOne-Regular.ttf",
  variable: "--font-suez",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "CHROMOSOME · Professional Cosmetics",
  description:
    "כרומוזום — קוסמטיקה מקצועית. טיפוח יוקרתי לידיים, לרגליים ולגוף. חמאות ושמנים טבעיים בכבישה קרה.",
  openGraph: {
    title: "CHROMOSOME · Professional Cosmetics",
    description: "טיפוח יוקרתי מבוסס טבע — קסום בגבול המודרני.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={suez.variable}>
      <body>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}

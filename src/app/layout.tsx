import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BadgeModal } from "@/components/BadgeModal";
import { UserProvider } from "@/context/UserContext";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLR — Bengaluru Exploration Platform",
  description: "Independent urban culture publication & real-world exploration game for Bengaluru. Hidden corners, curated quests, real-world check-ins, and neighborhood culture.",
  keywords: ["Bengaluru", "Bangalore", "Quests", "City Guide", "Urban Exploration", "Cubbon Park", "Church Street", "Indiranagar", "VV Puram"],
  openGraph: {
    title: "BLR — Bengaluru Exploration Platform",
    description: "Your city isn't finished. Discover Bengaluru through curated routes and real-world quests.",
    siteName: "BLR",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#10110F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable} h-full bg-[#10110F] text-[#F1EBDD]`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#D8F45A] selection:text-[#10110F] antialiased">
        <UserProvider>
          <Navigation />
          <BadgeModal />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}

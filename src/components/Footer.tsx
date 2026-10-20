import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#262724] bg-[#10110F] pt-12 pb-16 text-[#AAA99F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-bebas)] text-3xl font-extrabold text-[#F1EBDD] tracking-tight">
                BLR
              </span>
              <div className="flex h-5 w-5 items-center justify-center border border-[#262724] bg-[#171815]">
                <div className="h-2 w-2 bg-[#D8F45A]" />
              </div>
            </div>
            <p className="font-mono text-xs leading-relaxed text-[#AAA99F]">
              Bengaluru Urban Exploration Platform. Part independent city archive, part real-world geo-exploration game.
            </p>
            <div className="font-mono text-[11px] text-[#D8F45A]">
              12.9716° N, 77.5946° E • ALT 920M
            </div>
          </div>

          {/* Editorial Sections */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F1EBDD] mb-4">
              01 // INDEX
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <Link href="/explore" className="hover:text-[#D8F45A] transition-colors">
                  Interactive City Map
                </Link>
              </li>
              <li>
                <Link href="/quests" className="hover:text-[#D8F45A] transition-colors">
                  Curated Quests
                </Link>
              </li>
              <li>
                <Link href="/places" className="hover:text-[#D8F45A] transition-colors">
                  Documented Places
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[#D8F45A] transition-colors">
                  Explorer Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Neighborhoods */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F1EBDD] mb-4">
              02 // SECTORS
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex justify-between items-center pr-4">
                <span>Central Business District</span>
                <span className="text-[#686760]">560001</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Basavanagudi & Gandhi Bazaar</span>
                <span className="text-[#686760]">560004</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Indiranagar & HAL 2nd Stage</span>
                <span className="text-[#686760]">560038</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Malleswaram Heritage</span>
                <span className="text-[#686760]">560003</span>
              </li>
            </ul>
          </div>

          {/* Ethics & Verification */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F1EBDD] mb-4">
              03 // DISCLOSURE
            </h4>
            <p className="font-mono text-xs leading-relaxed text-[#AAA99F]">
              All place information is verified by human contributors. No fabricated footfall statistics or AI hallucinated hours. Coordinates are referenced against public GIS datum.
            </p>
            <div className="mt-4 pt-4 border-t border-[#262724] font-mono text-[10px] text-[#686760]">
              EST. BENGALURU • V2.4 RELEASE
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#262724] pt-6 font-mono text-xs sm:flex-row">
          <div>
            © {new Date().getFullYear()} BLR EXPLORATION PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div className="mt-3 sm:mt-0 flex gap-4 text-[11px]">
            <span className="text-[#D8F45A]">NO COOKIES COLLECTED</span>
            <span>•</span>
            <span className="text-[#AAA99F]">CLIENT PERSISTENCE ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";

export function ClosingCTA() {
  return (
    <section className="border-b border-[#262724] bg-[#171815] py-16 sm:py-24 text-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 border border-[#262724] bg-[#10110F] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#D8F45A]">
          <span>FINAL DISPATCH // INITIATE EXPEDITION</span>
        </div>

        <h2 className="mt-5 font-[family-name:var(--font-bebas)] text-5xl font-extrabold tracking-tight text-[#F1EBDD] sm:text-7xl md:text-8xl">
          THE PAVEMENTS ARE WAITING.
        </h2>

        <p className="mx-auto mt-4 max-w-xl font-mono text-xs sm:text-sm leading-relaxed text-[#AAA99F]">
          Put away algorithmic feeds. Take the Namma Metro to MG Road, step onto the cobblestones of Church Street, and discover the living heartbeat of the 560001.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="group inline-flex min-h-[48px] items-center gap-3 bg-[#D8F45A] px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#10110F] transition-colors hover:bg-[#cbf033]"
          >
            <Compass size={16} className="transition-transform group-hover:rotate-45" />
            <span>LAUNCH CITY EXPLORER</span>
            <ArrowUpRight size={15} />
          </Link>

          <Link
            href="/leaderboard"
            className="inline-flex min-h-[48px] items-center gap-2 border border-[#262724] bg-[#10110F] px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#F1EBDD] hover:border-[#D8F45A] hover:text-[#D8F45A] transition-colors"
          >
            <span>VIEW LEADERBOARD</span>
          </Link>
        </div>

        <div className="mt-10 font-mono text-[10px] uppercase text-[#686760]">
          CITIZEN CARTOGRAPHY PROTOCOL • VERIFIED LOCATIONS ONLY
        </div>
      </div>
    </section>
  );
}

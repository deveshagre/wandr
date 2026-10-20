import React from "react";
import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      protocol: "PHASE I: CARTOGRAPHIC RECONNAISSANCE",
      title: "EXPLORE",
      summary: "Living city index & uncurated alleys",
      details: "Query by sector, architectural epoch, or filter by cultural category. Follow curated expedition routes designed by local urban researchers.",
    },
    {
      num: "02",
      protocol: "PHASE II: PHYSICAL GEODATA AUDIT",
      title: "CHECK IN",
      summary: "Dual-mode geolocation confirmation",
      details: "Reach physical coordinates. Verify your presence via device GPS sensors or log dispatches using our client field emulator.",
    },
    {
      num: "03",
      protocol: "PHASE III: CITIZEN ARCHIVE XP",
      title: "EARN XP",
      summary: "Unseal archival badges & elevations",
      details: "Earn 50 to 450 XP per station. Progress through five explorer ranks: from Novice Flâneur to Sovereign of Bengaluru.",
    },
    {
      num: "04",
      protocol: "PHASE IV: CULTURAL EXPEDITION BOARD",
      title: "COMPETE",
      summary: "Weekly & all-time city rankings",
      details: "Measure routes against Bengaluru's top flâneurs, cyclists, and coffee connoisseurs. Compare passport stamps and verified dispatches.",
    },
  ];

  return (
    <section className="border-b border-[#262724] bg-[#10110F] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-[#262724] pb-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
            <span className="inline-block h-2 w-2 bg-[#D8F45A]" />
            <span>04 // SYSTEM PROTOCOL</span>
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl font-extrabold tracking-wide text-[#F1EBDD] sm:text-5xl md:text-6xl">
            HOW THE BLR GAME WORKS
          </h2>
          <p className="mt-1 font-mono text-xs text-[#AAA99F] max-w-xl">
            A real-world urban exploration mechanic with zero bloatware or paywalls.
          </p>
        </div>

        {/* 4 Editorial Ledger Columns */}
        <div className="mt-8 grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-[#262724] border border-[#262724] bg-[#171815] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col justify-between p-6 sm:p-7 transition-colors hover:bg-[#1a1b18]"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs border-b border-[#262724] pb-3 mb-6">
                  <span className="font-mono text-xs uppercase text-[#AAA99F]">
                    {step.protocol}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#D8F45A]">
                    {step.num}
                  </span>
                </div>

                <div className="font-[family-name:var(--font-bebas)] text-6xl font-extrabold text-[#F1EBDD] tracking-tight leading-none">
                  {step.title}
                </div>

                <div className="mt-2 font-mono text-xs font-bold text-[#D8F45A]">
                  {step.summary}
                </div>

                <p className="mt-3 font-mono text-xs leading-relaxed text-[#AAA99F]">
                  {step.details}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#262724] flex items-center justify-between font-mono text-[10px] text-[#686760]">
                <span>RULE {step.num} OF 04</span>
                <ArrowRight size={13} className="text-[#D8F45A]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

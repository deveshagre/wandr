"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative border-b border-[#262724] bg-[#10110F] pt-6 pb-12 sm:pt-10 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Dateline Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262724] pb-3 mb-6">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-[#AAA99F]">
            <span className="inline-block h-2 w-2 bg-[#D8F45A]" />
            <span>DISPATCH NO. 04 — OCT 2026</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#AAA99F]">
            <span className="text-[#F1EBDD] font-bold">BENGALURU</span>
            <span>•</span>
            <span>12.9716° N, 77.5946° E</span>
            <span>•</span>
            <span className="text-[#D8F45A]">ELEV 920M</span>
          </div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Main Editorial Masthead Column */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="inline-block border border-[#262724] bg-[#171815] px-2.5 py-1 mb-4 font-mono text-[10px] uppercase tracking-widest text-[#AAA99F]">
                INDEPENDENT CULTURAL CHRONICLE
              </div>
              <h1 className="font-[family-name:var(--font-bebas)] text-6xl font-extrabold leading-[0.85] tracking-tight text-[#F1EBDD] sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem]">
                YOUR CITY <br />
                ISN&apos;T <span className="text-[#D8F45A]">FINISHED.</span>
              </h1>
              <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-[#AAA99F] sm:text-base">
                Hidden corners. New routes. Real experiences. An art-directed field journal for the flâneurs, bean roasters, cyclists, and nocturnal walkers of Bengaluru.
              </p>
            </div>

            {/* CTAs and Ground Truth Notice */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/explore"
                  className="group inline-flex min-h-[48px] items-center gap-3 bg-[#D8F45A] px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#10110F] transition-colors hover:bg-[#cbf033]"
                >
                  <Compass size={16} className="transition-transform group-hover:rotate-45" />
                  <span>EXPLORE THE CITY</span>
                  <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/quests"
                  className="inline-flex min-h-[48px] items-center gap-2 border border-[#262724] bg-[#171815] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#F1EBDD] transition-colors hover:border-[#D8F45A] hover:text-[#D8F45A]"
                >
                  <span>BROWSE QUESTS</span>
                  <span className="font-mono text-xs text-[#D8F45A]">(3)</span>
                </Link>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-[#686760]">
                <ShieldCheck size={14} className="text-[#D8F45A] shrink-0" />
                <span>Zero algorithmic hallucination. Ground-verified coordinates & physical check-ins.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Full-Bleed High-Contrast Photography */}
          <div className="relative flex flex-col lg:col-span-5">
            <div className="relative h-[320px] w-full overflow-hidden border border-[#262724] bg-[#171815] sm:h-[400px] lg:h-full">
              <img
                src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80"
                alt="Bengaluru Cubbon Park and street landscape"
                className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 hover:grayscale-0"
              />

              {/* Editorial Frame Stamps */}
              <div className="absolute top-3 left-3 border border-[#262724] bg-[#10110F] px-2.5 py-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#D8F45A]">
                  FIG. 01 // CUBBON CORRIDOR
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between border border-[#262724] bg-[#10110F] p-3">
                <div>
                  <div className="font-mono text-xs font-bold text-[#F1EBDD]">
                    CENTRAL CANOPY ARTERY
                  </div>
                  <div className="font-mono text-[10px] text-[#AAA99F]">
                    Kasturba Road • Tabebuia & Bamboo Groves
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-[#D8F45A]">
                  EST. 1870
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Verified Ledger Statistics */}
        <div className="mt-10 grid grid-cols-2 gap-px bg-[#262724] sm:grid-cols-4 border border-[#262724]">
          <div className="bg-[#10110F] p-4 sm:p-5">
            <div className="font-[family-name:var(--font-bebas)] text-4xl text-[#F1EBDD] leading-none">
              13
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-[#AAA99F]">
              Verified Landmarks
            </div>
            <div className="font-mono text-[10px] text-[#686760]">Curated & Fact-Checked</div>
          </div>

          <div className="bg-[#10110F] p-4 sm:p-5">
            <div className="font-[family-name:var(--font-bebas)] text-4xl text-[#F1EBDD] leading-none">
              03
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-[#AAA99F]">
              Active Expeditions
            </div>
            <div className="font-mono text-[10px] text-[#686760]">11 Total Checkpoints</div>
          </div>

          <div className="bg-[#10110F] p-4 sm:p-5">
            <div className="font-[family-name:var(--font-bebas)] text-4xl text-[#F1EBDD] leading-none">
              1,100 XP
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-[#AAA99F]">
              Reward Pool
            </div>
            <div className="font-mono text-[10px] text-[#686760]">Badges & Rank Promotions</div>
          </div>

          <div className="bg-[#10110F] p-4 sm:p-5">
            <div className="font-[family-name:var(--font-bebas)] text-4xl text-[#D8F45A] leading-none">
              560001
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-[#AAA99F]">
              Central Postal Grid
            </div>
            <div className="font-mono text-[10px] text-[#686760]">Latitude 12.9716° N</div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { QUESTS } from "@/data/quests";
import { useUser } from "@/context/UserContext";
import { Clock, MapPin, Award, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";

export function FeaturedQuests() {
  const { getQuestProgress, isQuestCompleted } = useUser();

  const questAhr = QUESTS.find((q) => q.id === "after-hours-route") || QUESTS[0];
  const questPnp = QUESTS.find((q) => q.id === "parks-and-palaces") || QUESTS[1];
  const questCc = QUESTS.find((q) => q.id === "cafe-crawl") || QUESTS[2];

  const ahrProgress = getQuestProgress(questAhr.id);
  const ahrCompleted = isQuestCompleted(questAhr.id);

  const pnpProgress = getQuestProgress(questPnp.id);
  const pnpCompleted = isQuestCompleted(questPnp.id);

  const ccProgress = getQuestProgress(questCc.id);
  const ccCompleted = isQuestCompleted(questCc.id);

  return (
    <section className="border-b border-[#262724] bg-[#10110F] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#262724] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
              <span>02 // FIELD EXPEDITIONS</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl font-extrabold tracking-wide text-[#F1EBDD] sm:text-5xl md:text-6xl">
              CURATED CITY QUESTS
            </h2>
            <p className="mt-1 font-mono text-xs text-[#AAA99F] max-w-xl">
              Sequenced narrative trails connecting colonial institutions, underground book houses, and third-wave roasters.
            </p>
          </div>

          <Link
            href="/quests"
            className="inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#D8F45A] hover:underline"
          >
            <span>VIEW ALL EXPEDITIONS</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Asymmetrical Editorial Quests Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Lead Quest 01: The After-Hours Route (7 Columns) */}
          <Link
            href={`/quests/${questAhr.id}`}
            className="group relative flex flex-col justify-between border border-[#262724] bg-[#171815] transition-colors hover:border-[#D8F45A] lg:col-span-7"
            aria-label={`View Quest: ${questAhr.title}`}
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between border-b border-[#262724] bg-[#10110F] px-5 py-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D8F45A]">
                  PRIMARY EXPEDITION // 01
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  {ahrCompleted ? (
                    <span className="flex items-center gap-1 text-[#D8F45A] font-bold">
                      <CheckCircle2 size={12} />
                      COMPLETED
                    </span>
                  ) : ahrProgress.completed > 0 ? (
                    <span className="text-[#D8F45A]">
                      {ahrProgress.completed}/{ahrProgress.total} CHECKPOINTS
                    </span>
                  ) : (
                    <span className="text-[#AAA99F] border border-[#262724] px-1.5 py-0.5">
                      {questAhr.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Full Bleed Lead Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#10110F]">
                <img
                  src={questAhr.imageUrl}
                  alt={questAhr.title}
                  className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between border border-[#262724] bg-[#10110F] p-2.5 font-mono text-xs">
                  <span className="flex items-center gap-1.5 text-[#AAA99F]">
                    <MapPin size={13} className="text-[#D8F45A]" />
                    {questAhr.neighborhood}
                  </span>
                  <span className="flex items-center gap-1 text-[#D8F45A] font-bold">
                    <Zap size={13} />
                    +{questAhr.rewardXp} XP
                  </span>
                </div>
              </div>

              {/* Editorial Body */}
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl font-extrabold tracking-wide text-[#F1EBDD] transition-colors group-hover:text-[#D8F45A]">
                  {questAhr.title}
                </h3>
                <p className="mt-1 font-mono text-xs italic text-[#AAA99F]">
                  &ldquo;{questAhr.subtitle}&rdquo;
                </p>
                <p className="mt-3 font-mono text-xs leading-relaxed text-[#AAA99F]">
                  {questAhr.description}
                </p>

                {/* Waypoint Sequence Ticker */}
                <div className="mt-5 border border-[#262724] bg-[#10110F] p-3">
                  <div className="font-mono text-[10px] uppercase text-[#AAA99F] mb-2">
                    SEQUENTIAL CHECKPOINT WAYPOINTS
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-[#F1EBDD] sm:grid-cols-4">
                    {questAhr.stops.map((stop, sIdx) => (
                      <div key={stop.id} className="border-l border-[#D8F45A] pl-2">
                        <span className="text-[9px] text-[#686760] block">0{sIdx + 1}</span>
                        <span className="truncate block font-semibold">{stop.placeName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between border-t border-[#262724] bg-[#10110F] px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-4 text-[#AAA99F]">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  2h 30m
                </span>
                <span>•</span>
                <span>4 CHECKPOINTS</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-[#D8F45A] group-hover:translate-x-1 transition-transform">
                <span>ENTER ROUTE</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Secondary Stack (5 Columns) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Quest 02: Parks & Palaces */}
            <Link
              href={`/quests/${questPnp.id}`}
              className="group flex flex-1 flex-col justify-between border border-[#262724] bg-[#171815] transition-colors hover:border-[#D8F45A]"
              aria-label={`View Quest: ${questPnp.title}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#262724] bg-[#10110F] px-4 py-2.5">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#AAA99F]">
                    EXPEDITION // 02
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    {pnpCompleted ? (
                      <span className="flex items-center gap-1 text-[#D8F45A] font-bold">
                        <CheckCircle2 size={11} />
                        DONE
                      </span>
                    ) : pnpProgress.completed > 0 ? (
                      <span className="text-[#D8F45A]">
                        {pnpProgress.completed}/{pnpProgress.total} STOPS
                      </span>
                    ) : null}
                    <span className="text-xs font-bold text-[#D8F45A]">
                      +{questPnp.rewardXp} XP
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                  <div className="relative h-44 sm:h-auto sm:col-span-5 overflow-hidden bg-[#10110F]">
                    <img
                      src={questPnp.imageUrl}
                      alt={questPnp.title}
                      className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:col-span-7 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#AAA99F]">
                        {questPnp.neighborhood}
                      </span>
                      <h3 className="font-[family-name:var(--font-bebas)] text-2xl font-bold tracking-wide text-[#F1EBDD] transition-colors group-hover:text-[#D8F45A] mt-0.5">
                        {questPnp.title}
                      </h3>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#AAA99F] line-clamp-3">
                        {questPnp.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-[#D8F45A]">
                      <Award size={12} />
                      <span>BADGE: {questPnp.badgeName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#262724] bg-[#10110F] px-4 py-2 font-mono text-xs">
                <span className="text-[#AAA99F]">3h 30m • 4 STOPS</span>
                <span className="font-bold text-[#D8F45A] flex items-center gap-1">
                  <span>DISPATCH</span>
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>

            {/* Quest 03: Café Crawl */}
            <Link
              href={`/quests/${questCc.id}`}
              className="group flex flex-1 flex-col justify-between border border-[#262724] bg-[#171815] transition-colors hover:border-[#D8F45A]"
              aria-label={`View Quest: ${questCc.title}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#262724] bg-[#10110F] px-4 py-2.5">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#AAA99F]">
                    EXPEDITION // 03
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    {ccCompleted ? (
                      <span className="flex items-center gap-1 text-[#D8F45A] font-bold">
                        <CheckCircle2 size={11} />
                        DONE
                      </span>
                    ) : ccProgress.completed > 0 ? (
                      <span className="text-[#D8F45A]">
                        {ccProgress.completed}/{ccProgress.total} STOPS
                      </span>
                    ) : null}
                    <span className="text-xs font-bold text-[#D8F45A]">
                      +{questCc.rewardXp} XP
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                  <div className="relative h-44 sm:h-auto sm:col-span-5 overflow-hidden bg-[#10110F]">
                    <img
                      src={questCc.imageUrl}
                      alt={questCc.title}
                      className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:col-span-7 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#AAA99F]">
                        {questCc.neighborhood}
                      </span>
                      <h3 className="font-[family-name:var(--font-bebas)] text-2xl font-bold tracking-wide text-[#F1EBDD] transition-colors group-hover:text-[#D8F45A] mt-0.5">
                        {questCc.title}
                      </h3>
                      <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#AAA99F] line-clamp-3">
                        {questCc.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-[#D8F45A]">
                      <Award size={12} />
                      <span>BADGE: {questCc.badgeName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#262724] bg-[#10110F] px-4 py-2 font-mono text-xs">
                <span className="text-[#AAA99F]">3h 00m • 3 STOPS</span>
                <span className="font-bold text-[#D8F45A] flex items-center gap-1">
                  <span>DISPATCH</span>
                  <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

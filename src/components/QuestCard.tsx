"use client";

import React from "react";
import Link from "next/link";
import { Quest } from "@/types";
import { useUser } from "@/context/UserContext";
import { Clock, MapPin, Award, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  index: number;
}

export function QuestCard({ quest, index }: QuestCardProps) {
  const { getQuestProgress, isQuestCompleted } = useUser();
  const progress = getQuestProgress(quest.id);
  const completed = isQuestCompleted(quest.id);

  return (
    <Link
      href={`/quests/${quest.id}`}
      className="group relative flex flex-col justify-between border border-[#262724] bg-[#171815] transition-colors hover:border-[#D8F45A]"
      aria-label={`View Quest: ${quest.title}`}
    >
      {/* Top Numbered Header & Metadata */}
      <div>
        <div className="flex items-center justify-between border-b border-[#262724] px-4 py-2.5 bg-[#10110F]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#AAA99F]">
            EXPEDITION // 0{index + 1}
          </span>
          <div className="flex items-center gap-2">
            {completed ? (
              <span className="flex items-center gap-1 font-mono text-[10px] text-[#D8F45A] font-bold">
                <CheckCircle2 size={12} />
                COMPLETED
              </span>
            ) : progress.completed > 0 ? (
              <span className="font-mono text-[10px] text-[#D8F45A] bg-[#171815] px-2 py-0.5 border border-[#262724]">
                {progress.completed}/{progress.total} STOPS
              </span>
            ) : (
              <span className="font-mono text-[10px] text-[#AAA99F] border border-[#262724] px-1.5 py-0.5">
                {quest.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Quest Image */}
        <div className="relative h-52 w-full overflow-hidden bg-[#10110F] border-b border-[#262724]">
          <img
            src={quest.imageUrl}
            alt={quest.title}
            className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between border border-[#262724] bg-[#10110F]/95 p-2 font-mono text-[11px] text-[#F1EBDD]">
            <span className="flex items-center gap-1 text-[#AAA99F]">
              <MapPin size={12} className="text-[#D8F45A]" />
              {quest.neighborhood}
            </span>
            <span className="flex items-center gap-1 text-[#D8F45A] font-bold">
              <Zap size={12} />
              +{quest.rewardXp} XP
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="font-[family-name:var(--font-bebas)] text-2xl sm:text-3xl font-bold tracking-wide text-[#F1EBDD] transition-colors group-hover:text-[#D8F45A]">
            {quest.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-[#AAA99F] italic line-clamp-1">
            &ldquo;{quest.subtitle}&rdquo;
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-[#AAA99F] line-clamp-2">
            {quest.description}
          </p>

          {/* Badge Preview */}
          <div className="mt-4 flex items-center gap-2.5 border border-[#262724] bg-[#10110F] px-3 py-2">
            <Award size={14} className="text-[#D8F45A] shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase text-[#AAA99F]">BADGE REWARD</span>
              <span className="font-mono text-xs font-semibold text-[#F1EBDD]">{quest.badgeName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Stops, Duration & Action Link */}
      <div className="border-t border-[#262724] px-5 py-3 bg-[#10110F] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-4 text-[#AAA99F]">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {Math.floor(quest.durationMinutes / 60)}h {quest.durationMinutes % 60}m
          </span>
          <span>•</span>
          <span>{quest.stopsCount} STOPS</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#D8F45A] group-hover:translate-x-1 transition-transform">
          <span>ENTER</span>
          <ArrowUpRight size={13} />
        </div>
      </div>
    </Link>
  );
}

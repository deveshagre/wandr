"use client";

import React from "react";
import { QUESTS } from "@/data/quests";
import { QuestCard } from "@/components/QuestCard";
import { useUser } from "@/context/UserContext";
import { Sparkles } from "lucide-react";

export default function QuestsPage() {
  const { user } = useUser();

  const totalPossibleXp = QUESTS.reduce((acc, q) => acc + q.rewardXp, 0);

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon */}
        <div className="border-b border-[#262724] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
            <Sparkles size={14} />
            <span>COMMISSIONED EXPEDITIONS</span>
          </div>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl font-extrabold tracking-wide sm:text-6xl md:text-7xl">
            BENGALURU CITY QUESTS
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-[#AAA99F]">
            Handcrafted narrative trails across the cultural landscape of Bengaluru. Follow sequenced coordinates, verify your stops, collect rare explorer badges, and uncover what guidebooks miss.
          </p>

          {/* User Progress Metric Strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 border border-[#262724] bg-[#171815] p-4 sm:grid-cols-4">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">COMPLETED QUESTS</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#D8F45A]">
                {user.completedQuestIds.length} / {QUESTS.length}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">ACTIVE CAMPAIGNS</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#F1EBDD]">
                {Object.keys(user.activeQuestProgress).length}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">QUEST XP POOL</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#D8F45A]">
                {totalPossibleXp} XP
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">YOUR LEVEL</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#F1EBDD]">
                L{user.level} {user.rankTitle}
              </div>
            </div>
          </div>
        </div>

        {/* Quests Cards List */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {QUESTS.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index} />
          ))}
        </div>

        {/* Protocol Notice */}
        <div className="mt-16 border border-[#262724] bg-[#171815] p-6 text-center font-mono text-xs text-[#AAA99F]">
          <div className="font-bold text-[#F1EBDD] uppercase">EXPEDITION PROTOCOL</div>
          <p className="mt-1 max-w-xl mx-auto text-[#686760]">
            Location verification requires physical proximity or verification through the field action logger. Battery-efficient geofencing is implemented.
          </p>
        </div>
      </div>
    </div>
  );
}

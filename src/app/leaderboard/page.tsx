"use client";

import React, { useState } from "react";
import { WEEKLY_LEADERBOARD, ALL_TIME_LEADERBOARD } from "@/data/leaderboard";
import { useUser } from "@/context/UserContext";
import { Trophy, Award, Flame } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"weekly" | "allTime">("weekly");
  const { user } = useUser();

  const sortedList = React.useMemo(() => {
    const baseList = tab === "weekly" ? WEEKLY_LEADERBOARD : ALL_TIME_LEADERBOARD;
    const list = baseList.map((entry) => {
      if (entry.isCurrentUser) {
        return {
          ...entry,
          displayName: user.displayName,
          xp: user.totalXp,
          completedQuests: user.completedQuestIds.length,
          badgesCount: user.unlockedBadges.length,
        };
      }
      return entry;
    });

    list.sort((a, b) => b.xp - a.xp);
    return list.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }, [tab, user]);

  const userEntry = sortedList.find((e) => e.isCurrentUser);
  const currentUserRank = userEntry?.rank || 1;

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon */}
        <div className="border-b border-[#262724] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
            <Trophy size={14} />
            <span>EXPLORATION ROSTER</span>
          </div>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl font-extrabold tracking-wide sm:text-6xl md:text-7xl">
            CITY LEADERBOARD
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-[#AAA99F]">
            Rankings calculated solely through verified checkpoints, completed quest routes, and documented city dispatches. No pay-to-win, zero algorithm spoofing.
          </p>

          {/* Timeframe Selector Tabs */}
          <div className="mt-8 flex items-center gap-2">
            <button
              onClick={() => setTab("weekly")}
              className={`min-h-[44px] flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-5 py-2.5 border transition-colors ${
                tab === "weekly"
                  ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                  : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:border-[#D8F45A] hover:text-[#F1EBDD]"
              }`}
            >
              <Flame size={14} />
              <span>WEEKLY CYCLE (OCT 2026)</span>
            </button>
            <button
              onClick={() => setTab("allTime")}
              className={`min-h-[44px] flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-5 py-2.5 border transition-colors ${
                tab === "allTime"
                  ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                  : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:border-[#D8F45A] hover:text-[#F1EBDD]"
              }`}
            >
              <Award size={14} />
              <span>ALL-TIME ROLL OF HONOUR</span>
            </button>
          </div>
        </div>

        {/* Current User Quick Ranking Card */}
        <div className="mt-8 border border-[#D8F45A] bg-[#171815] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#D8F45A] text-[#10110F] font-mono text-sm font-bold">
              L{user.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-[family-name:var(--font-bebas)] text-2xl text-[#F1EBDD]">
                  {user.displayName}
                </span>
                <span className="bg-[#D8F45A]/20 text-[#D8F45A] px-2 py-0.5 font-mono text-[9px] uppercase border border-[#D8F45A]/40">
                  YOU
                </span>
              </div>
              <p className="font-mono text-xs text-[#AAA99F]">
                @{user.handle} • {user.rankTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#AAA99F] block">YOUR RANK</span>
              <span className="text-base font-bold text-[#D8F45A]">#{currentUserRank}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#AAA99F] block">TOTAL XP</span>
              <span className="text-base font-bold text-[#D8F45A]">{user.totalXp} XP</span>
            </div>
            <div>
              <span className="text-[10px] text-[#AAA99F] block">BADGES</span>
              <span className="text-base font-bold text-[#F1EBDD]">{user.unlockedBadges.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#AAA99F] block">QUESTS</span>
              <span className="text-base font-bold text-[#F1EBDD]">{user.completedQuestIds.length}</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="mt-8 border border-[#262724] bg-[#171815] overflow-hidden">
          {/* Table Header (Hidden on smallest mobile) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[#262724] bg-[#10110F] p-4 font-mono text-[10px] uppercase tracking-wider text-[#AAA99F]">
            <div className="col-span-1 text-center">RANK</div>
            <div className="col-span-5">EXPLORER & SECTOR</div>
            <div className="col-span-2 text-center">QUESTS</div>
            <div className="col-span-2 text-center">BADGES</div>
            <div className="col-span-2 text-right">XP POINTS</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#262724]">
            {sortedList.map((entry) => {
              const isUser = entry.isCurrentUser;
              return (
                <div
                  key={entry.handle}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 items-center transition-colors ${
                    isUser
                      ? "bg-[#D8F45A]/10 border-l-4 border-l-[#D8F45A]"
                      : "hover:bg-[#1f201c]"
                  }`}
                >
                  {/* Rank */}
                  <div className="sm:col-span-1 flex items-center sm:justify-center gap-2">
                    <span
                      className={`font-mono text-sm font-bold flex h-7 w-7 items-center justify-center ${
                        entry.rank === 1
                          ? "bg-[#D8F45A] text-[#10110F]"
                          : entry.rank === 2
                          ? "bg-[#EAE3D2] text-[#10110F]"
                          : entry.rank === 3
                          ? "bg-[#A39682] text-[#10110F]"
                          : "text-[#AAA99F] border border-[#262724]"
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <span className="sm:hidden font-mono text-xs text-[#AAA99F]">
                      RANK #{entry.rank}
                    </span>
                  </div>

                  {/* Explorer Handle & Neighborhood */}
                  <div className="sm:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-bebas)] text-xl text-[#F1EBDD]">
                        {isUser ? user.displayName : entry.displayName}
                      </span>
                      {isUser && (
                        <span className="bg-[#D8F45A] text-[#10110F] px-1.5 py-0.2 font-mono text-[9px] font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-[#AAA99F]">
                      @{entry.handle} • {entry.neighborhood}
                    </div>
                  </div>

                  {/* Quests completed */}
                  <div className="sm:col-span-2 sm:text-center font-mono text-xs flex justify-between sm:block">
                    <span className="sm:hidden text-[#AAA99F]">Completed Quests:</span>
                    <span className="text-[#F1EBDD] font-bold">{entry.completedQuests}</span>
                  </div>

                  {/* Badges count */}
                  <div className="sm:col-span-2 sm:text-center font-mono text-xs flex justify-between sm:block">
                    <span className="sm:hidden text-[#AAA99F]">Badges Unlocked:</span>
                    <span className="text-[#F1EBDD] font-bold">{entry.badgesCount}</span>
                  </div>

                  {/* XP Points */}
                  <div className="sm:col-span-2 sm:text-right font-mono text-xs flex justify-between sm:block">
                    <span className="sm:hidden text-[#AAA99F]">Experience:</span>
                    <span className="text-base font-bold text-[#D8F45A]">
                      {isUser ? user.totalXp : entry.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 border-t border-[#262724] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#AAA99F]">
          <span>WEEKLY REFRESH EVERY SUNDAY 23:59 IST</span>
          <Link
            href="/explore"
            className="mt-2 sm:mt-0 text-[#D8F45A] hover:underline flex items-center gap-1"
          >
            <span>Start earning XP on the Map</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QUESTS } from "@/data/quests";
import { useUser } from "@/context/UserContext";
import { 
  ArrowLeft, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  ShieldCheck,
  Compass,
  Zap
} from "lucide-react";

export default function QuestDetailPage() {
  const params = useParams();
  const questId = params.id as string;
  const quest = QUESTS.find((q) => q.id === questId);

  const { 
    user, 
    startQuest, 
    completeQuestStop, 
    isQuestStarted, 
    isQuestCompleted,
    getQuestProgress 
  } = useUser();

  const [activeStopCheckingIn, setActiveStopCheckingIn] = useState<string | null>(null);
  const [stopMessage, setStopMessage] = useState<{ [stopId: string]: string }>({});

  if (!quest) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-mono">
        <h2 className="text-2xl font-bold text-[#F1EBDD]">QUEST NOT FOUND</h2>
        <p className="mt-2 text-xs text-[#AAA99F]">The requested expedition does not exist in the BLR registry.</p>
        <Link
          href="/quests"
          className="mt-6 bg-[#D8F45A] px-4 py-2 text-xs font-bold uppercase text-[#10110F]"
        >
          Return to Quests
        </Link>
      </div>
    );
  }

  const isStarted = isQuestStarted(quest.id);
  const isCompleted = isQuestCompleted(quest.id);
  const progress = getQuestProgress(quest.id);
  const currentProgress = user.activeQuestProgress[quest.id];
  const completedStopIds = currentProgress?.completedStopIds || [];

  const handleStartOrContinue = () => {
    if (!isStarted) {
      startQuest(quest.id);
    }
  };

  const handleStopCheckIn = async (stopId: string, bypassGps: boolean) => {
    setActiveStopCheckingIn(stopId);
    setStopMessage((prev) => ({
      ...prev,
      [stopId]: "",
    }));

    const res = await completeQuestStop(quest.id, stopId, bypassGps);
    setStopMessage((prev) => ({
      ...prev,
      [stopId]: res.message,
    }));
    setActiveStopCheckingIn(null);
  };

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] pb-24">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-[#262724] bg-[#171815] py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/quests"
            className="flex items-center gap-1.5 font-mono text-xs uppercase text-[#AAA99F] hover:text-[#D8F45A] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL QUESTS</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#AAA99F]">DIFFICULTY:</span>
            <span className="font-bold text-[#D8F45A]">{quest.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Hero Section of Quest */}
        <div className="border border-[#262724] bg-[#171815]">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={quest.imageUrl}
              alt={quest.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171815] via-[#171815]/50 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
                <MapPin size={14} />
                <span>{quest.neighborhood}</span>
              </div>
              <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl font-extrabold tracking-wide sm:text-5xl md:text-6xl text-[#F1EBDD]">
                {quest.title}
              </h1>
              <p className="mt-1 font-mono text-xs italic text-[#AAA99F]">
                &ldquo;{quest.subtitle}&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262724] border-t border-[#262724] bg-[#10110F] p-4 text-center">
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">EST. DURATION</div>
              <div className="font-mono text-base font-bold text-[#F1EBDD] mt-1">
                {Math.floor(quest.durationMinutes / 60)}h {quest.durationMinutes % 60}m
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">TOTAL CHECKPOINTS</div>
              <div className="font-mono text-base font-bold text-[#F1EBDD] mt-1">
                {quest.stopsCount} STOPS
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">REWARD POOL</div>
              <div className="font-mono text-base font-bold text-[#D8F45A] mt-1">
                +{quest.rewardXp} XP
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">COMPLETION BADGE</div>
              <div className="font-mono text-xs font-bold text-[#F1EBDD] mt-1 truncate px-2">
                {quest.badgeName}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Story Dispatch */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Field Story */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#D8F45A] mb-3">
                {"// EXPEDITION BRIEFING"}
              </h2>
              <p className="font-mono text-sm leading-relaxed text-[#F1EBDD]">
                {quest.description}
              </p>
              <div className="mt-4 border-t border-[#262724] pt-4 font-mono text-xs leading-relaxed text-[#AAA99F]">
                {quest.story}
              </div>
            </div>

            {/* Progression & Ordered Stops */}
            <div className="border border-[#262724] bg-[#171815] p-6">
              <div className="flex items-center justify-between border-b border-[#262724] pb-4 mb-6">
                <div>
                  <h3 className="font-[family-name:var(--font-bebas)] text-2xl font-bold tracking-wide text-[#F1EBDD]">
                    ORDERED CHECKPOINTS
                  </h3>
                  <p className="font-mono text-xs text-[#AAA99F]">
                    Follow each stop in order. Check in at the location to advance.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#D8F45A]">
                    {progress.completed} / {progress.total} DONE
                  </span>
                  {isCompleted && (
                    <div className="font-mono text-[10px] text-[#D8F45A] uppercase font-bold">
                      ★ QUEST COMPLETED
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#10110F] border border-[#262724] mb-8">
                <div
                  className="h-full bg-[#D8F45A] transition-all duration-500"
                  style={{
                    width: `${(progress.completed / progress.total) * 100}%`,
                  }}
                />
              </div>

              {/* Stops List */}
              <div className="space-y-6">
                {quest.stops.map((stop, idx) => {
                  const isStopCompleted = completedStopIds.includes(stop.id);
                  const isCurrentStop =
                    isStarted && !isStopCompleted &&
                    (idx === 0 || completedStopIds.includes(quest.stops[idx - 1].id));

                  return (
                    <div
                      key={stop.id}
                      className={`relative border p-5 transition-all ${
                        isStopCompleted
                          ? "border-[#D8F45A]/40 bg-[#10110F]"
                          : isCurrentStop
                          ? "border-[#D8F45A] bg-[#10110F] shadow-[0_0_20px_rgba(216,244,90,0.1)]"
                          : "border-[#262724] bg-[#10110F]/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {/* Checkpoint Status Indicator */}
                          <div className="mt-1">
                            {isStopCompleted ? (
                              <CheckCircle2 size={20} className="text-[#D8F45A]" />
                            ) : isCurrentStop ? (
                              <div className="h-5 w-5 rounded-full border-2 border-[#D8F45A] flex items-center justify-center animate-pulse">
                                <div className="h-2 w-2 rounded-full bg-[#D8F45A]" />
                              </div>
                            ) : (
                              <Circle size={20} className="text-[#686760]" />
                            )}
                          </div>

                          {/* Stop Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D8F45A]">
                                STOP 0{stop.order}
                              </span>
                              <span className="font-mono text-[10px] text-[#AAA99F]">
                                • {stop.coordinates.lat.toFixed(4)}°N, {stop.coordinates.lng.toFixed(4)}°E
                              </span>
                            </div>
                            <h4 className="font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#F1EBDD] mt-0.5">
                              {stop.placeName}
                            </h4>
                            <p className="mt-1 font-mono text-xs text-[#AAA99F]">
                              {stop.objective}
                            </p>

                            {/* Hint */}
                            <div className="mt-2 text-[11px] font-mono text-[#686760] italic">
                              FIELD HINT: {stop.hint}
                            </div>
                          </div>
                        </div>

                        {/* Reward tag */}
                        <div className="shrink-0 text-right">
                          <span className="font-mono text-xs font-bold text-[#D8F45A]">
                            +{stop.xpReward} XP
                          </span>
                        </div>
                      </div>

                      {/* Feedback Message */}
                      {stopMessage[stop.id] && (
                        <div
                          className={`mt-3 border p-2.5 font-mono text-xs flex items-center gap-2 ${
                            stopMessage[stop.id].includes("verified") || stopMessage[stop.id].includes("awarded") || stopMessage[stop.id].includes("completed")
                              ? "border-[#D8F45A] bg-[#171815] text-[#D8F45A]"
                              : "border-red-500/50 bg-[#171815] text-red-400"
                          }`}
                        >
                          <CheckCircle2 size={14} className="shrink-0" />
                          <span>{stopMessage[stop.id]}</span>
                        </div>
                      )}

                      {/* Stop Check-in Action Bar */}
                      <div className="mt-4 pt-3 border-t border-[#262724] flex flex-wrap items-center justify-between gap-3">
                        <Link
                          href={`/places/${stop.placeId}`}
                          className="font-mono text-[11px] text-[#AAA99F] hover:text-[#D8F45A] flex items-center gap-1 min-h-[36px]"
                        >
                          <span>Place Dossier</span>
                          <ExternalLink size={12} />
                        </Link>

                        {isStopCompleted ? (
                          <span className="font-mono text-xs text-[#D8F45A] flex items-center gap-1 font-bold min-h-[44px]">
                            <CheckCircle2 size={14} />
                            COMPLETED
                          </span>
                        ) : isCurrentStop ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleStopCheckIn(stop.id, true)}
                              disabled={activeStopCheckingIn === stop.id}
                              className="min-h-[44px] flex items-center gap-1.5 bg-[#D8F45A] px-4 py-2 font-mono text-xs font-bold uppercase text-[#10110F] hover:bg-[#cbf033] transition-colors disabled:opacity-50"
                            >
                              <Zap size={14} />
                              <span>{activeStopCheckingIn === stop.id ? "VERIFYING..." : `DEMO CHECK-IN (+${stop.xpReward} XP)`}</span>
                            </button>

                            <button
                              onClick={() => handleStopCheckIn(stop.id, false)}
                              disabled={activeStopCheckingIn === stop.id}
                              className="min-h-[44px] flex items-center gap-1.5 border border-[#262724] bg-[#171815] px-3 py-2 font-mono text-xs uppercase text-[#AAA99F] hover:border-[#D8F45A] hover:text-[#F1EBDD] transition-colors disabled:opacity-50"
                              title="Verify check-in with device GPS"
                            >
                              <Compass size={14} />
                              <span>GPS VERIFY</span>
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-[#686760] min-h-[36px] flex items-center">
                            {isStarted ? "COMPLETE PREVIOUS STOP" : "START QUEST FIRST"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Quest Control & Reward Badge */}
          <div className="space-y-6">
            {/* Quest Action Card */}
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#AAA99F] mb-4">
                {"// EXPEDITION STATUS"}
              </h3>

              {isCompleted ? (
                <div className="border border-[#D8F45A] bg-[#10110F] p-4 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-[#D8F45A] mb-2" />
                  <div className="font-[family-name:var(--font-bebas)] text-2xl text-[#F1EBDD]">
                    QUEST CONQUERED
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#AAA99F]">
                    All checkpoints verified. Badge and XP awarded to your profile!
                  </p>
                  <Link
                    href="/profile"
                    className="mt-4 inline-block w-full bg-[#D8F45A] py-2.5 font-mono text-xs font-bold uppercase text-[#10110F]"
                  >
                    VIEW BADGE ON PROFILE
                  </Link>
                </div>
              ) : isStarted ? (
                <div className="space-y-3">
                  <div className="border border-[#262724] bg-[#10110F] p-3 font-mono text-xs text-[#AAA99F]">
                    <span>STATUS: </span>
                    <span className="font-bold text-[#D8F45A]">IN PROGRESS</span>
                  </div>
                  <p className="font-mono text-xs text-[#AAA99F]">
                    You have verified {progress.completed} of {progress.total} stops. Head to the active checkpoint to earn your next XP reward.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-mono text-xs leading-relaxed text-[#AAA99F]">
                    Ready to begin this expedition? Starting it will activate the checkpoint tracking in your field journal.
                  </p>
                  <button
                    onClick={handleStartOrContinue}
                    className="w-full bg-[#D8F45A] py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#10110F] hover:bg-[#cbf033] transition-colors"
                  >
                    START QUEST
                  </button>
                </div>
              )}
            </div>

            {/* Reward Badge Card */}
            <div className="border border-[#262724] bg-[#171815] p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center bg-[#D8F45A] text-[#10110F] shadow-[0_0_20px_rgba(216,244,90,0.3)]">
                <Award size={36} />
              </div>
              <h4 className="mt-4 font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#F1EBDD]">
                {quest.badgeName}
              </h4>
              <p className="mt-1 font-mono text-xs text-[#AAA99F]">
                {quest.badgeDescription}
              </p>
              <div className="mt-4 border-t border-[#262724] pt-3 font-mono text-[10px] text-[#686760]">
                UNLOCKED ON FINISHING ALL {quest.stopsCount} STOPS
              </div>
            </div>

            {/* Integrity Notice */}
            <div className="border border-[#262724] bg-[#10110F] p-4 font-mono text-xs text-[#AAA99F]">
              <div className="flex items-center gap-1.5 text-[#D8F45A] font-bold">
                <ShieldCheck size={14} />
                <span>ANTI-CHEAT AUDIT</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#686760]">
                Coordinates require real-time client verification or certified field simulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

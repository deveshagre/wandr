"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { 
  Award, 
  Compass, 
  Crown, 
  Coffee, 
  MoonStar, 
  BookOpen, 
  Utensils, 
  Landmark,
  X,
  Sparkles
} from "lucide-react";

export function BadgeModal() {
  const { activeBadgeNotification, clearBadgeNotification } = useUser();

  if (!activeBadgeNotification) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-10 h-10 text-[#10110F]" />;
      case "MoonStar": return <MoonStar className="w-10 h-10 text-[#10110F]" />;
      case "Crown": return <Crown className="w-10 h-10 text-[#10110F]" />;
      case "Coffee": return <Coffee className="w-10 h-10 text-[#10110F]" />;
      case "BookOpen": return <BookOpen className="w-10 h-10 text-[#10110F]" />;
      case "Utensils": return <Utensils className="w-10 h-10 text-[#10110F]" />;
      case "Landmark": return <Landmark className="w-10 h-10 text-[#10110F]" />;
      default: return <Award className="w-10 h-10 text-[#10110F]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10110F]/90 p-4">
      <div className="relative w-full max-w-md border-2 border-[#D8F45A] bg-[#171815] p-6 text-center">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-[#262724] pb-3 mb-5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
            <Sparkles size={14} />
            <span>ACHIEVEMENT UNLOCKED</span>
          </div>
          <button
            onClick={clearBadgeNotification}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#AAA99F] hover:text-[#F1EBDD] focus:outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badge Icon Emblem */}
        <div className="mx-auto my-4 flex h-20 w-20 items-center justify-center bg-[#D8F45A] border-2 border-[#10110F]">
          {getIcon(activeBadgeNotification.icon)}
        </div>

        {/* Badge Title & Description */}
        <h3 className="font-[family-name:var(--font-bebas)] text-3xl font-extrabold tracking-wide text-[#F1EBDD] mt-4">
          {activeBadgeNotification.name}
        </h3>
        <p className="mt-2 font-mono text-xs leading-relaxed text-[#AAA99F] px-4">
          {activeBadgeNotification.description}
        </p>

        {/* Metadata ribbon */}
        <div className="mt-6 border border-[#262724] bg-[#10110F] py-2.5 px-4 font-mono text-[11px] text-[#D8F45A] flex justify-between items-center">
          <span>CITY ARCHIVE ID: {activeBadgeNotification.id.toUpperCase()}</span>
          <span>RECORDED</span>
        </div>

        {/* Action Button */}
        <button
          onClick={clearBadgeNotification}
          className="mt-6 w-full min-h-[48px] bg-[#D8F45A] py-3 font-mono text-xs font-bold tracking-wider uppercase text-[#10110F] hover:bg-[#c9e846] transition-colors"
        >
          CLAIM BADGE & CONTINUE
        </button>
      </div>
    </div>
  );
}

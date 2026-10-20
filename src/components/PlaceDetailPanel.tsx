"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Place } from "@/types";
import { useUser } from "@/context/UserContext";
import { 
  X, 
  Bookmark, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2, 
  Compass, 
  Zap, 
  Info
} from "lucide-react";

interface PlaceDetailPanelProps {
  place: Place;
  onClose: () => void;
}

export function PlaceDetailPanel({ place, onClose }: PlaceDetailPanelProps) {
  const { toggleSavePlace, isPlaceSaved, checkInAtPlace } = useUser();
  const saved = isPlaceSaved(place.id);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleCheckIn = async (bypassGps = false) => {
    setCheckingIn(true);
    setCheckInStatus(null);
    try {
      const res = await checkInAtPlace(
        place.id,
        place.name,
        place.neighborhood,
        place.coordinates,
        bypassGps
      );
      setCheckInStatus({ success: res.success, message: res.message });
    } catch {
      setCheckInStatus({ success: false, message: "Check-in failed. Please retry." });
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between border-t border-[#262724] bg-[#171815] p-5 lg:border-t-0 lg:border-l">
      <div>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-[#262724] pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#D8F45A] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#10110F]">
              {place.category}
            </span>
            <span className="font-mono text-[10px] uppercase text-[#AAA99F]">
              SECTOR: {place.neighborhood}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavePlace(place.id)}
              className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                saved
                  ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A]"
                  : "border-[#262724] bg-[#10110F] text-[#F1EBDD] hover:border-[#D8F45A]"
              }`}
              title={saved ? "Remove from saved places" : "Save place"}
              aria-label={saved ? "Remove from saved places" : "Save place"}
            >
              <Bookmark size={14} className={saved ? "fill-current" : ""} />
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center border border-[#262724] bg-[#10110F] text-[#AAA99F] hover:text-[#F1EBDD]"
              aria-label="Close detail panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Place Imagery */}
        <div className="relative mt-4 h-48 w-full overflow-hidden border border-[#262724] bg-[#10110F]">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171815] via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between border border-[#262724] bg-[#10110F]/90 p-1.5 font-mono text-[10px] text-[#F1EBDD]">
            <span>{place.coordinates.lat.toFixed(4)}° N, {place.coordinates.lng.toFixed(4)}° E</span>
            {place.establishedYear && <span>EST. {place.establishedYear}</span>}
          </div>
        </div>

        {/* Place Title & Kannada Name */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl font-extrabold text-[#F1EBDD]">
              {place.name}
            </h2>
            {place.kannadaName && (
              <span className="font-mono text-sm font-bold text-[#D8F45A]">
                {place.kannadaName}
              </span>
            )}
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-[#AAA99F]">
            {place.fullDescription}
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-4">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#AAA99F]">
            KEY ATTRIBUTES
          </h4>
          <ul className="mt-2 space-y-1">
            {place.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 font-mono text-xs text-[#F1EBDD]"
              >
                <span className="h-1 w-1 bg-[#D8F45A]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Box if available */}
        {place.tips && (
          <div className="mt-4 border border-[#262724] bg-[#10110F] p-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#D8F45A]">
              <Info size={12} />
              <span>FIELD ADVISORY</span>
            </div>
            <p className="mt-1 font-mono text-xs text-[#AAA99F]">
              {place.tips}
            </p>
          </div>
        )}

        {/* Linked Quest if any */}
        {place.relatedQuestId && (
          <div className="mt-4 border border-[#D8F45A]/30 bg-[#D8F45A]/5 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#D8F45A]">
                PART OF EXPEDITION ROUTE
              </span>
              <Link
                href={`/quests/${place.relatedQuestId}`}
                className="flex items-center gap-1 font-mono text-xs text-[#D8F45A] hover:underline"
              >
                <span>OPEN QUEST</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* Address */}
        <div className="mt-4 font-mono text-[11px] text-[#686760] flex items-start gap-1.5">
          <MapPin size={12} className="shrink-0 mt-0.5" />
          <span>{place.address}</span>
        </div>
      </div>

      {/* Action Check-in Section (Touch targets >= 44px) */}
      <div className="mt-6 border-t border-[#262724] pt-4 space-y-2.5">
        {checkInStatus && (
          <div
            className={`border p-2.5 font-mono text-xs flex items-center gap-2 ${
              checkInStatus.success
                ? "border-[#D8F45A] bg-[#10110F] text-[#D8F45A]"
                : "border-red-500/50 bg-[#10110F] text-red-400"
            }`}
          >
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{checkInStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* Real GPS check-in */}
          <button
            onClick={() => handleCheckIn(false)}
            disabled={checkingIn}
            className="min-h-[46px] flex items-center justify-center gap-2 bg-[#D8F45A] px-2 font-mono text-xs font-bold uppercase tracking-wider text-[#10110F] hover:bg-[#c9e846] transition-colors disabled:opacity-50"
          >
            <Compass size={14} />
            <span>{checkingIn ? "LOCATING..." : "GPS CHECK-IN"}</span>
          </button>

          {/* Quick Demo Check-in */}
          <button
            onClick={() => handleCheckIn(true)}
            disabled={checkingIn}
            className="min-h-[46px] flex items-center justify-center gap-1.5 border border-[#262724] bg-[#10110F] px-2 font-mono text-xs uppercase text-[#F1EBDD] hover:border-[#D8F45A] transition-colors disabled:opacity-50"
          >
            <Zap size={14} className="text-[#D8F45A]" />
            <span>LOG (+50 XP)</span>
          </button>
        </div>

        <div className="text-center pt-1">
          <Link
            href={`/places/${place.id}`}
            className="font-mono text-[11px] text-[#AAA99F] hover:text-[#D8F45A] underline"
          >
            Read dedicated archive dispatch →
          </Link>
        </div>
      </div>
    </div>
  );
}

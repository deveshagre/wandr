"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PLACES } from "@/data/places";
import { QUESTS } from "@/data/quests";
import { useUser } from "@/context/UserContext";
import { 
  ArrowLeft, 
  Bookmark, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  Info, 
  Zap,
  ArrowUpRight,
  ShieldCheck 
} from "lucide-react";

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = params.id as string;
  const place = PLACES.find((p) => p.id === placeId);

  const { isPlaceSaved, toggleSavePlace, checkInAtPlace } = useUser();
  const [checkingIn, setCheckingIn] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!place) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-mono">
        <h2 className="text-2xl font-bold text-[#F1EBDD]">PLACE NOT FOUND</h2>
        <p className="mt-2 text-xs text-[#AAA99F]">The requested location is not in our archive registry.</p>
        <Link
          href="/places"
          className="mt-6 bg-[#D8F45A] px-4 py-2 text-xs font-bold uppercase text-[#10110F]"
        >
          Return to Places Catalog
        </Link>
      </div>
    );
  }

  const saved = isPlaceSaved(place.id);
  const relatedQuest = place.relatedQuestId
    ? QUESTS.find((q) => q.id === place.relatedQuestId)
    : null;

  const handleCheckIn = async (bypassGps: boolean) => {
    setCheckingIn(true);
    setFeedback(null);
    try {
      const res = await checkInAtPlace(
        place.id,
        place.name,
        place.neighborhood,
        place.coordinates,
        bypassGps
      );
      setFeedback({ success: res.success, message: res.message });
    } catch {
      setFeedback({ success: false, message: "Check-in error. Please try again." });
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] pb-24">
      {/* Top Header Breadcrumb */}
      <div className="border-b border-[#262724] bg-[#171815] py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/places"
            className="flex items-center gap-1.5 font-mono text-xs uppercase text-[#AAA99F] hover:text-[#D8F45A] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>BACK TO PLACES INDEX</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/explore?place=${place.id}`}
              className="flex items-center gap-1 font-mono text-xs text-[#D8F45A] hover:underline"
            >
              <Compass size={14} />
              <span>VIEW ON MAP</span>
            </Link>

            <button
              onClick={() => toggleSavePlace(place.id)}
              className={`flex items-center gap-1.5 border px-3 py-1 font-mono text-xs transition-colors ${
                saved
                  ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                  : "border-[#262724] bg-[#10110F] text-[#F1EBDD] hover:border-[#D8F45A]"
              }`}
            >
              <Bookmark size={13} className={saved ? "fill-current" : ""} />
              <span>{saved ? "SAVED" : "SAVE"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Editorial Cover & Title */}
        <div className="border border-[#262724] bg-[#171815]">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171815] via-transparent to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="bg-[#D8F45A] px-2.5 py-1 font-mono text-xs font-bold uppercase text-[#10110F]">
                {place.category}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 font-mono text-xs text-[#D8F45A]">
                <MapPin size={14} />
                <span>{place.neighborhood}</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-4 mt-1">
                <h1 className="font-[family-name:var(--font-bebas)] text-4xl font-extrabold sm:text-6xl text-[#F1EBDD]">
                  {place.name}
                </h1>
                {place.kannadaName && (
                  <span className="font-mono text-xl sm:text-2xl text-[#D8F45A]">
                    {place.kannadaName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262724] border-t border-[#262724] bg-[#10110F] p-4 text-center">
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">COORDINATES</div>
              <div className="font-mono text-xs font-bold text-[#F1EBDD] mt-1">
                {place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">ESTABLISHED</div>
              <div className="font-mono text-xs font-bold text-[#F1EBDD] mt-1">
                {place.establishedYear ? `YEAR ${place.establishedYear}` : "HISTORIC"}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">CHECK-IN REWARD</div>
              <div className="font-mono text-xs font-bold text-[#D8F45A] mt-1">
                +50 XP
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-[#AAA99F]">VERIFICATION</div>
              <div className="font-mono text-xs font-bold text-[#D8F45A] mt-1">
                AUTHENTICATED
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Dossier */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#D8F45A] mb-3">
                {"// ARCHIVE DOSSIER"}
              </h2>
              <p className="font-mono text-sm leading-relaxed text-[#F1EBDD]">
                {place.shortDescription}
              </p>
              <div className="mt-4 border-t border-[#262724] pt-4 font-mono text-xs leading-relaxed text-[#AAA99F]">
                {place.fullDescription}
              </div>
            </div>

            {/* Highlights */}
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl font-bold tracking-wide text-[#F1EBDD] mb-4">
                DISTINCTIVE FEATURES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.highlights.map((h) => (
                  <div
                    key={h}
                    className="border border-[#262724] bg-[#10110F] p-3 font-mono text-xs text-[#F1EBDD] flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 bg-[#D8F45A] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Advisory Tips */}
            {place.tips && (
              <div className="border border-[#262724] bg-[#171815] p-6">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#D8F45A]">
                  <Info size={14} />
                  <span>FIELD ADVISORY</span>
                </div>
                <p className="mt-2 font-mono text-xs leading-relaxed text-[#AAA99F]">
                  {place.tips}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Check-in, Address, Related Quest */}
          <div className="space-y-6">
            {/* Check-in Box */}
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#AAA99F] mb-3">
                {"// FIELD CHECK-IN"}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-[#AAA99F] mb-4">
                Record your visit to add this location to your personal Bangalore passport and claim +50 XP.
              </p>

              {feedback && (
                <div
                  className={`mb-4 border p-3 font-mono text-xs flex items-center gap-2 ${
                    feedback.success
                      ? "border-[#D8F45A] bg-[#10110F] text-[#D8F45A]"
                      : "border-red-500/50 bg-[#10110F] text-red-400"
                  }`}
                >
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => handleCheckIn(false)}
                  disabled={checkingIn}
                  className="w-full flex items-center justify-center gap-2 bg-[#D8F45A] py-3.5 font-mono text-xs font-bold uppercase text-[#10110F] hover:bg-[#cbf033] transition-colors disabled:opacity-50"
                >
                  <Compass size={14} />
                  <span>{checkingIn ? "VERIFYING GEODATA..." : "VERIFY VIA GPS"}</span>
                </button>

                <button
                  onClick={() => handleCheckIn(true)}
                  disabled={checkingIn}
                  className="w-full min-h-[44px] border border-[#262724] bg-[#10110F] py-2.5 font-mono text-xs uppercase text-[#AAA99F] hover:border-[#D8F45A] hover:text-[#F1EBDD] transition-colors"
                >
                  SIMULATE VISIT (DEMO ACTION)
                </button>
              </div>
            </div>

            {/* Related Quest */}
            {relatedQuest && (
              <div className="border border-[#D8F45A]/40 bg-[#171815] p-6">
                <div className="font-mono text-[10px] uppercase font-bold text-[#D8F45A] flex items-center gap-1.5">
                  <Zap size={12} />
                  <span>PART OF COMMISSIONED EXPEDITION</span>
                </div>
                <h4 className="font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#F1EBDD] mt-2">
                  {relatedQuest.title}
                </h4>
                <p className="font-mono text-xs text-[#AAA99F] mt-1">
                  {relatedQuest.subtitle}
                </p>
                <Link
                  href={`/quests/${relatedQuest.id}`}
                  className="mt-4 flex items-center justify-between border border-[#262724] bg-[#10110F] p-3 font-mono text-xs text-[#D8F45A] hover:border-[#D8F45A]"
                >
                  <span>VIEW FULL EXPEDITION</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}

            {/* Location & Address */}
            <div className="border border-[#262724] bg-[#171815] p-6">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#AAA99F] mb-2">
                POSTAL ADDRESS
              </h4>
              <p className="font-mono text-xs leading-relaxed text-[#F1EBDD]">
                {place.address}
              </p>
              <div className="mt-4 pt-4 border-t border-[#262724] flex items-center gap-1.5 font-mono text-[10px] text-[#686760]">
                <ShieldCheck size={12} className="text-[#D8F45A]" />
                <span>GROUND VALIDATED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Place } from "@/types";
import { useUser } from "@/context/UserContext";
import { Bookmark, ArrowUpRight, Compass } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  theme?: "dark" | "paper";
}

export function PlaceCard({ place, theme = "dark" }: PlaceCardProps) {
  const { isPlaceSaved, toggleSavePlace } = useUser();
  const saved = isPlaceSaved(place.id);

  const isPaper = theme === "paper";

  return (
    <div
      className={`group relative flex flex-col justify-between border transition-colors ${
        isPaper
          ? "border-[#D8D2C3] bg-[#EAE3D2] text-[#10110F] hover:border-[#10110F]"
          : "border-[#262724] bg-[#171815] text-[#F1EBDD] hover:border-[#D8F45A]"
      }`}
    >
      <div>
        {/* Place Image with Category Pill and Bookmark Button */}
        <div className="relative h-48 w-full overflow-hidden bg-black/10 border-b border-inherit">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="h-full w-full object-cover grayscale contrast-110 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />

          {/* Category Tag */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                isPaper
                  ? "bg-[#10110F] text-[#F1EBDD] border-[#10110F]"
                  : "bg-[#10110F] text-[#D8F45A] border-[#262724]"
              }`}
            >
              {place.category}
            </span>
          </div>

          {/* Bookmark Button (min 44px touch target) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleSavePlace(place.id);
            }}
            className={`absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center border transition-colors ${
              saved
                ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A]"
                : isPaper
                ? "bg-[#F1EBDD] text-[#10110F] border-[#D8D2C3] hover:bg-[#10110F] hover:text-[#F1EBDD]"
                : "bg-[#10110F] text-[#F1EBDD] border-[#262724] hover:border-[#D8F45A]"
            }`}
            aria-label={saved ? "Remove bookmark" : "Bookmark place"}
          >
            <Bookmark size={14} className={saved ? "fill-current" : ""} />
          </button>

          {/* Coordinates Overlay Bar */}
          <div
            className={`absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] px-2 py-1 border ${
              isPaper
                ? "bg-[#F1EBDD]/95 text-[#10110F] border-[#D8D2C3]"
                : "bg-[#10110F]/95 text-[#AAA99F] border-[#262724]"
            }`}
          >
            <span>{place.neighborhood}</span>
            {place.establishedYear && (
              <span className="font-bold">EST. {place.establishedYear}</span>
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={`font-[family-name:var(--font-bebas)] text-2xl font-bold tracking-wide transition-colors ${
                isPaper ? "text-[#10110F]" : "text-[#F1EBDD] group-hover:text-[#D8F45A]"
              }`}
            >
              {place.name}
            </h3>
            {place.kannadaName && (
              <span
                className={`font-mono text-xs font-semibold ${
                  isPaper ? "text-[#75736B]" : "text-[#686760]"
                }`}
              >
                {place.kannadaName}
              </span>
            )}
          </div>

          <p
            className={`mt-2 font-mono text-xs leading-relaxed line-clamp-2 ${
              isPaper ? "text-[#4A4942]" : "text-[#AAA99F]"
            }`}
          >
            {place.shortDescription}
          </p>

          {/* Highlights tags */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {place.highlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className={`font-mono text-[9px] px-2 py-0.5 border ${
                  isPaper
                    ? "border-[#D8D2C3] bg-[#F1EBDD] text-[#55544E]"
                    : "border-[#262724] bg-[#10110F] text-[#AAA99F]"
                }`}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div
        className={`border-t px-4 py-2.5 flex items-center justify-between font-mono text-xs ${
          isPaper
            ? "border-[#D8D2C3] bg-[#F1EBDD]"
            : "border-[#262724] bg-[#10110F]"
        }`}
      >
        <Link
          href={`/places/${place.id}`}
          className={`min-h-[36px] flex items-center gap-1 font-bold ${
            isPaper
              ? "text-[#10110F] hover:underline"
              : "text-[#D8F45A] hover:underline"
          }`}
        >
          <span>VIEW DISPATCH</span>
          <ArrowUpRight size={13} />
        </Link>

        <Link
          href={`/explore?place=${place.id}`}
          className={`min-h-[36px] flex items-center gap-1 ${
            isPaper
              ? "text-[#55544E] hover:text-[#10110F]"
              : "text-[#AAA99F] hover:text-[#D8F45A]"
          }`}
          title="Locate on map"
        >
          <Compass size={13} />
          <span className="text-[10px]">MAP</span>
        </Link>
      </div>
    </div>
  );
}

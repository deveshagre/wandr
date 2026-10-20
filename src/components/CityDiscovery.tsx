"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PLACES } from "@/data/places";
import { Category, Place } from "@/types";
import { useUser } from "@/context/UserContext";
import { Bookmark, Compass, ArrowUpRight } from "lucide-react";

export function CityDiscovery() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const { isPlaceSaved, toggleSavePlace } = useUser();

  const categories: { label: string; value: Category }[] = [
    { label: "ALL", value: "all" },
    { label: "PARKS", value: "parks" },
    { label: "CULTURE", value: "culture" },
    { label: "FOOD", value: "food" },
    { label: "NIGHTLIFE", value: "nightlife" },
    { label: "CAFÉS", value: "cafes" },
    { label: "ART", value: "art" },
  ];

  const filteredPlaces = activeCategory === "all"
    ? PLACES
    : PLACES.filter((p) => p.category === activeCategory);

  const leadPlace: Place = filteredPlaces[0] || PLACES[0];
  const sidePlaces: Place[] = filteredPlaces.slice(1, 3);
  const bottomPlaces: Place[] = filteredPlaces.slice(3, 6);

  return (
    <section className="border-b border-[#D8D2C3] bg-[#F1EBDD] text-[#10110F] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Broadsheet Masthead Header */}
        <div className="flex flex-col justify-between gap-4 border-b-2 border-[#10110F] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#75736B]">
              <span className="inline-block h-2 w-2 bg-[#10110F]" />
              <span>SECTION 03 // BENGALURU SANCTUARIES</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl font-extrabold tracking-tight text-[#10110F] sm:text-6xl md:text-7xl">
              URBAN DISCOVERY BROADSHEET
            </h2>
            <p className="mt-1 font-mono text-xs text-[#55544E] max-w-2xl leading-relaxed">
              Curated locations documented without generic algorithm bias. Real historical context, architectural notes, and local cultural memories.
            </p>
          </div>

          <Link
            href="/places"
            className="inline-flex min-h-[44px] items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#10110F] hover:underline"
          >
            <span>FULL CITY CATALOG ({PLACES.length})</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Category Filter Bar with Solid Ink Styling */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#D8D2C3]">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`min-h-[40px] px-4 py-1.5 font-mono text-xs uppercase tracking-wider border whitespace-nowrap transition-colors ${
                activeCategory === cat.value
                  ? "bg-[#10110F] text-[#F1EBDD] border-[#10110F] font-bold"
                  : "bg-transparent text-[#55544E] border-[#D8D2C3] hover:border-[#10110F] hover:text-[#10110F]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Asymmetrical Broadsheet Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Lead Story Feature (7 Columns) */}
          <div className="border border-[#D8D2C3] bg-[#EAE3D2] p-5 sm:p-6 lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#D8D2C3] pb-3 mb-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[#10110F]">
                  <span className="bg-[#10110F] text-[#F1EBDD] px-2 py-0.5">
                    {leadPlace.category}
                  </span>
                  <span>{leadPlace.neighborhood}</span>
                </div>
                <button
                  onClick={() => toggleSavePlace(leadPlace.id)}
                  className={`flex h-8 w-8 items-center justify-center border border-[#D8D2C3] transition-colors ${
                    isPlaceSaved(leadPlace.id)
                      ? "bg-[#10110F] text-[#F1EBDD]"
                      : "bg-[#F1EBDD] text-[#10110F] hover:bg-[#10110F] hover:text-[#F1EBDD]"
                  }`}
                  aria-label="Save place"
                >
                  <Bookmark size={13} className={isPlaceSaved(leadPlace.id) ? "fill-current" : ""} />
                </button>
              </div>

              {/* Lead Image with Fine Border */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden border border-[#D8D2C3] bg-[#10110F]/10">
                <img
                  src={leadPlace.imageUrl}
                  alt={leadPlace.name}
                  className="h-full w-full object-cover grayscale contrast-110 transition-transform duration-700 hover:scale-105 hover:grayscale-0"
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-[#F1EBDD]/95 px-3 py-1 font-mono text-[10px] text-[#10110F] border border-[#D8D2C3]">
                  <span>{leadPlace.coordinates.lat.toFixed(4)}° N, {leadPlace.coordinates.lng.toFixed(4)}° E</span>
                  {leadPlace.establishedYear && <span>EST. {leadPlace.establishedYear}</span>}
                </div>
              </div>

              {/* Lead Text */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl font-extrabold text-[#10110F]">
                    {leadPlace.name}
                  </h3>
                  {leadPlace.kannadaName && (
                    <span className="font-mono text-base font-bold text-[#75736B]">
                      {leadPlace.kannadaName}
                    </span>
                  )}
                </div>
                <p className="mt-2 font-mono text-xs leading-relaxed text-[#4A4942]">
                  {leadPlace.fullDescription}
                </p>

                {/* Attributes checklist */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {leadPlace.highlights.map((h) => (
                    <span
                      key={h}
                      className="border border-[#D8D2C3] bg-[#F1EBDD] px-2.5 py-1 font-mono text-[10px] text-[#55544E]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-[#D8D2C3] flex items-center justify-between font-mono text-xs">
              <Link
                href={`/places/${leadPlace.id}`}
                className="font-bold text-[#10110F] hover:underline flex items-center gap-1"
              >
                <span>OPEN ARCHIVE RECORD</span>
                <ArrowUpRight size={13} />
              </Link>
              <Link
                href={`/explore?place=${leadPlace.id}`}
                className="text-[#75736B] hover:text-[#10110F] flex items-center gap-1"
              >
                <Compass size={13} />
                <span>MAP PIN</span>
              </Link>
            </div>
          </div>

          {/* Side Column Dispatches (5 Columns) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {sidePlaces.map((place) => (
              <div
                key={place.id}
                className="border border-[#D8D2C3] bg-[#EAE3D2] p-5 flex flex-col justify-between flex-1"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#75736B] border-b border-[#D8D2C3] pb-2 mb-3">
                    <span className="uppercase font-bold text-[#10110F]">
                      {place.category} • {place.neighborhood}
                    </span>
                    <button
                      onClick={() => toggleSavePlace(place.id)}
                      className={`h-6 w-6 flex items-center justify-center border transition-colors ${
                        isPlaceSaved(place.id)
                          ? "bg-[#10110F] text-[#F1EBDD] border-[#10110F]"
                          : "border-[#D8D2C3] text-[#10110F] hover:bg-[#10110F] hover:text-[#F1EBDD]"
                      }`}
                      aria-label="Save place"
                    >
                      <Bookmark size={11} className={isPlaceSaved(place.id) ? "fill-current" : ""} />
                    </button>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="h-20 w-20 shrink-0 overflow-hidden border border-[#D8D2C3] bg-[#10110F]/10">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="h-full w-full object-cover grayscale contrast-110"
                      />
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#10110F] leading-tight">
                        {place.name}
                      </h4>
                      {place.kannadaName && (
                        <span className="font-mono text-xs text-[#75736B] block">
                          {place.kannadaName}
                        </span>
                      )}
                      <p className="mt-1 font-mono text-xs leading-relaxed text-[#4A4942] line-clamp-2">
                        {place.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D8D2C3] flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`/places/${place.id}`}
                    className="font-bold text-[#10110F] hover:underline flex items-center gap-1"
                  >
                    <span>READ DOSSIER</span>
                    <ArrowUpRight size={12} />
                  </Link>
                  <Link
                    href={`/explore?place=${place.id}`}
                    className="text-[#75736B] hover:text-[#10110F] flex items-center gap-1"
                  >
                    <Compass size={12} />
                    <span>MAP</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Broadsheet Row (3 Columns) */}
        {bottomPlaces.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bottomPlaces.map((place) => (
              <div
                key={place.id}
                className="border border-[#D8D2C3] bg-[#EAE3D2] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#75736B] border-b border-[#D8D2C3] pb-2 mb-3">
                    <span className="uppercase font-bold text-[#10110F]">
                      {place.category} • {place.neighborhood}
                    </span>
                    {place.establishedYear && (
                      <span className="font-bold text-[#10110F]">EST. {place.establishedYear}</span>
                    )}
                  </div>

                  <h4 className="font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#10110F]">
                    {place.name}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-[#4A4942] line-clamp-2 leading-relaxed">
                    {place.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D8D2C3] flex items-center justify-between font-mono text-xs">
                  <Link
                    href={`/places/${place.id}`}
                    className="font-bold text-[#10110F] hover:underline flex items-center gap-1"
                  >
                    <span>DETAILS</span>
                    <ArrowUpRight size={12} />
                  </Link>
                  <button
                    onClick={() => toggleSavePlace(place.id)}
                    className={`text-xs ${
                      isPlaceSaved(place.id) ? "font-bold text-[#10110F]" : "text-[#75736B]"
                    }`}
                  >
                    {isPlaceSaved(place.id) ? "SAVED ✓" : "+ SAVE"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verification Footnote */}
        <div className="mt-10 border-t border-[#D8D2C3] pt-4 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-[#75736B]">
          <span>SOURCE: FIELD RESEARCHED BY INDEPENDENT BENGALURU CONTRIBUTORS</span>
          <span className="mt-2 sm:mt-0">ZERO ALGORITHMIC FABRICATION • VERIFIED GEODATA</span>
        </div>
      </div>
    </section>
  );
}

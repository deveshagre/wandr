"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PLACES } from "@/data/places";
import { Category } from "@/types";
import { PlaceCard } from "@/components/PlaceCard";
import { Search, Compass, MapPin } from "lucide-react";

export default function PlacesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const categories: { label: string; value: Category }[] = [
    { label: "ALL", value: "all" },
    { label: "CAFÉS", value: "cafes" },
    { label: "FOOD", value: "food" },
    { label: "PARKS", value: "parks" },
    { label: "NIGHTLIFE", value: "nightlife" },
    { label: "ART", value: "art" },
    { label: "CULTURE", value: "culture" },
    { label: "SHOPPING", value: "shopping" },
  ];

  const filtered = useMemo(() => {
    return PLACES.filter((place) => {
      const matchCat = selectedCategory === "all" || place.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.neighborhood.toLowerCase().includes(q) ||
        place.shortDescription.toLowerCase().includes(q) ||
        place.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#262724] pb-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D8F45A]">
            <MapPin size={14} />
            <span>THE 560001 ARCHIVES</span>
          </div>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-5xl font-extrabold tracking-wide sm:text-6xl md:text-7xl">
            DOCUMENTED PLACES
          </h1>
          <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-[#AAA99F]">
            Every documented station has been researched in person. No sponsored listings or pay-for-placement rankings. Explore historic bakeries, royal parks, indie bookstores, and classic rock institutions.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA99F]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search archive..."
                className="w-full min-h-[44px] border border-[#262724] bg-[#171815] py-2.5 pl-9 pr-4 font-mono text-xs text-[#F1EBDD] focus:border-[#D8F45A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(selectedCategory === cat.value ? "all" : cat.value)}
                  className={`min-h-[40px] font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                      : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:border-[#D8F45A] hover:text-[#F1EBDD]"
                  }`}
                  aria-pressed={selectedCategory === cat.value}
                >
                  {cat.label}
                </button>
              ))}
              {(selectedCategory !== "all" || search) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearch("");
                  }}
                  className="min-h-[40px] font-mono text-[10px] uppercase text-[#D8F45A] border border-[#D8F45A]/40 px-3 py-1 hover:bg-[#D8F45A] hover:text-[#10110F] transition-colors whitespace-nowrap"
                >
                  RESET FILTERS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between font-mono text-xs text-[#AAA99F] mb-6">
            <span>SHOWING {filtered.length} OF {PLACES.length} VERIFIED LOCATIONS</span>
            <Link
              href="/explore"
              className="text-[#D8F45A] hover:underline flex items-center gap-1"
            >
              <Compass size={14} />
              <span>SWITCH TO LIVE MAP</span>
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-[#262724] bg-[#171815] p-12 text-center">
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl text-[#F1EBDD]">
                NO ARCHIVES MATCHED
              </h3>
              <p className="mt-2 font-mono text-xs text-[#AAA99F]">
                Try adjusting your search query or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="mt-4 min-h-[44px] bg-[#D8F45A] text-[#10110F] font-mono text-xs font-bold px-4 py-2 uppercase"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((place) => (
                <PlaceCard key={place.id} place={place} theme="dark" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

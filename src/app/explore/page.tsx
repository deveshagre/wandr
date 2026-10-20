"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PLACES } from "@/data/places";
import { Category, Place } from "@/types";
import { InteractiveMap } from "@/components/InteractiveMap";
import { PlaceDetailPanel } from "@/components/PlaceDetailPanel";
import { useUser } from "@/context/UserContext";
import { 
  Search, 
  Map as MapIcon, 
  List, 
  Bookmark, 
  Compass
} from "lucide-react";
import Link from "next/link";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialPlaceId = searchParams.get("place");
  const { isPlaceSaved, toggleSavePlace } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(() => {
    if (initialPlaceId) {
      return PLACES.find((p) => p.id === initialPlaceId) || PLACES[0];
    }
    return PLACES[0];
  });
  const [mobileTab, setMobileTab] = useState<"list" | "map">("map");

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

  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      const matchesCategory =
        selectedCategory === "all" || place.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        place.neighborhood.toLowerCase().includes(query) ||
        place.shortDescription.toLowerCase().includes(query) ||
        place.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-3.5rem)] bg-[#10110F]">
      {/* Search & Category Filter Toolbar */}
      <div className="border-b border-[#262724] bg-[#171815] px-4 py-3 sm:px-6">
        <div className="mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA99F]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by landmark, sector, or keyword..."
              className="w-full min-h-[44px] border border-[#262724] bg-[#10110F] py-2.5 pl-9 pr-4 font-mono text-xs text-[#F1EBDD] placeholder-[#686760] focus:border-[#D8F45A] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[30px] px-2 text-[10px] font-mono text-[#AAA99F] hover:text-[#F1EBDD]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Horizontally Scrolling Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? "all" : cat.value)}
                className={`min-h-[40px] font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 border whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                    : "bg-[#10110F] text-[#AAA99F] border-[#262724] hover:border-[#D8F45A] hover:text-[#F1EBDD]"
                }`}
                aria-pressed={selectedCategory === cat.value}
              >
                {cat.label}
              </button>
            ))}
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="min-h-[40px] font-mono text-[10px] uppercase text-[#D8F45A] border border-[#D8F45A]/40 px-2.5 py-1 hover:bg-[#D8F45A] hover:text-[#10110F] transition-colors whitespace-nowrap"
              >
                RESET CATEGORY
              </button>
            )}
          </div>

          {/* Mobile View Toggle Switch (>=44px touch targets) */}
          <div className="flex items-center justify-between border-t border-[#262724] pt-2.5 lg:hidden">
            <span className="font-mono text-[10px] text-[#AAA99F]">
              {filteredPlaces.length} LOCATIONS
            </span>
            <div className="flex border border-[#262724] bg-[#10110F]">
              <button
                onClick={() => setMobileTab("map")}
                className={`min-h-[44px] flex items-center gap-1.5 px-4 font-mono text-xs uppercase ${
                  mobileTab === "map"
                    ? "bg-[#D8F45A] text-[#10110F] font-bold"
                    : "text-[#AAA99F]"
                }`}
              >
                <MapIcon size={14} />
                <span>MAP</span>
              </button>
              <button
                onClick={() => setMobileTab("list")}
                className={`min-h-[44px] flex items-center gap-1.5 px-4 font-mono text-xs uppercase ${
                  mobileTab === "list"
                    ? "bg-[#D8F45A] text-[#10110F] font-bold"
                    : "text-[#AAA99F]"
                }`}
              >
                <List size={14} />
                <span>LIST</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Map + Results List + Detail Panel */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Results List Column (Hidden on mobile if map view is active) */}
        <div
          className={`w-full lg:w-[420px] lg:border-r border-[#262724] bg-[#10110F] overflow-y-auto flex flex-col justify-between ${
            mobileTab === "list" ? "block" : "hidden lg:flex"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-[#262724] pb-2 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#AAA99F]">
                INDEX DISPATCHES
              </span>
              <span className="font-mono text-[10px] text-[#D8F45A]">
                {filteredPlaces.length} OF {PLACES.length} STATIONS
              </span>
            </div>

            {/* Empty Search State */}
            {filteredPlaces.length === 0 ? (
              <div className="border border-[#262724] bg-[#171815] p-8 text-center my-6">
                <Compass size={32} className="mx-auto text-[#686760] mb-3" />
                <h4 className="font-[family-name:var(--font-bebas)] text-2xl text-[#F1EBDD]">
                  NO LOCATIONS FOUND
                </h4>
                <p className="font-mono text-xs text-[#AAA99F] mt-2">
                  No places match your search query &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 min-h-[44px] bg-[#D8F45A] text-[#10110F] font-mono text-xs font-bold px-4 py-2 uppercase"
                >
                  RESET SEARCH
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPlaces.map((place) => {
                  const isSelected = selectedPlace?.id === place.id;
                  const isSaved = isPlaceSaved(place.id);

                  return (
                    <div
                      key={place.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedPlace(place);
                        setMobileTab("map");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPlace(place);
                          setMobileTab("map");
                        }
                      }}
                      aria-label={`Select place: ${place.name}`}
                      className={`group relative cursor-pointer border p-3.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#D8F45A] ${
                        isSelected
                          ? "border-[#D8F45A] bg-[#171815]"
                          : "border-[#262724] bg-[#10110F] hover:border-[#AAA99F]/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-[#262724] bg-black/20">
                          <img
                            src={place.imageUrl}
                            alt={place.name}
                            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-[#D8F45A]">
                                {place.category}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSavePlace(place.id);
                                }}
                                className={`min-h-[30px] min-w-[30px] flex items-center justify-center text-[#AAA99F] hover:text-[#D8F45A] ${
                                  isSaved ? "text-[#D8F45A]" : ""
                                }`}
                                aria-label="Toggle save"
                              >
                                <Bookmark
                                  size={13}
                                  className={isSaved ? "fill-current" : ""}
                                />
                              </button>
                            </div>
                            <h3 className="font-[family-name:var(--font-bebas)] text-xl font-bold text-[#F1EBDD] leading-tight mt-0.5">
                              {place.name}
                            </h3>
                            <p className="font-mono text-[11px] text-[#AAA99F] line-clamp-1 mt-1">
                              {place.neighborhood}
                            </p>
                          </div>

                          <div className="flex items-center justify-between font-mono text-[10px] text-[#686760] pt-1">
                            <span>{place.coordinates.lat.toFixed(2)}°N, {place.coordinates.lng.toFixed(2)}°E</span>
                            {place.relatedQuestId && (
                              <span className="text-[#D8F45A] font-bold">QUEST STOP</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Map Viewport Area (Hidden on mobile if list view is active) */}
        <div
          className={`flex-1 relative ${
            mobileTab === "map" ? "block" : "hidden lg:block"
          }`}
        >
          <InteractiveMap
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => setSelectedPlace(p)}
          />

          {/* Floating Mobile Detail Card (Elevated above bottom nav) */}
          {selectedPlace && (
            <div className="absolute bottom-16 left-3 right-3 z-20 border-2 border-[#D8F45A] bg-[#171815] p-4 lg:hidden shadow-2xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="border border-[#262724] bg-[#10110F] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-[#D8F45A]">
                    {selectedPlace.category}
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#F1EBDD]">
                    {selectedPlace.name}
                  </h3>
                  <p className="font-mono text-[11px] text-[#AAA99F]">
                    {selectedPlace.neighborhood} • {selectedPlace.coordinates.lat.toFixed(4)}°N
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs font-mono text-[#AAA99F] hover:text-[#F1EBDD]"
                  aria-label="Dismiss detail preview"
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/places/${selectedPlace.id}`}
                  className="flex-1 min-h-[44px] flex items-center justify-center bg-[#D8F45A] font-mono text-xs font-bold uppercase text-[#10110F]"
                >
                  VIEW DISPATCH
                </Link>
                <button
                  onClick={() => toggleSavePlace(selectedPlace.id)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#262724] bg-[#10110F] text-[#F1EBDD]"
                  aria-label="Save place"
                >
                  <Bookmark
                    size={16}
                    className={isPlaceSaved(selectedPlace.id) ? "fill-[#D8F45A] text-[#D8F45A]" : ""}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Detail Sidebar if place is selected */}
        {selectedPlace && (
          <div className="hidden xl:block w-[380px] overflow-y-auto">
            <PlaceDetailPanel
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-[#10110F] font-mono text-xs text-[#AAA99F]">
          INITIALIZING CARTOGRAPHY ENGINE...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

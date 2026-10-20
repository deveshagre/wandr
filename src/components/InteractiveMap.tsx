"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { Place } from "@/types";
import { Navigation } from "lucide-react";

interface InteractiveMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  hoveredPlaceId?: string | null;
}

export function InteractiveMap({
  places,
  selectedPlace,
  onSelectPlace,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLeafletAvailable, setIsLeafletAvailable] = useState(true);

  // Initialize Leaflet client-side
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;
        // Inject Leaflet CSS if not already present
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Ensure container is clean for React StrictMode / Fast Refresh
        if ((mapContainerRef.current as unknown as { _leaflet_id?: number | null })._leaflet_id) {
          (mapContainerRef.current as unknown as { _leaflet_id?: number | null })._leaflet_id = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [12.9716, 77.5946],
          zoom: 13,
          zoomControl: false,
        });

        // Add Zoom control to bottom-right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // CartoDB Dark Matter tile layer (Ideal for BLR ink-black theme)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        if (isMounted) setMapLoaded(true);
      } catch (err) {
        console.warn("Leaflet map initialization warning, falling back to radar view:", err);
        if (isMounted) setIsLeafletAvailable(false);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers with Places
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;

        // Custom HTML Marker matching BLR Art Direction
        const customIcon = L.divIcon({
          className: "custom-blr-marker",
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${isSelected ? "32px" : "24px"};
              height: ${isSelected ? "32px" : "24px"};
              background-color: ${isSelected ? "#D8F45A" : "#10110F"};
              color: ${isSelected ? "#10110F" : "#D8F45A"};
              border: 2px solid ${isSelected ? "#10110F" : "#D8F45A"};
              box-shadow: 0 0 ${isSelected ? "15px rgba(216,244,90,0.8)" : "5px rgba(0,0,0,0.5)"};
              font-family: var(--font-mono), monospace;
              font-size: 11px;
              font-weight: bold;
              transition: all 0.2s ease;
              cursor: pointer;
            ">
              ${isSelected ? "●" : "▲"}
            </div>
          `,
          iconSize: isSelected ? [32, 32] : [24, 24],
          iconAnchor: isSelected ? [16, 16] : [12, 12],
        });

        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: customIcon,
          title: place.name,
        }).addTo(map);

        marker.on("click", () => {
          onSelectPlace(place);
        });

        markersRef.current[place.id] = marker;
      });
    }

    updateMarkers();
  }, [places, selectedPlace, mapLoaded, onSelectPlace]);

  // Center on Selected Place
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !selectedPlace) return;
    mapInstanceRef.current.flyTo(
      [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
      14,
      { duration: 0.8 }
    );
  }, [selectedPlace, mapLoaded]);

  // Fallback Interactive Radar Grid View if Leaflet cannot fetch tiles
  if (!isLeafletAvailable) {
    return (
      <div className="relative h-full w-full border border-[#262724] bg-[#10110F] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#262724] pb-2 text-xs font-mono text-[#AAA99F]">
          <span>RADAR GRID FALLBACK (12.97° N, 77.59° E)</span>
          <span className="text-[#D8F45A]">SELECTABLE PLACES</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto py-6">
          {places.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <button
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className={`p-3 text-left border font-mono text-xs transition-colors ${
                  isSelected
                    ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                    : "bg-[#171815] text-[#F1EBDD] border-[#262724] hover:border-[#D8F45A]"
                }`}
              >
                <div className="text-[10px] text-[#AAA99F]">{place.neighborhood}</div>
                <div className="font-semibold truncate">{place.name}</div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-[#686760] text-center">
          Tap any coordinate box to inspect details.
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden border border-[#262724] bg-[#10110F]">
      {/* Map Viewport Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Legend Overlay */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex flex-col gap-1 border border-[#262724] bg-[#10110F]/90 px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#D8F45A]">
          <span className="h-1.5 w-1.5 bg-[#D8F45A] animate-pulse" />
          <span>BLR CARTOGRAPHY RADAR</span>
        </div>
        <div className="font-mono text-[10px] text-[#AAA99F]">
          Showing {places.length} active stations
        </div>
      </div>

      {/* Recenter button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([12.9716, 77.5946], 13);
          }
        }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 border border-[#262724] bg-[#10110F]/90 px-3 py-1.5 font-mono text-[11px] text-[#F1EBDD] hover:border-[#D8F45A] hover:text-[#D8F45A] transition-colors backdrop-blur-md"
        title="Reset map to CBD center"
      >
        <Navigation size={12} className="text-[#D8F45A]" />
        <span>RECENTER</span>
      </button>
    </div>
  );
}

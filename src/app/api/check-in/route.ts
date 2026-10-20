import { NextResponse } from "next/server";
import { PLACES } from "@/data/places";
import { QUESTS } from "@/data/quests";

function haversineDistanceMeters(
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      placeId,
      questId,
      stopId,
      mode = "demo-action",
      userCoords,
      completedStopIds = [],
      alreadyCheckedInPlaceIds = [],
    } = body;

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: placeId" },
        { status: 400 }
      );
    }

    // 1. Validate place exists in curated registry
    const place = PLACES.find((p) => p.id === placeId);
    if (!place) {
      return NextResponse.json(
        { success: false, error: `Place '${placeId}' is not registered in the BLR database.` },
        { status: 404 }
      );
    }

    const verifiedBy: "gps" | "demo-action" = mode === "gps" ? "gps" : "demo-action";
    let distanceMeters: number | undefined = undefined;

    // 2. Validate GPS coordinates if mode is GPS
    if (mode === "gps") {
      if (!userCoords || typeof userCoords.lat !== "number" || typeof userCoords.lng !== "number") {
        return NextResponse.json(
          { success: false, error: "Valid client coordinates (lat, lng) are required for GPS verification." },
          { status: 400 }
        );
      }

      distanceMeters = haversineDistanceMeters(userCoords, place.coordinates);
      const allowedRadius = Number(process.env.NEXT_PUBLIC_GPS_CHECKIN_RADIUS_METERS || 500);

      if (distanceMeters > allowedRadius) {
        return NextResponse.json(
          {
            success: false,
            error: `Physical check-in out of range: you are ${distanceMeters}m away from ${place.name} (allowed threshold: ${allowedRadius}m). You must be at the physical location, or use simulated demo action.`,
            distanceMeters,
          },
          { status: 400 }
        );
      }
    }

    // 3. Quest Stop Validation
    if (questId && stopId) {
      const quest = QUESTS.find((q) => q.id === questId);
      if (!quest) {
        return NextResponse.json(
          { success: false, error: `Quest '${questId}' not found.` },
          { status: 404 }
        );
      }

      const stop = quest.stops.find((s) => s.id === stopId);
      if (!stop) {
        return NextResponse.json(
          { success: false, error: `Stop '${stopId}' not found in quest '${questId}'.` },
          { status: 400 }
        );
      }

      if (stop.placeId !== placeId) {
        return NextResponse.json(
          { success: false, error: `Stop place ID mismatch.` },
          { status: 400 }
        );
      }

      // Check if stop was already completed: NO REPEATED XP AWARD!
      if (completedStopIds.includes(stopId)) {
        return NextResponse.json(
          {
            success: false,
            error: `Checkpoint '${stop.placeName}' has already been verified and its XP claimed.`,
          },
          { status: 400 }
        );
      }

      // Verify sequence ordering
      if (stop.order > 1) {
        const prevStop = quest.stops.find((s) => s.order === stop.order - 1);
        if (prevStop && !completedStopIds.includes(prevStop.id)) {
          return NextResponse.json(
            {
              success: false,
              error: `You must verify stop 0${prevStop.order} (${prevStop.placeName}) before advancing to this checkpoint.`,
            },
            { status: 400 }
          );
        }
      }

      const awardedXp = stop.xpReward;
      const nextCompletedStops = [...completedStopIds, stopId];
      const isQuestFullyCompleted = nextCompletedStops.length >= quest.stops.length;
      const bonusXp = isQuestFullyCompleted ? quest.rewardXp : 0;

      let badgeUnlocked: string | undefined = undefined;
      if (isQuestFullyCompleted) {
        if (questId === "after-hours-route") badgeUnlocked = "nightcrawler-blr";
        if (questId === "parks-and-palaces") badgeUnlocked = "sultan-of-green";
        if (questId === "cafe-crawl") badgeUnlocked = "roast-master";
      }

      const message =
        verifiedBy === "gps" && distanceMeters !== undefined
          ? `GPS Verified (${distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`} from target). Checkpoint verified! +${awardedXp} XP awarded.${bonusXp ? ` Quest completed! +${bonusXp} bonus XP!` : ""}`
          : `Checkpoint verified at ${stop.placeName}! +${awardedXp} XP awarded.${bonusXp ? ` Quest completed! +${bonusXp} bonus XP!` : ""}`;

      return NextResponse.json({
        success: true,
        verifiedBy,
        distanceMeters,
        placeId: place.id,
        placeName: stop.placeName,
        neighborhood: quest.neighborhood,
        xpAwarded: awardedXp,
        bonusXp,
        isQuestCompleted: isQuestFullyCompleted,
        badgeUnlocked,
        timestamp: new Date().toISOString(),
        message,
      });
    }

    // 4. Standalone Place Check-in Validation
    // Prevent repeated XP farming for the same place
    if (alreadyCheckedInPlaceIds.includes(placeId)) {
      return NextResponse.json(
        {
          success: false,
          error: `You have already stamped ${place.name} into your explorer passport. Additional XP cannot be earned repeatedly.`,
        },
        { status: 400 }
      );
    }

    const xpEarned = 50;
    let badgeUnlocked: string | undefined = undefined;

    if (alreadyCheckedInPlaceIds.length === 0) {
      badgeUnlocked = "first-checkin";
    } else if (placeId === "church-street") {
      badgeUnlocked = "church-street-flaneur";
    }

    const message =
      verifiedBy === "gps" && distanceMeters !== undefined
        ? `GPS Verified (${distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`} from target). Stamped ${place.name}! +${xpEarned} XP awarded.`
        : `Check-in recorded for ${place.name}! +${xpEarned} XP awarded.`;

    return NextResponse.json({
      success: true,
      verifiedBy,
      distanceMeters,
      placeId: place.id,
      placeName: place.name,
      neighborhood: place.neighborhood,
      xpAwarded: xpEarned,
      bonusXp: 0,
      isQuestCompleted: false,
      badgeUnlocked,
      timestamp: new Date().toISOString(),
      message,
    });
  } catch (err) {
    console.error("Check-in validation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error validating check-in." },
      { status: 500 }
    );
  }
}

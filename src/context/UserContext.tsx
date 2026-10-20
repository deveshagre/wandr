"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";
import { UserProgress, CheckInRecord, Badge } from "@/types";
import { QUESTS } from "@/data/quests";
import { ALL_BADGES } from "@/data/badges";

export interface CheckInResult {
  success: boolean;
  message: string;
  xpAwarded?: number;
  newBadge?: Badge;
  distanceMeters?: number;
}

export interface UserContextType {
  user: UserProgress;
  isHydrated: boolean;
  updateProfile: (name: string, bio: string) => void;
  toggleSavePlace: (placeId: string) => void;
  isPlaceSaved: (placeId: string) => boolean;
  startQuest: (questId: string) => void;
  completeQuestStop: (questId: string, stopId: string, bypassGps?: boolean) => Promise<CheckInResult>;
  checkInAtPlace: (
    placeId: string,
    placeName: string,
    neighborhood: string,
    placeCoords: { lat: number; lng: number },
    bypassGps?: boolean
  ) => Promise<CheckInResult>;
  resetDemoData: () => void;
  activeBadgeNotification: Badge | null;
  clearBadgeNotification: () => void;
  isQuestStarted: (questId: string) => boolean;
  isQuestCompleted: (questId: string) => boolean;
  getQuestProgress: (questId: string) => { completed: number; total: number; isCompleted: boolean };
}

const DEFAULT_USER: UserProgress = {
  displayName: "Urban Nomad",
  handle: "explorer_560",
  bio: "Documenting vintage Bengaluru signs, quiet park benches, and filter coffee roasts.",
  avatarSeed: "urban-nomad-560",
  totalXp: 420,
  level: 3,
  rankTitle: "Cartographer",
  savedPlaceIds: ["cubbon-park", "koshys-cafe", "church-street"],
  completedQuestIds: [],
  activeQuestProgress: {
    "after-hours-route": {
      currentStopIndex: 1,
      completedStopIds: ["ahr-1"],
      startedAt: "2026-10-19T10:00:00.000Z",
    },
  },
  unlockedBadges: ["first-checkin", "church-street-flaneur"],
  checkInHistory: [
    {
      id: "init-checkin-1",
      placeId: "koshys-cafe",
      placeName: "Koshy's Parade Café",
      neighborhood: "St. Marks Road",
      timestamp: "2026-10-19T11:30:00.000Z",
      xpEarned: 75,
      verifiedBy: "demo-action",
    },
    {
      id: "init-checkin-2",
      placeId: "blossoms-book-house",
      placeName: "Blossoms Book House",
      neighborhood: "Church Street",
      timestamp: "2026-10-18T18:00:00.000Z",
      xpEarned: 50,
      verifiedBy: "demo-action",
    },
  ],
};

function calculateLevel(xp: number): { level: number; rankTitle: string } {
  if (xp < 200) return { level: 1, rankTitle: "Novice Flâneur" };
  if (xp < 500) return { level: 2, rankTitle: "Street Scout" };
  if (xp < 1000) return { level: 3, rankTitle: "Cartographer" };
  if (xp < 2000) return { level: 4, rankTitle: "City Chronicler" };
  return { level: 5, rankTitle: "Sovereign of BLR" };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const emptySubscribe = () => () => {};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [user, setUser] = useState<UserProgress>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("blr_user_progress_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...DEFAULT_USER,
            ...parsed,
            activeQuestProgress: parsed.activeQuestProgress || {},
            savedPlaceIds: parsed.savedPlaceIds || [],
            completedQuestIds: parsed.completedQuestIds || [],
            unlockedBadges: parsed.unlockedBadges || [],
            checkInHistory: parsed.checkInHistory || [],
          };
        }
      } catch (e) {
        console.warn("Could not read stored user progress from localStorage:", e);
      }
    }
    return DEFAULT_USER;
  });

  const [activeBadgeNotification, setActiveBadgeNotification] = useState<Badge | null>(null);

  // Save to localStorage whenever user state changes, but only after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("blr_user_progress_v2", JSON.stringify(user));
    } catch (e) {
      console.warn("Could not persist user progress to localStorage:", e);
    }
  }, [user, isHydrated]);

  const updateProfile = (name: string, bio: string) => {
    setUser((prev) => ({
      ...prev,
      displayName: name.trim() || prev.displayName,
      bio: bio.trim() || prev.bio,
    }));
  };

  const toggleSavePlace = (placeId: string) => {
    setUser((prev) => {
      const exists = prev.savedPlaceIds.includes(placeId);
      const newSaved = exists
        ? prev.savedPlaceIds.filter((id) => id !== placeId)
        : [...prev.savedPlaceIds, placeId];

      const newBadges = [...prev.unlockedBadges];
      let unlockedNotice: Badge | null = null;
      if (newSaved.length >= 3 && !newBadges.includes("heritage-chronicler")) {
        newBadges.push("heritage-chronicler");
        const b = ALL_BADGES.find((x) => x.id === "heritage-chronicler");
        if (b) unlockedNotice = b;
      }

      if (unlockedNotice) {
        setActiveBadgeNotification(unlockedNotice);
      }

      return {
        ...prev,
        savedPlaceIds: newSaved,
        unlockedBadges: newBadges,
      };
    });
  };

  const isPlaceSaved = (placeId: string) => {
    return user.savedPlaceIds.includes(placeId);
  };

  const startQuest = (questId: string) => {
    setUser((prev) => {
      if (prev.activeQuestProgress[questId]) return prev;
      return {
        ...prev,
        activeQuestProgress: {
          ...prev.activeQuestProgress,
          [questId]: {
            currentStopIndex: 0,
            completedStopIds: [],
            startedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const completeQuestStop = async (
    questId: string,
    stopId: string,
    bypassGps = true
  ): Promise<CheckInResult> => {
    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return { success: false, message: "Quest not found." };

    const stop = quest.stops.find((s) => s.id === stopId);
    if (!stop) return { success: false, message: "Stop not found." };

    const qProgress = user.activeQuestProgress[questId] || {
      currentStopIndex: 0,
      completedStopIds: [],
      startedAt: new Date().toISOString(),
    };

    // Client-side guard against duplicate XP
    if (qProgress.completedStopIds.includes(stopId)) {
      return {
        success: false,
        message: `Checkpoint '${stop.placeName}' already verified. XP cannot be claimed again.`,
      };
    }

    let userCoords: { lat: number; lng: number } | undefined = undefined;
    const mode: "gps" | "demo-action" = bypassGps ? "demo-action" : "gps";

    if (!bypassGps) {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        return {
          success: false,
          message: "Geolocation is not supported by your browser. Use simulated demo check-in.",
        };
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 5000,
          });
        });
        userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (geoErr) {
        const err = geoErr as GeolocationPositionError;
        if (err.code === 1) {
          return {
            success: false,
            message: "Location permission denied. Please allow location access or use simulated demo check-in.",
          };
        } else if (err.code === 2) {
          return {
            success: false,
            message: "GPS position unavailable. Please check your device location services.",
          };
        } else {
          return {
            success: false,
            message: "GPS request timed out. Please retry or use simulated demo check-in.",
          };
        }
      }
    }

    // Server-side validation
    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: stop.placeId,
          questId,
          stopId,
          mode,
          userCoords,
          completedStopIds: qProgress.completedStopIds,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.error || "Server validation failed.",
          distanceMeters: data.distanceMeters,
        };
      }

      const awardedXp: number = data.xpAwarded || stop.xpReward;
      const bonusXp: number = data.bonusXp || 0;
      let unlockedBadge: Badge | null = null;

      if (data.badgeUnlocked) {
        const b = ALL_BADGES.find((x) => x.id === data.badgeUnlocked);
        if (b) unlockedBadge = b;
      }

      setUser((prev) => {
        const currentQ = prev.activeQuestProgress[questId] || {
          currentStopIndex: 0,
          completedStopIds: [],
          startedAt: new Date().toISOString(),
        };

        if (currentQ.completedStopIds.includes(stopId)) {
          return prev;
        }

        const updatedStops = [...currentQ.completedStopIds, stopId];
        const isQuestFullyCompleted =
          data.isQuestCompleted || updatedStops.length >= quest.stops.length;

        const newCompletedQuests =
          isQuestFullyCompleted && !prev.completedQuestIds.includes(questId)
            ? [...prev.completedQuestIds, questId]
            : prev.completedQuestIds;

        const nextTotalXp = prev.totalXp + awardedXp + bonusXp;
        const { level, rankTitle } = calculateLevel(nextTotalXp);

        const updatedBadges = [...prev.unlockedBadges];
        if (data.badgeUnlocked && !updatedBadges.includes(data.badgeUnlocked)) {
          updatedBadges.push(data.badgeUnlocked);
        }

        if (nextTotalXp >= 400 && !updatedBadges.includes("cartographer-level-3")) {
          updatedBadges.push("cartographer-level-3");
        }

        const checkInRecord: CheckInRecord = {
          id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          placeId: stop.placeId,
          placeName: stop.placeName,
          neighborhood: quest.neighborhood,
          timestamp: data.timestamp || new Date().toISOString(),
          xpEarned: awardedXp + bonusXp,
          verifiedBy: data.verifiedBy || mode,
        };

        return {
          ...prev,
          totalXp: nextTotalXp,
          level,
          rankTitle,
          completedQuestIds: newCompletedQuests,
          activeQuestProgress: {
            ...prev.activeQuestProgress,
            [questId]: {
              ...currentQ,
              completedStopIds: updatedStops,
              currentStopIndex: Math.min(currentQ.currentStopIndex + 1, quest.stops.length - 1),
            },
          },
          unlockedBadges: updatedBadges,
          checkInHistory: [checkInRecord, ...prev.checkInHistory],
        };
      });

      if (unlockedBadge) {
        setActiveBadgeNotification(unlockedBadge);
      }

      return {
        success: true,
        message: data.message,
        xpAwarded: awardedXp + bonusXp,
        newBadge: unlockedBadge || undefined,
        distanceMeters: data.distanceMeters,
      };
    } catch (networkErr) {
      console.error("Network error calling check-in API:", networkErr);
      return {
        success: false,
        message: "Failed to connect to BLR verification server. Please check connection.",
      };
    }
  };

  const checkInAtPlace = async (
    placeId: string,
    placeName: string,
    neighborhood: string,
    placeCoords: { lat: number; lng: number },
    bypassGps = false
  ): Promise<CheckInResult> => {
    // Client-side guard: check if user already checked in at this place
    const alreadyCheckedIn = user.checkInHistory.some((c) => c.placeId === placeId);
    if (alreadyCheckedIn) {
      return {
        success: false,
        message: `You have already stamped ${placeName} in your passport. No duplicate XP awarded.`,
      };
    }

    let userCoords: { lat: number; lng: number } | undefined = undefined;
    const mode: "gps" | "demo-action" = bypassGps ? "demo-action" : "gps";

    if (!bypassGps) {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        return {
          success: false,
          message: "Geolocation is not supported by your browser. Use simulated demo check-in.",
        };
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 5000,
          });
        });
        userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (geoErr) {
        const err = geoErr as GeolocationPositionError;
        if (err.code === 1) {
          return {
            success: false,
            message: "Location permission denied. Please allow location access or use simulated demo check-in.",
          };
        } else if (err.code === 2) {
          return {
            success: false,
            message: "GPS position unavailable. Please check device location services.",
          };
        } else {
          return {
            success: false,
            message: "GPS request timed out. Please retry or use simulated demo check-in.",
          };
        }
      }
    }

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          mode,
          userCoords,
          alreadyCheckedInPlaceIds: user.checkInHistory.map((c) => c.placeId),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.error || "Server validation failed.",
          distanceMeters: data.distanceMeters,
        };
      }

      const xpEarned: number = data.xpAwarded || 50;
      let unlockedBadge: Badge | null = null;

      if (data.badgeUnlocked) {
        const b = ALL_BADGES.find((x) => x.id === data.badgeUnlocked);
        if (b) unlockedBadge = b;
      }

      setUser((prev) => {
        const nextTotalXp = prev.totalXp + xpEarned;
        const { level, rankTitle } = calculateLevel(nextTotalXp);
        const updatedBadges = [...prev.unlockedBadges];

        if (data.badgeUnlocked && !updatedBadges.includes(data.badgeUnlocked)) {
          updatedBadges.push(data.badgeUnlocked);
        }

        const checkInRecord: CheckInRecord = {
          id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          placeId,
          placeName,
          neighborhood,
          timestamp: data.timestamp || new Date().toISOString(),
          xpEarned,
          verifiedBy: data.verifiedBy || mode,
        };

        return {
          ...prev,
          totalXp: nextTotalXp,
          level,
          rankTitle,
          unlockedBadges: updatedBadges,
          checkInHistory: [checkInRecord, ...prev.checkInHistory],
        };
      });

      if (unlockedBadge) {
        setActiveBadgeNotification(unlockedBadge);
      }

      return {
        success: true,
        message: data.message,
        xpAwarded: xpEarned,
        newBadge: unlockedBadge || undefined,
        distanceMeters: data.distanceMeters,
      };
    } catch (networkErr) {
      console.error("Network error calling check-in API:", networkErr);
      return {
        success: false,
        message: "Failed to connect to BLR verification server. Please check connection.",
      };
    }
  };

  const isQuestStarted = (questId: string) => {
    return Boolean(user.activeQuestProgress[questId]);
  };

  const isQuestCompleted = (questId: string) => {
    return user.completedQuestIds.includes(questId);
  };

  const getQuestProgress = (questId: string) => {
    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return { completed: 0, total: 0, isCompleted: false };
    const prog = user.activeQuestProgress[questId];
    const completedCount = prog ? prog.completedStopIds.length : 0;
    return {
      completed: completedCount,
      total: quest.stops.length,
      isCompleted: user.completedQuestIds.includes(questId) || completedCount >= quest.stops.length,
    };
  };

  const resetDemoData = () => {
    setUser(DEFAULT_USER);
    try {
      localStorage.removeItem("blr_user_progress_v2");
    } catch {
      // ignore
    }
  };

  const clearBadgeNotification = () => {
    setActiveBadgeNotification(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isHydrated,
        updateProfile,
        toggleSavePlace,
        isPlaceSaved,
        startQuest,
        completeQuestStop,
        checkInAtPlace,
        resetDemoData,
        activeBadgeNotification,
        clearBadgeNotification,
        isQuestStarted,
        isQuestCompleted,
        getQuestProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export type Category = 
  | "all"
  | "cafes"
  | "food"
  | "parks"
  | "nightlife"
  | "art"
  | "culture"
  | "shopping";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  kannadaName?: string;
  category: Category;
  neighborhood: string;
  coordinates: Coordinates;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  imageUrl: string;
  address: string;
  establishedYear?: number;
  tags: string[];
  tips?: string;
  relatedQuestId?: string;
}

export interface QuestStop {
  id: string;
  placeId: string;
  placeName: string;
  order: number;
  objective: string;
  hint: string;
  xpReward: number;
  coordinates: Coordinates;
}

export interface Quest {
  id: string;
  title: string;
  subtitle: string;
  neighborhood: string;
  durationMinutes: number;
  stopsCount: number;
  difficulty: "Easy" | "Medium" | "Challenging";
  rewardXp: number;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  description: string;
  story: string;
  imageUrl: string;
  stops: QuestStop[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "quest" | "exploration" | "streak" | "social";
  unlockedAt?: string;
}

export interface CheckInRecord {
  id: string;
  placeId: string;
  placeName: string;
  neighborhood: string;
  timestamp: string;
  xpEarned: number;
  verifiedBy: "gps" | "demo-action";
}

export interface UserProgress {
  displayName: string;
  handle: string;
  bio: string;
  avatarSeed: string;
  totalXp: number;
  level: number;
  rankTitle: string;
  savedPlaceIds: string[];
  completedQuestIds: string[];
  activeQuestProgress: Record<string, {
    currentStopIndex: number;
    completedStopIds: string[];
    startedAt: string;
  }>;
  unlockedBadges: string[];
  checkInHistory: CheckInRecord[];
}

export interface LeaderboardUser {
  rank: number;
  displayName: string;
  handle: string;
  neighborhood: string;
  xp: number;
  completedQuests: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { ALL_BADGES } from "@/data/badges";
import { PLACES } from "@/data/places";
import { 
  Award, 
  Bookmark, 
  History, 
  Edit3, 
  Check, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink,
  Lock
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, toggleSavePlace, resetDemoData } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showOAuthInfo, setShowOAuthInfo] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(user.displayName);
  const [bioInput, setBioInput] = useState(user.bio);
  const [activeTab, setActiveTab] = useState<"badges" | "saved" | "history">("badges");

  const handleSaveProfile = () => {
    updateProfile(nameInput, bioInput);
    setIsEditing(false);
  };

  const savedPlaces = PLACES.filter((p) => user.savedPlaceIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#10110F] text-[#F1EBDD] py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="border border-[#262724] bg-[#171815] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#262724]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center bg-[#D8F45A] text-[#10110F] font-mono text-2xl font-extrabold border-2 border-[#10110F]">
                L{user.level}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-[family-name:var(--font-bebas)] text-3xl sm:text-4xl font-extrabold text-[#F1EBDD]">
                    {user.displayName}
                  </h1>
                  <span className="border border-[#D8F45A] bg-[#D8F45A]/10 px-2 py-0.5 font-mono text-[9px] uppercase text-[#D8F45A]">
                    {user.rankTitle}
                  </span>
                </div>
                <div className="font-mono text-xs text-[#AAA99F] mt-0.5">
                  @{user.handle} • MEMBER OF SECTOR 560
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setNameInput(user.displayName);
                  setBioInput(user.bio);
                  setIsEditing(true);
                }
              }}
              className="flex items-center gap-2 border border-[#262724] bg-[#10110F] px-4 py-2 font-mono text-xs uppercase text-[#F1EBDD] hover:border-[#D8F45A] hover:text-[#D8F45A] transition-colors"
            >
              {isEditing ? (
                <>
                  <Check size={14} className="text-[#D8F45A]" />
                  <span>SAVE CHANGES</span>
                </>
              ) : (
                <>
                  <Edit3 size={14} />
                  <span>EDIT PROFILE</span>
                </>
              )}
            </button>
          </div>

          {/* Bio or Edit Form */}
          <div className="pt-6">
            {isEditing ? (
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#AAA99F] block mb-1">
                    DISPLAY NAME
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full border border-[#262724] bg-[#10110F] px-3 py-2 font-mono text-xs text-[#F1EBDD] focus:border-[#D8F45A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase text-[#AAA99F] block mb-1">
                    EXPLORER MANIFESTO (BIO)
                  </label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full border border-[#262724] bg-[#10110F] px-3 py-2 font-mono text-xs text-[#F1EBDD] focus:border-[#D8F45A] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <p className="font-mono text-xs leading-relaxed text-[#AAA99F] max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>

          {/* XP & Stats Counter */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#262724] pt-6 sm:grid-cols-4">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">TOTAL EARNED XP</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#D8F45A]">
                {user.totalXp} XP
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">BADGES UNLOCKED</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#F1EBDD]">
                {user.unlockedBadges.length} / {ALL_BADGES.length}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">SAVED ARCHIVES</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#F1EBDD]">
                {user.savedPlaceIds.length}
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#AAA99F]">CHECK-INS LOGGED</span>
              <div className="font-[family-name:var(--font-bebas)] text-3xl text-[#D8F45A]">
                {user.checkInHistory.length}
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        <div className="mt-6 border border-[#262724] bg-[#171815] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#AAA99F]">
            <ShieldCheck size={16} className="text-[#D8F45A] shrink-0" />
            <span>
              Google OAuth integration is in local development mode. Client state is securely synchronized to browser storage.
            </span>
          </div>
          <button
            onClick={() => setShowOAuthInfo(!showOAuthInfo)}
            className="border border-[#262724] bg-[#10110F] px-3 py-1.5 font-mono text-[10px] uppercase text-[#F1EBDD] hover:border-[#D8F45A] shrink-0 min-h-[44px]"
            aria-expanded={showOAuthInfo}
          >
            {showOAuthInfo ? "HIDE INFO" : "OAUTH SETUP INFO"}
          </button>
        </div>

        {/* Expandable OAuth Guidance Card */}
        {showOAuthInfo && (
          <div className="mt-3 border border-[#D8F45A]/40 bg-[#10110F] p-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#262724] pb-2 mb-3">
              <span className="font-bold text-[#D8F45A]">AUTHENTICATION REQUIREMENTS</span>
              <button
                onClick={() => setShowOAuthInfo(false)}
                className="text-[#AAA99F] hover:text-[#F1EBDD] px-2 py-1"
                aria-label="Close OAuth info"
              >
                ✕
              </button>
            </div>
            <p className="text-[#AAA99F] leading-relaxed">
              To activate multi-device cloud synchronization via Google OAuth, configure the following environment credentials in your local <code className="text-[#F1EBDD] bg-[#171815] px-1 py-0.5">.env.local</code> file:
            </p>
            <div className="mt-2.5 bg-[#171815] p-3 border border-[#262724] text-[11px] text-[#F1EBDD] space-y-1 overflow-x-auto">
              <div>NEXT_PUBLIC_GOOGLE_CLIENT_ID=&lt;your-client-id&gt;.apps.googleusercontent.com</div>
              <div>GOOGLE_CLIENT_SECRET=&lt;server-only-secret&gt;</div>
              <div>NEXTAUTH_SECRET=&lt;secure-session-key&gt;</div>
            </div>
            <p className="mt-2 text-[11px] text-[#686760]">
              In local offline mode, all progress, XP, completed quest stops, and earned badges persist securely in your browser&apos;s local storage.
            </p>
          </div>
        )}

        {/* Navigation Tabs for Profile Content */}
        <div className="mt-8 flex items-center gap-2 border-b border-[#262724] pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("badges")}
            className={`min-h-[44px] flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap ${
              activeTab === "badges"
                ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:text-[#F1EBDD]"
            }`}
          >
            <Award size={14} />
            <span>BADGES ({user.unlockedBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`min-h-[44px] flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap ${
              activeTab === "saved"
                ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:text-[#F1EBDD]"
            }`}
          >
            <Bookmark size={14} />
            <span>SAVED PLACES ({savedPlaces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`min-h-[44px] flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap ${
              activeTab === "history"
                ? "bg-[#D8F45A] text-[#10110F] border-[#D8F45A] font-bold"
                : "bg-[#171815] text-[#AAA99F] border-[#262724] hover:text-[#F1EBDD]"
            }`}
          >
            <History size={14} />
            <span>VISIT JOURNAL ({user.checkInHistory.length})</span>
          </button>
        </div>

        {/* Tab 1: Badges */}
        {activeTab === "badges" && (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ALL_BADGES.map((badge) => {
                const unlocked = user.unlockedBadges.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`border p-5 text-center transition-all ${
                      unlocked
                        ? "border-[#D8F45A] bg-[#171815]"
                        : "border-[#262724] bg-[#10110F]/40 opacity-40"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center font-mono text-xl ${
                        unlocked
                          ? "bg-[#D8F45A] text-[#10110F]"
                          : "border border-[#262724] bg-[#171815] text-[#686760]"
                      }`}
                    >
                      {unlocked ? <Award size={24} /> : <Lock size={20} />}
                    </div>

                    <h4 className="font-[family-name:var(--font-bebas)] text-xl font-bold text-[#F1EBDD]">
                      {badge.name}
                    </h4>
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#AAA99F]">
                      {badge.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#262724] font-mono text-[9px] uppercase">
                      {unlocked ? (
                        <span className="text-[#D8F45A] font-bold">UNLOCKED IN PASSPORT</span>
                      ) : (
                        <span className="text-[#686760]">LOCKED • EXPLORE TO UNSEAL</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Places */}
        {activeTab === "saved" && (
          <div className="mt-8">
            {savedPlaces.length === 0 ? (
              <div className="border border-[#262724] bg-[#171815] p-12 text-center font-mono">
                <Bookmark size={32} className="mx-auto text-[#686760] mb-3" />
                <h3 className="font-[family-name:var(--font-bebas)] text-2xl text-[#F1EBDD]">
                  NO SAVED STATIONS
                </h3>
                <p className="mt-1 text-xs text-[#AAA99F]">
                  Bookmark places from the exploration map or catalog to access them quickly here.
                </p>
                <Link
                  href="/explore"
                  className="mt-4 inline-block bg-[#D8F45A] px-4 py-2 text-xs font-bold uppercase text-[#10110F]"
                >
                  EXPLORE PLACES
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="border border-[#262724] bg-[#171815] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-32 w-full overflow-hidden border border-[#262724] mb-3">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-[9px] uppercase text-[#D8F45A]">
                        {place.category} • {place.neighborhood}
                      </span>
                      <h4 className="font-[family-name:var(--font-bebas)] text-2xl font-bold text-[#F1EBDD] mt-1">
                        {place.name}
                      </h4>
                      <p className="font-mono text-xs text-[#AAA99F] line-clamp-2 mt-1">
                        {place.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#262724] flex items-center justify-between">
                      <Link
                        href={`/places/${place.id}`}
                        className="font-mono text-xs text-[#D8F45A] hover:underline flex items-center gap-1"
                      >
                        <span>DOSSIER</span>
                        <ExternalLink size={12} />
                      </Link>

                      <button
                        onClick={() => toggleSavePlace(place.id)}
                        className="text-[#AAA99F] hover:text-red-400 font-mono text-xs flex items-center gap-1"
                        title="Remove bookmark"
                      >
                        <Trash2 size={13} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Check-in Journal */}
        {activeTab === "history" && (
          <div className="mt-8 border border-[#262724] bg-[#171815]">
            <div className="p-4 border-b border-[#262724] flex items-center justify-between font-mono text-xs text-[#AAA99F]">
              <span>TIMESTAMPED VISIT JOURNAL</span>
              <span className="text-[#D8F45A]">{user.checkInHistory.length} ENTRIES</span>
            </div>

            {user.checkInHistory.length === 0 ? (
              <div className="p-10 text-center font-mono text-xs text-[#AAA99F]">
                No check-in entries logged yet. Visit locations on the map or start a quest.
              </div>
            ) : (
              <div className="divide-y divide-[#262724]">
                {user.checkInHistory.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F1EBDD]">{item.placeName}</span>
                        <span className="text-[10px] text-[#AAA99F]">• {item.neighborhood}</span>
                      </div>
                      <div className="text-[10px] text-[#686760] mt-0.5">
                        {new Date(item.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} • VERIFIED BY {item.verifiedBy.toUpperCase()}
                      </div>
                    </div>

                    <div className="text-[#D8F45A] font-bold sm:text-right shrink-0">
                      +{item.xpEarned} XP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reset Demo Data Action */}
        <div className="mt-16 border-t border-[#262724] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-[#686760]">
          <span>BLR PERSISTENCE ENGINE • CLIENT SECURE</span>
          <div className="flex items-center gap-4">
            {resetFeedback && (
              <span className="text-[#D8F45A] font-bold">{resetFeedback}</span>
            )}
            <button
              onClick={() => {
                resetDemoData();
                setResetFeedback("Progress reset to factory state.");
                setTimeout(() => setResetFeedback(null), 3000);
              }}
              className="flex items-center gap-1.5 hover:text-red-400 transition-colors min-h-[44px] px-2"
            >
              <RotateCcw size={12} />
              <span>RESET DEMO DATA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

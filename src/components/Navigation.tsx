"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { 
  Compass, 
  MapPin, 
  Trophy, 
  User as UserIcon, 
  Menu, 
  X, 
  ArrowUpRight
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "EXPLORE", href: "/explore", icon: Compass },
    { label: "QUESTS", href: "/quests", icon: ArrowUpRight },
    { label: "PLACES", href: "/places", icon: MapPin },
    { label: "LEADERBOARD", href: "/leaderboard", icon: Trophy },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#262724] bg-[#10110F]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Wordmark with Custom Directional Arrow */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-[#D8F45A]"
              aria-label="BLR Home"
            >
              <span className="font-[family-name:var(--font-bebas)] text-3xl font-extrabold tracking-tight text-[#F1EBDD] transition-colors group-hover:text-[#D8F45A]">
                BLR
              </span>
              {/* Custom Directional Arrow Symbol */}
              <div className="flex h-6 w-6 items-center justify-center border border-[#262724] bg-[#171815] transition-transform group-hover:rotate-45 group-hover:border-[#D8F45A]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#D8F45A]"
                >
                  <path
                    d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#AAA99F] sm:inline-block">
                560001
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider uppercase transition-colors ${
                      active
                        ? "text-[#10110F] bg-[#D8F45A] font-bold"
                        : "text-[#AAA99F] hover:text-[#F1EBDD] hover:bg-[#171815]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex min-h-[44px] items-center gap-2.5 border border-[#262724] bg-[#171815] px-3 py-1 transition-colors hover:border-[#D8F45A]"
              aria-label="User Profile"
            >
              <div className="flex h-5 w-5 items-center justify-center bg-[#D8F45A] text-[#10110F] font-mono text-[10px] font-bold">
                L{user.level}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-mono text-[11px] leading-tight font-semibold text-[#F1EBDD] max-w-[90px] truncate sm:max-w-none">
                  {user.displayName}
                </span>
                <span className="font-mono text-[9px] leading-none text-[#D8F45A]">
                  {user.totalXp} XP
                </span>
              </div>
            </Link>

            {/* Mobile menu toggle (>=44px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center border border-[#262724] bg-[#171815] text-[#F1EBDD] md:hidden focus:outline-none focus:ring-1 focus:ring-[#D8F45A]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-[#262724] bg-[#10110F] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-[44px] items-center justify-between px-4 py-2.5 text-sm font-mono tracking-wider uppercase transition-colors ${
                      active
                        ? "bg-[#D8F45A] text-[#10110F] font-bold"
                        : "bg-[#171815] text-[#AAA99F] hover:text-[#F1EBDD]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} />
                      {link.label}
                    </span>
                    <ArrowUpRight size={14} className={active ? "text-[#10110F]" : "text-[#AAA99F]"} />
                  </Link>
                );
              })}

              <div className="mt-2 pt-3 border-t border-[#262724] flex items-center justify-between text-xs font-mono text-[#AAA99F]">
                <span>BLR URBAN EXPLORATION</span>
                <span className="text-[#D8F45A] font-bold">{user.rankTitle}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Strict >=44px touch targets) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-[#262724] bg-[#10110F] px-1 md:hidden"
      >
        <Link
          href="/explore"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center py-1 font-mono text-[9px] uppercase tracking-wider ${
            pathname.startsWith("/explore") ? "text-[#D8F45A] font-bold" : "text-[#AAA99F]"
          }`}
        >
          <Compass size={18} className="mb-0.5" />
          <span>Map</span>
        </Link>
        <Link
          href="/quests"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center py-1 font-mono text-[9px] uppercase tracking-wider ${
            pathname.startsWith("/quests") ? "text-[#D8F45A] font-bold" : "text-[#AAA99F]"
          }`}
        >
          <ArrowUpRight size={18} className="mb-0.5" />
          <span>Quests</span>
        </Link>
        <Link
          href="/places"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center py-1 font-mono text-[9px] uppercase tracking-wider ${
            pathname.startsWith("/places") ? "text-[#D8F45A] font-bold" : "text-[#AAA99F]"
          }`}
        >
          <MapPin size={18} className="mb-0.5" />
          <span>Places</span>
        </Link>
        <Link
          href="/leaderboard"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center py-1 font-mono text-[9px] uppercase tracking-wider ${
            pathname.startsWith("/leaderboard") ? "text-[#D8F45A] font-bold" : "text-[#AAA99F]"
          }`}
        >
          <Trophy size={18} className="mb-0.5" />
          <span>Board</span>
        </Link>
        <Link
          href="/profile"
          className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center py-1 font-mono text-[9px] uppercase tracking-wider ${
            pathname.startsWith("/profile") ? "text-[#D8F45A] font-bold" : "text-[#AAA99F]"
          }`}
        >
          <UserIcon size={18} className="mb-0.5" />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}

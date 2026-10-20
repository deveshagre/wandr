import React from "react";
import { Hero } from "@/components/Hero";
import { FeaturedQuests } from "@/components/FeaturedQuests";
import { CityDiscovery } from "@/components/CityDiscovery";
import { HowItWorks } from "@/components/HowItWorks";
import { ClosingCTA } from "@/components/ClosingCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedQuests />
      <CityDiscovery />
      <HowItWorks />
      <ClosingCTA />
    </div>
  );
}

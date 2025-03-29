"use client";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function KeyFeatures() {
  return (
    <div className="w-full flex justify-center">
      <ul className="grid grid-cols-1 grid-rows-none max-w-7xl gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Real-time Disaster Tracking"
          description="Stay informed with live disaster data from NASA's EONET API, providing accurate and timely information about global disasters."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={
            <Settings className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Location-Based Alerts"
          description="Get personalized alerts based on your device location, helping you stay aware of nearby disasters and emergency situations."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Secure Google Authentication"
          description="Access your personalized disaster management dashboard securely with Google Sign-In integration."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={
            <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />
          }
          title="Email Notification Service"
          description="Stay updated with automated email alerts about disaster developments and emergency updates in your areas of interest."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
          title="Interactive Disaster Mapping"
          description="Visualize and track disasters worldwide with our interactive map interface, helping you understand the scope and impact of emergencies."
        />
      </ul>
    </div>
  );
}

const GridItem = ({ area, icon, title, description }) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2.5xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl md:text-2xl font-semibold font-sans text-black dark:text-white">
                {title}
              </h3>
              <h2 className="text-sm md:text-base font-sans text-black dark:text-neutral-400">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

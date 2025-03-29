"use client";

import React from "react";
import { motion } from "motion/react";
import { WorldMap } from "@/components/ui/world-map";
import { KeyFeatures } from "@/components/KeyFeatures";
import { InfiniteScroll } from "@/components/infiniteScroll";
import HeroSection from "@/components/HeroSection";
import { TextReveal } from "@/components/magicui/text-reveal";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      {/* <section className="relative flex flex-col items-center text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Disaster Manager</h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          Real-time alerts, interactive mapping, and secure communication for
          disaster response.
        </p>

        <div className="w-full h-64 bg-black rounded-md overflow-hidden mb-6">
          <video
            src="" // <--- Insert your video source here, or leave blank
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Get Started
        </button>
      </section> */}
      <HeroSection />

      {/* Global Disasters Section (World Map) */}
      <div className="py-40 dark:bg-black bg-white w-full">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
            Global{" "}
            <span className="text-neutral-400">
              {"Disasters".split("").map((letter, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
            These are some selected locations where any kind of disaster is
            happening right now.
          </p>
        </div>
        <WorldMap
          dots={[
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
            },
            {
              start: { lat: 64.2008, lng: -149.4937 },
              end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
              start: { lat: -15.7975, lng: -47.8919 },
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 28.6139, lng: 77.209 },
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
          ]}
        />
      </div>

      {/* Disaster Statistics Section */}
      <div className="py-20 bg-white dark:bg-neutral-900">
        <TextReveal>
          Currently tracking 47 active disasters worldwide, with 2.3 million
          people in affected regions. Our network connects 1,200+ emergency
          response teams and has facilitated 850 successful rescue operations
          this month.
        </TextReveal>
      </div>

      {/* Key Features Section (shadcn Cards) */}
      <div className=" pb-32">
        <KeyFeatures />
      </div>

      {/* Infinite Scroll Section (optional) */}
      {/* <InfiniteScroll /> */}
    </>
  );
}

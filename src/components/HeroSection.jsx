"use client";

import Link from "next/link";
import React from "react";
import { TextReveal } from "./magicui/text-reveal";

export default function HeroSection() {
  return (
    // <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
    //   {/* Background Video or Image */}
    //   <video
    //     className="absolute inset-0 w-full h-full object-cover opacity-70"
    //     src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fquick-saves--934567360159002542%2F&psig=AOvVaw0_eiIfvoX3Trjnj4GA143f&ust=1742401889447000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCYhISHlIwDFQAAAAAdAAAAABAE" // <-- Add your video source here (or replace with an image <img> tag)
    //     autoPlay
    //     loop
    //     muted
    //   />

    //   {/* Overlay for better text contrast */}
    //   <div className="absolute inset-0 bg-opacity-40" />

    //   {/* Hero Content */}
    //   <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
    //     <h1 className="text-5xl font-bold mb-4 leading-tight">
    //       Disaster Manager
    //     </h1>
    //     <p className="text-lg mb-6 text-neutral-200">
    //       Be prepared. Real-time alerts, interactive mapping, and secure
    //       communication for disaster response.
    //     </p>
    //     <div className="flex flex-col sm:flex-row gap-4 justify-center">
    //       <button className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
    //         View Live Map
    //       </button>
    //       <button className="px-6 py-3 rounded-md border border-white text-white hover:bg-white hover:text-black transition">
    //         Learn More
    //       </button>
    //     </div>
    //   </div>
    // </section>

    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Get disaster data without login.{" "}
            <a href="#" className="font-semibold text-blue-500">
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h2 className="mb-8 text-2xl font-medium text-gray-600">
            Your trusted companion in disaster preparedness and emergency
            response management
          </h2>
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            The Disaster Manager
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Empowering communities with real-time alerts, interactive mapping,
            and secure communication for effective disaster response and
            recovery.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/profile"
              className="rounded-md bg-neutral-100 px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-neutral-50 border border-black focus-visible:outline-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Get started
            </Link>
            {/* <button className="cursor-pointer px-4 py-2 rounded-md border flex flex-row gap-2 border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              <MailOpen className="mr-2" /> Get started
            </button> */}
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}

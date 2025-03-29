"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, BarChart3, MailOpen } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Next.js 13 client-side navigation
import { auth, provider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogPanel } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/"); // Redirect to home after login
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const navigation = [
    { name: "Map", href: "/map" },
    { name: "Alerts", href: "/alerts" },
    { name: "Guides", href: "/guides" },
    { name: "Chat", href: "/chat" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Donate", href: "/donate" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // <header className="flex justify-center sticky top-0 px-6 py-4 border-b z-50 backdrop-blur-lg border-gray-200">
    //   <div className="min-w-7xl flex items-center justify-between">
    //     {/* Logo & Project Title */}
    //     <div className="flex items-center">
    //       <p className="flex items-center text-xl font-semibold uppercase tracking-wide">
    //         <span className="-ml-1.5 inline-block -rotate-90 text-[10px] leading-[0]">
    //           The
    //         </span>
    //         <span className="ml-2 text-2xl tracking-tight">
    //           Disaster Manager
    //         </span>
    //       </p>
    //     </div>
    //     {/* Navigation Links */}
    //     <nav className="flex space-x-4 items-center">
    //       <Link href="/" passHref>
    //         <Button variant="link">Home</Button>
    //       </Link>
    //       <Link href="/map" passHref>
    //         <Button variant="link">Map</Button>
    //       </Link>
    //       <Link href="/alerts" passHref>
    //         <Button variant="link">Alerts</Button>
    //       </Link>
    //       <Link href="/guides" passHref>
    //         <Button variant="link">Guides</Button>
    //       </Link>
    //       <Link href="/chat" passHref>
    //         <Button variant="link">Chat</Button>
    //       </Link>
    //       <Link href="/admin" passHref>
    //         <Button variant="link">Admin</Button>
    //       </Link>
    // {/* User Account */}
    // {user ? (
    //   <Link href="/profile">
    //     <img
    //       src={user.photoURL}
    //       alt="User profile"
    //       className="rounded-full w-10 h-10"
    //     />
    //   </Link>
    // ) : (
    //   <button
    //     onClick={handleGoogleLogin}
    //     className="cursor-pointer px-4 py-2 rounded-md border flex flex-row gap-2 border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
    //   >
    //     <MailOpen className="mr-2" /> Login with Google
    //   </button>
    // )}
    //     </nav>
    //   </div>
    // </header>
    <header className="inset-x-0 sticky top-0 z-50 border-b backdrop-blur-lg border-gray-200">
      <nav
        aria-label="Global"
        className="flex items-center mx-auto w-full max-w-screen-2xl justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          {/* Logo & Project Title */}
          <div className="flex items-center">
            <Link href="/">
              <p className="flex items-center text-xl font-semibold uppercase tracking-wide">
                <span className="-ml-2 inline-block -rotate-90 text-[10px] leading-[0]">
                  The
                </span>
                <span className="ml-2 text-2xl tracking-tight">
                  Disaster Manager
                </span>
              </p>
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <BarChart3 aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* User Account */}
          {user ? (
            <Link href="/profile">
              <img
                src={user.photoURL}
                alt="User profile"
                className="rounded-full w-10 h-10"
              />
            </Link>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="cursor-pointer px-4 py-2 rounded-md font-bold border flex flex-row gap-2 border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              <FcGoogle size={22} /> Login with Google
            </button>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {/* User Account */}
                {user ? (
                  <Link href="/profile">
                    <img
                      src={user.photoURL}
                      alt="User profile"
                      className="rounded-full w-10 h-10"
                    />
                  </Link>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    className="cursor-pointer px-4 py-2 rounded-md border flex flex-row gap-2 border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  >
                    <FcGoogle className="mr-2" /> Login with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

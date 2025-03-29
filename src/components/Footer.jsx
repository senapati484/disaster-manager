"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const pathname = usePathname();
  const hiddenPaths = ["/map", "/chat", "/guides", "/login"];
  const isVisible = !hiddenPaths.includes(pathname);
  if (!isVisible) return null;

  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 border-t-2">
      <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
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
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Empowering communities with real-time disaster information and
              emergency response resources.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Quick Links
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                <li>
                  <Link
                    href="/map"
                    className="hover:text-primary transition-colors"
                  >
                    Emergency Map
                  </Link>
                </li>
                <li>
                  <Link
                    href="/alerts"
                    className="hover:text-primary transition-colors"
                  >
                    Active Alerts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-primary transition-colors"
                  >
                    Safety Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Emergency Contacts
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                <li className="flex items-center gap-2">
                  <FaPhone className="text-primary" size={14} />
                  <span>Emergency: 911</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhone className="text-primary" size={14} />
                  <span>FEMA: 1-800-621-3362</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" size={14} />
                  <span>support@disaster.org</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Data Sources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                <li>
                  <a
                    href="https://eonet.gsfc.nasa.gov"
                    className="hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NASA EONET
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.usgs.gov"
                    className="hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    USGS
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.noaa.gov"
                    className="hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NOAA
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} Disaster Manager. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook page"
              >
                <FaFacebookF size={16} />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter page"
              >
                <FaTwitter size={16} />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub account"
              >
                <FaGithub size={16} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

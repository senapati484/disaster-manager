// pages/donation.js or app/donation/page.js
"use client";

import { motion } from "framer-motion"; // Corrected import
import DonationForm from "@/components/DonationForm";

export default function DonatePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-900">
          Support Disaster Relief Efforts
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Your contribution directly impacts our ability to provide emergency
          response, medical supplies, and community support during crises.
        </p>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12">
          <DonationForm />
        </div>
      </div>
    </motion.div>
  );
}

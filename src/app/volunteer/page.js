/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/utils/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function VolunteerPage() {
  const { user } = useAuth();
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [documentStatus, setDocumentStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch user's volunteer status and document status
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setIsVolunteer(userData?.volunteer || false);
        setDocumentStatus(userData?.documentStatus || null);
      });

      // Subscribe to notifications
      const notificationsRef = ref(database, `notifications/${user.uid}`);
      onValue(notificationsRef, (snapshot) => {
        const notifData = snapshot.val();
        if (notifData) {
          const notifList = Object.values(notifData).sort(
            (a, b) => b.timestamp - a.timestamp
          );
          setNotifications(notifList);
        }
      });

      // Subscribe to volunteer alerts
      const alertsRef = ref(database, "volunteerAlerts");
      onValue(alertsRef, (snapshot) => {
        const alertsData = snapshot.val();
        if (alertsData) {
          const alertsList = Object.values(alertsData).map((alert) => ({
            ...alert,
            id: alert.id || Math.random().toString(36).substr(2, 9),
          }));
          setAlerts(alertsList);
        }
      });

      // Subscribe to donations
      const donationsRef = ref(database, "donations");
      onValue(donationsRef, (snapshot) => {
        const donationsData = snapshot.val();
        if (donationsData) {
          const donationsList = Object.entries(donationsData)
            .map(([id, donation]) => ({
              id,
              ...donation,
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          setDonations(donationsList);
        }
      });
    }
  }, [user, isVolunteer]);

  useEffect(() => {
    if (user && documentStatus === "approved") {
      set(ref(database, `users/${user.uid}/volunteer`), true);
      setIsVolunteer(true);
    }
  }, [user, documentStatus]);

  const handleDonation = async () => {
    if (!user || !donationAmount || loading) return;

    try {
      setLoading(true);
      const amount = parseFloat(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid donation amount");
        return;
      }

      const donationRef = push(ref(database, "donations"));
      await set(donationRef, {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        amount: amount,
        timestamp: Date.now(),
        useCases: [
          {
            category: "Emergency Supplies",
            amount: amount * 0.3,
            description:
              "Food, water, blankets, and basic necessities for affected families",
          },
          {
            category: "Medical Aid",
            amount: amount * 0.3,
            description:
              "Medical supplies, first aid kits, and emergency medical assistance",
          },
          {
            category: "Temporary Shelter",
            amount: amount * 0.2,
            description:
              "Emergency shelter materials and temporary housing solutions",
          },
          {
            category: "Logistics",
            amount: amount * 0.2,
            description:
              "Transportation, distribution, and coordination of relief efforts",
          },
        ],
      });

      setDonationAmount("");
      toast.success("Thank You!", {
        description: "Your donation has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Donation Failed", {
        description: "Failed to process donation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
      </div>

      {isVolunteer && (
        <>
          {/* Alerts Section */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Volunteer Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                >
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp}
                  </span>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-gray-500">No active alerts</p>
              )}
            </div>
          </Card>

          {/* Donation Section */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="flex-1"
                />
                <Button onClick={handleDonation} disabled={loading}>
                  {loading ? "Processing..." : "Donate"}
                </Button>
              </div>

              <div className="mt-6">
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Donation Use Cases
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your donation will be allocated as follows:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-indigo-600">
                        Emergency Supplies (30%)
                      </h4>
                      <p className="text-sm text-gray-500">
                        Food, water, blankets, and basic necessities for
                        affected families
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-indigo-600">
                        Medical Aid (30%)
                      </h4>
                      <p className="text-sm text-gray-500">
                        Medical supplies, first aid kits, and emergency medical
                        assistance
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-indigo-600">
                        Temporary Shelter (20%)
                      </h4>
                      <p className="text-sm text-gray-500">
                        Emergency shelter materials and temporary housing
                        solutions
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-indigo-600">
                        Logistics (20%)
                      </h4>
                      <p className="text-sm text-gray-500">
                        Transportation, distribution, and coordination of relief
                        efforts
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">Recent Donations</h3>
                <div className="space-y-3">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-3 bg-green-50 border border-green-200 rounded-md"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{donation.userName}</span>
                        <span className="text-green-600 font-semibold">
                          ${donation.amount.toFixed(2)}
                        </span>
                      </div>
                      {donation.useCases && (
                        <div className="mt-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            {donation.useCases.map((useCase, index) => (
                              <div key={index} className="text-gray-600">
                                <span className="font-medium">
                                  {useCase.category}:
                                </span>
                                <span className="ml-1">
                                  ${useCase.amount.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <span className="text-xs text-gray-500 block mt-2">
                        {new Date(donation.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {donations.length === 0 && (
                    <p className="text-gray-500">No donations yet</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {!isVolunteer && (
        <>
          {documentStatus && (
            <Card className="p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">
                Verification Status
              </h2>
              <div
                className={`p-3 rounded-lg ${
                  documentStatus === "pending"
                    ? "bg-yellow-50 text-yellow-800"
                    : documentStatus === "approved"
                    ? "bg-green-50 text-green-800"
                    : documentStatus === "rejected"
                    ? "bg-red-50 text-red-800"
                    : ""
                }`}
              >
                <p className="font-medium">
                  {documentStatus === "pending" &&
                    "Your documents are being reviewed"}
                  {documentStatus === "approved" &&
                    "Your documents have been approved!"}
                  {documentStatus === "rejected" &&
                    "Your documents were not approved. Please submit new documents."}
                </p>
              </div>
            </Card>
          )}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Become a Volunteer
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Please upload your identification documents for verification. Once
              verified, you'll be able to access volunteer features and help
              others in need.
            </p>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="document-link"
                      className="text-sm font-medium text-gray-700"
                    >
                      Document Drive Link
                    </label>
                    <input
                      type="url"
                      id="document-link"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste your Google Drive document link here"
                      onChange={async (e) => {
                        const link = e.target.value;
                        if (!link) return;

                        if (!link.includes("drive.google.com")) {
                          toast.error("Invalid Link", {
                            description:
                              "Please provide a valid Google Drive link.",
                          });
                          return;
                        }

                        try {
                          if (!user?.uid) {
                            toast.error("Authentication Error", {
                              description:
                                "Please sign in to submit documents.",
                            });
                            return;
                          }

                          // Create a batch update for atomic operations
                          const updates = {};
                          const timestamp = Date.now();

                          // Verification record data
                          updates[`verifications/${user.uid}`] = {
                            userId: user.uid,
                            documentStatus: "pending",
                            documentSubmitted: true,
                            documentTimestamp: timestamp,
                            documentLink: link,
                            userEmail: user.email,
                            userName: user.displayName || "Anonymous",
                            submissionAttempts: 1,
                            lastUpdated: timestamp,
                          };

                          // User record data
                          updates[`users/${user.uid}`] = {
                            documentStatus: "pending",
                            documentSubmitted: true,
                            documentTimestamp: timestamp,
                            lastUpdated: timestamp,
                          };

                          // Perform atomic update
                          await update(ref(database), updates);

                          toast.success("Document Submitted", {
                            description:
                              "Our team will verify your documents shortly.",
                          });
                        } catch (error) {
                          console.error(
                            "Error submitting document link:",
                            error
                          );
                          toast.error("Submission Failed", {
                            description:
                              error.message ||
                              "Failed to submit document link. Please try again.",
                          });
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Make sure your documents are uploaded to Google Drive and
                    shared with "Anyone with the link can view" permission
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2">
                    Document Upload Instructions:
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                    <li>Upload your documents to Google Drive</li>
                    <li>
                      Make sure to set the document's sharing settings to
                      "Anyone with the link can view"
                    </li>
                    <li>
                      Copy the sharing link and paste it in the document
                      submission form
                    </li>
                    <li>
                      Our team will verify your documents within 24-48 hours
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2">
                    Required Documents:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    <li>
                      Government-issued ID (Passport, Driver's License, National
                      ID)
                    </li>
                    <li>
                      Proof of address (Utility Bill, Bank Statement, less than
                      3 months old)
                    </li>
                    <li>Background check consent form (PDF format)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2">
                    Acceptable File Types:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    <li>Images: JPG, PNG (max 5MB each)</li>
                    <li>Documents: PDF (max 10MB each)</li>
                    <li>Scanned copies must be clear and legible</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <Card className="p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 bg-blue-50 border border-blue-200 rounded-md"
              >
                <h3 className="font-medium text-blue-800">{notif.title}</h3>
                <p className="text-sm text-blue-600 mt-1">{notif.message}</p>
                <span className="text-xs text-blue-500 block mt-2">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

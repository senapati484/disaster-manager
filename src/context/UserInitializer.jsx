"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UserInitializer() {
  const { user } = useAuth();
  const emailSentRef = useRef(false);

  useEffect(() => {
    async function initializeUser() {
      if (user) {
        try {
          // Check if the user record exists
          const res = await fetch(`/api/data?uid=${user.uid}`);
          const data = await res.json();

          // If no record exists, create one with default values and send welcome email
          if (!data.data) {
            const payload = {
              name: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              location: { lat: "", lon: "" },
              disaster: [],
              assistChat: [],
              volunteer: false,
            };

            const putRes = await fetch(`/api/data?uid=${user.uid}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const putData = await putRes.json();
            console.log("User created:", putData);

            // Send welcome email to new user
            await fetch("/api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: user.email,
                subject: "Welcome to Disaster Manager!",
                text: `Dear ${user.displayName},\n\nThank you for joining Disaster Manager! We're excited to help you stay informed and prepared for any potential disasters in your area.\n\nTo get started:\n1. Set up your location in your profile to receive local disaster alerts\n2. Explore our disaster preparation guides\n3. Use our AI assistant for any questions about disaster preparedness\n\nStay safe!\nThe Disaster Manager Team`,
                html: `<h2>Welcome to Disaster Manager!</h2><p>Dear ${user.displayName},</p><p>Thank you for joining Disaster Manager! We're excited to help you stay informed and prepared for any potential disasters in your area.</p><h3>To get started:</h3><ul><li>Set up your location in your profile to receive local disaster alerts</li><li>Explore our disaster preparation guides</li><li>Use our AI assistant for any questions about disaster preparedness</li></ul><p>Stay safe!</p><p>The Disaster Manager Team</p>`,
              }),
            });
            console.log("Welcome email sent to new user");
          } else {
            // If record exists, check if location is available.
            const { location } = data.data;
            if (location && location.lat && location.lon) {
              // Fetch disaster data using the /api/disaster endpoint
              const disasterRes = await fetch(
                `/api/disaster?lat=${location.lat}&lon=${location.lon}`
              );
              const disasterData = await disasterRes.json();
              const events = disasterData.events || [];

              // Send email notification only if disasters are detected and email hasn't been sent
              if (events.length > 0 && !emailSentRef.current) {
                // Format disaster information for email
                const disasterInfo = events
                  .map(
                    (event) =>
                      `- ${event.title}\n  Location: ${
                        event.coordinates
                          ? event.coordinates.join(", ")
                          : "Not specified"
                      }\n  Description: ${event.description}\n  Severity: ${
                        event.severity || "Not specified"
                      }\n`
                  )
                  .join("\n");

                // Send email notification
                await fetch("/api/sendEmail", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    to: user.email,
                    subject: `Disaster Alert: ${events.length} Event(s) Detected in Your Area`,
                    text: `Dear ${user.displayName},\n\nWe've detected the following disaster events in your monitored location:\n\n${disasterInfo}\n\nPlease stay safe and follow local authority guidelines.\n\nBest regards,\nDisaster Manager Team`,
                    html: `<h2>Disaster Alert</h2><p>Dear ${
                      user.displayName
                    },</p><p>We've detected the following disaster events in your monitored location:</p><div style="margin: 20px 0; padding: 10px; background: #f5f5f5;">${disasterInfo.replace(
                      /\n/g,
                      "<br>"
                    )}</div><p>Please stay safe and follow local authority guidelines.</p><p>Best regards,<br>Disaster Manager Team</p>`,
                  }),
                });

                emailSentRef.current = true;
                console.log(
                  `Email notification sent for ${events.length} disaster events`
                );
              }

              // Update the user record with the fetched disaster data
              const updatePayload = {
                disaster: events,
              };

              const updateRes = await fetch(`/api/data?uid=${user.uid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload),
              });
              const updateResult = await updateRes.json();
              console.log("User disaster data updated:", updateResult);
            } else {
              console.log(
                "User location not available; skipping disaster fetch."
              );
            }
          }
        } catch (error) {
          console.error("Error initializing user:", error);
        }
      }
    }

    initializeUser();
  }, [user]);

  return null;
}

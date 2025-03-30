/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();

  // State to hold profile data from Firebase.
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: { lat: "", lon: "" },
  });

  // Local state for the location inputs.
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");

  // Function to handle Google login.
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // After a successful login, your AuthContext should update.
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  // Fetch the current user's data from Firebase using our /api/data endpoint.
  useEffect(() => {
    async function fetchData() {
      try {
        // Call the GET endpoint with the user's UID.
        const res = await fetch(`/api/data?uid=${user.uid}`);
        const data = await res.json();
        console.log("Fetched user data:", data);

        if (data.data) {
          // data.data is assumed to be the user record.
          setProfileData(data.data);
          setLatInput(data.data.location?.lat ?? "");
          setLonInput(data.data.location?.lon ?? "");
        } else {
          // If no record exists, initialize with default auth data.
          setProfileData({
            name: user.displayName || "",
            email: user.email || "",
            location: { lat: "", lon: "" },
            photoURL: user.photoURL || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handler to update the user profile in Firebase.
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Prepare updated data while preserving existing fields
    const updatedData = {
      ...profileData, // Keep all existing fields
      name: user.displayName,
      email: user.email,
      isVolunteer: false,
      location: { lat: latInput, lon: lonInput },
    };

    try {
      // Our PUT endpoint expects a uid query parameter.
      const res = await fetch(`/api/data?uid=${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile: " + result.error);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating profile");
    }
  };

  // Use device geolocation to set the location inputs.
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatInput(position.coords.latitude.toString());
          setLonInput(position.coords.longitude.toString());
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Logout handler using Firebase Auth.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // If user is not logged in, show a login prompt.
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <p className="mb-4">
          Please log in first to store your data and get notified.
        </p>
        <Button onClick={handleGoogleLogin}>Login with Google</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="mb-6 p-4 bg-gray-100 rounded shadow flex items-center gap-4">
        {/* User Icon */}
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="User Icon"
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {latInput && lonInput ? `${latInput}, ${lonInput}` : "Not set"}
          </p>
          {profileData.isVolunteer && (
            <div className="mt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                <span className="mr-1">🌟</span>
                Volunteer
              </div>
              <div className="flex items-center justify-between">
                <p>
                  <strong>Volunteer Status:</strong>{" "}
                  <span className="text-green-600">Active</span>
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    try {
                      const updatedData = {
                        ...profileData, // Keep all existing fields
                        isVolunteer: false, // Only update volunteer status
                      };
                      const res = await fetch(`/api/data?uid=${user.uid}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedData),
                      });
                      if (res.ok) {
                        setProfileData(updatedData);
                        alert("Volunteer status updated successfully!");
                      } else {
                        alert("Error updating volunteer status");
                      }
                    } catch (error) {
                      console.error("Error updating volunteer status:", error);
                      alert("Error updating volunteer status");
                    }
                  }}
                >
                  Cancel Volunteer Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <form
        onSubmit={handleUpdate}
        className="space-y-4 p-4 bg-white rounded shadow"
      >
        <div>
          <label className="block mb-1 font-semibold">
            Update Location (Latitude, Longitude)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Latitude"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Longitude"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={getCurrentLocation}>
              Use Device Location
            </Button>
          </div>
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
      <div className="mt-6">
        <Button variant="destructive" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

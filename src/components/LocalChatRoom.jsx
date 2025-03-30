"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { database } from "@/utils/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

// Function to calculate grid cell based on lat/lon
const calculateGridCell = (lat, lon) => {
  // Each grid cell is 500km x 500km
  // Approximate degrees for 500km at equator
  const cellSize = 4.5; // roughly 500km in degrees
  const gridLat = Math.floor(lat / cellSize);
  const gridLon = Math.floor(lon / cellSize);
  return `${gridLat}_${gridLon}`;
};

const getChatRef = (gridCell, chatType, userData) => {
  if (chatType === "volunteer") {
    if (!userData?.isVolunteer) {
      throw new Error(
        "This chat is only accessible to verified volunteers. Please complete your volunteer verification first."
      );
    }
    return ref(database, "volunteerChat");
  }
  return ref(database, `chatRooms/${gridCell}/messages`);
};

// Dummy messages for community chat
// 'self: true' indicates a message from the logged-in user.
const dummyMessages = [
  {
    id: 1,
    user: "Anonymous",
    avatar: "https://via.placeholder.com/40?text=A",
    message: "Did anyone evacuate from the flood area?",
    timestamp: "10:30 AM",
    self: false,
  },
  {
    id: 2,
    user: "You",
    avatar: "https://via.placeholder.com/40?text=Y",
    message: "I just left. Stay safe everyone!",
    timestamp: "10:31 AM",
    self: true,
  },
  {
    id: 3,
    user: "Anonymous",
    avatar: "https://via.placeholder.com/40?text=A",
    message: "Yes, evacuating now!",
    timestamp: "10:32 AM",
    self: false,
  },
];

export default function LocalChatRoom({ chatType = "local" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentGrid, setCurrentGrid] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLocationAndInitChat = async () => {
      if (!user) return;

      try {
        // Fetch user's location from /api/data endpoint
        const res = await fetch(`/api/data?uid=${user.uid}`);
        const data = await res.json();

        if (data.data?.location?.lat && data.data?.location?.lon) {
          const { lat, lon } = data.data.location;
          const gridCell = calculateGridCell(Number(lat), Number(lon));
          setCurrentGrid(gridCell);

          // Subscribe to messages in the current grid cell
          const chatRef = getChatRef(gridCell, chatType, data.data);
          const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const messageList = Object.values(data).map((msg) => ({
                ...msg,
                self: msg.userId === user?.uid,
              }));
              setMessages(messageList);
            }
          });

          return () => unsubscribe();
        } else {
          console.error("No location data found for user");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocationAndInitChat();
  }, [user]);

  const handleSend = async () => {
    if (!currentGrid || !user || input.trim() === "") return;

    try {
      // Fetch user data to get volunteer status
      const res = await fetch(`/api/data?uid=${user.uid}`);
      const userData = await res.json();

      const chatRef = getChatRef(currentGrid, chatType, userData.data);
      const newMessageRef = push(chatRef);
      const newMessage = {
        id: newMessageRef.key,
        userId: user.uid,
        user: user.displayName || "Anonymous",
        avatar:
          user.photoURL ||
          `https://via.placeholder.com/40?text=${user.displayName?.[0] || "A"}`,
        message: input.trim(),
        timestamp: new Date().toLocaleTimeString(),
        isVolunteer: userData.data?.isVolunteer || false,
      };

      await set(newMessageRef, newMessage);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      {/* Message Display Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-16rem)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${
              msg.self ? "justify-end" : "justify-start"
            }`}
          >
            {/* Display avatar on the left for non-user messages */}
            {!msg.self && (
              <Image
                src={msg.avatar}
                alt={`${msg.user} avatar`}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
            )}
            <Card
              className={`p-2 max-w-md ${
                msg.self
                  ? "bg-indigo-600 text-white"
                  : msg.isVolunteer
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <div>
                {msg.isVolunteer && (
                  <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded mb-1">
                    Volunteer
                  </span>
                )}
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {msg.timestamp}
                </p>
              </div>
            </Card>
            {/* Display avatar on the right for user messages */}
            {msg.self && (
              <Image
                src={msg.avatar}
                alt={`${msg.user} avatar`}
                width={40}
                height={40}
                className="rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>
      {/* Input Field and Send Button */}
      <div className="p-4 border-t flex items-center space-x-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/utils/firebase";
import { ref, onValue, push, set } from "firebase/database";

export default function VolunteerChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const messagesRef = ref(database, "volunteerChat");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setMessages(messageList);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;
    setLoading(true);
    try {
      const messageRef = push(ref(database, "volunteerChat"));
      await set(messageRef, {
        id: messageRef.key,
        text: input,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        photoURL: user.photoURL,
        timestamp: Date.now(),
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] border rounded-lg bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Volunteer Chat Room</h2>
        <p className="text-sm text-gray-500">
          Coordinate with other volunteers
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.userId === user?.uid ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-shrink-0">
              <img
                src={
                  msg.photoURL ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${msg.userName}`
                }
                alt={msg.userName}
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                msg.userId === user?.uid
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium">{msg.userName}</span>
                <span className="text-xs opacity-75">
                  {new Date(msg.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-1">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}

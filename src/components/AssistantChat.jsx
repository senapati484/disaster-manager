"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

// Helper: Fetch conversation from backend for the given userId.
async function fetchAssistantChat(userId) {
  try {
    const res = await fetch(`/api/data?uid=${userId}`);
    if (!res.ok) {
      console.error("Failed to fetch user data");
      return [];
    }
    const data = await res.json();
    // Expected structure: { data: { assistantChat: [...] } }
    if (data && data.data && data.data.assistantChat) {
      return data.data.assistantChat;
    }
    return [];
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return [];
  }
}

// Helper: Update conversation in backend for the given userId.
async function updateAssistantChat(userId, conversation) {
  try {
    await fetch(`/api/data?uid=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantChat: conversation }),
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
  }
}

export default function AssistantChat() {
  const { user } = useAuth();
  const userId = user?.uid; // Ensure user is authenticated

  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // On mount, load the conversation from the backend for the current user.
  useEffect(() => {
    let isMounted = true;
    const loadConversation = async () => {
      if (!userId) return;
      try {
        const initialConversation = await fetchAssistantChat(userId);
        if (!isMounted) return;

        if (initialConversation && initialConversation.length > 0) {
          setConversation(initialConversation);
        } else {
          const defaultMessage = {
            id: 1,
            role: "assistant",
            message: "Hello! How can I help you prepare for a disaster today?",
            timestamp: new Date().toLocaleTimeString(),
          };
          setConversation([defaultMessage]);
          await updateAssistantChat(userId, [defaultMessage]);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    loadConversation();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSend = async () => {
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }
    if (input.trim() === "") return;

    // Create a new user message.
    const userMsg = {
      id: Date.now(),
      role: "user",
      message: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    const newConversation = [...conversation, userMsg];
    setConversation(newConversation);
    setInput("");
    await updateAssistantChat(userId, newConversation);

    // Call the Gemini API for an assistant response.
    setLoading(true);
    try {
      const res = await fetch("/api/geminiResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      const assistantResponse = {
        id: Date.now() + 1,
        role: "assistant",
        message: data.response, // The response from your Gemini API route.
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedConversation = [...newConversation, assistantResponse];
      setConversation(updatedConversation);
      await updateAssistantChat(userId, updatedConversation);
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        message: "Error fetching response. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedConversation = [...newConversation, errorMsg];
      setConversation(updatedConversation);
      await updateAssistantChat(userId, updatedConversation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] border rounded-lg">
      {/* Conversation Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation
          .filter((msg) => msg)
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } space-x-2`}
            >
              {/* For assistant messages, display avatar on the left */}
              {/* {msg.role !== "user" && (
                <img
                  src="https://via.placeholder.com/40?text=A"
                  alt="Assistant avatar"
                  className="w-10 h-10 rounded-full"
                />
              )} */}
              <div
                className={`max-w-5xl px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === "user"
                      ? "text-gray-300 text-right"
                      : "text-gray-500"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
              {/* For user messages, display avatar on the right */}
              {/* {msg.role === "user" && (
                <img
                  src="https://via.placeholder.com/40?text=U"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
              )} */}
            </div>
          ))}
        {loading && (
          <div className="flex justify-center items-center">
            <p>Loading response...</p>
          </div>
        )}
      </div>
      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-2 sticky bottom-0 bg-white">
        <Input
          placeholder="Ask your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
          className="flex-grow"
        />
        <Button
          onClick={handleSend}
          disabled={loading}
          className="min-w-[80px]"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

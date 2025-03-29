"use client";
import React from "react";
import { auth, provider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; // For Next.js 13 App Router, or use next/router for older versions

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect to home page or protected page after successful login
      router.push("/");
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}

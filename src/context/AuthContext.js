// context/AuthContext.js
"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create a context for the auth data
const AuthContext = createContext({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for changes to the user's sign-in state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount.
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

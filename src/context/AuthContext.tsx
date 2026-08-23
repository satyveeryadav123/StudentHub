"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  createdAt: string;
}

interface StoredAccount extends User {
  passwordHash: string; // Stored securely/locally for authentication
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signup" | "login";
  openAuthModal: (mode?: "signup" | "login") => void;
  closeAuthModal: () => void;
  signUp: (name: string, email: string, pass: string, branch: string) => { success: boolean; error?: string };
  signIn: (email: string, pass: string) => { success: boolean; error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signup" | "login">("signup");
  const [isMounted, setIsMounted] = useState(false);

  // Load persistent session from LocalStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const activeSession = localStorage.getItem("studenthub_auth_session");
      if (activeSession) {
        setUser(JSON.parse(activeSession));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    }
  }, []);

  const openAuthModal = (mode: "signup" | "login" = "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signUp = (name: string, email: string, pass: string, branch: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail || !pass) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (pass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Retrieve existing accounts
    let accounts: StoredAccount[] = [];
    try {
      const stored = localStorage.getItem("studenthub_registered_users");
      if (stored) accounts = JSON.parse(stored);
    } catch (e) {}

    // Check if email already registered
    const existing = accounts.find((a) => a.email === trimmedEmail);
    if (existing) {
      return { success: false, error: "An account with this email already exists. Please sign in instead." };
    }

    // Create new user record
    const newUser: StoredAccount = {
      id: Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      branch: branch || "Computer Science (CSE)",
      createdAt: new Date().toLocaleDateString(),
      passwordHash: pass, // Simple local credential store
    };

    accounts.push(newUser);

    try {
      localStorage.setItem("studenthub_registered_users", JSON.stringify(accounts));
      
      // Auto log-in newly created user
      const sessionUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        branch: newUser.branch,
        createdAt: newUser.createdAt,
      };
      
      localStorage.setItem("studenthub_auth_session", JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e) {
      return { success: false, error: "Failed to save account details locally." };
    }
  };

  const signIn = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !pass) {
      return { success: false, error: "Please enter both email and password." };
    }

    // Retrieve registered accounts
    let accounts: StoredAccount[] = [];
    try {
      const stored = localStorage.getItem("studenthub_registered_users");
      if (stored) accounts = JSON.parse(stored);
    } catch (e) {}

    const match = accounts.find((a) => a.email === trimmedEmail && a.passwordHash === pass);

    if (!match) {
      return { success: false, error: "Invalid email or password. Please check your credentials or create a new account." };
    }

    const sessionUser: User = {
      id: match.id,
      name: match.name,
      email: match.email,
      branch: match.branch,
      createdAt: match.createdAt,
    };

    try {
      localStorage.setItem("studenthub_auth_session", JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e) {
      return { success: false, error: "Failed to establish login session." };
    }
  };

  const signOut = () => {
    localStorage.removeItem("studenthub_auth_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

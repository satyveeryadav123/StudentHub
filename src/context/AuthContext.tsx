"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  roll_number: string | null;
  college?: string | null;
  role: "student" | "admin";
  created_at?: string;
  banned?: boolean;
  ban_reason?: string | null;
  banned_at?: string | null;
}

export type AuthUser = SupabaseUser & {
  name?: string;
  branch?: string;
};

export interface SignUpOptions {
  email: string;
  password: string;
  fullName: string;
  rollNumber?: string;
  role?: "student";
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signup" | "login";
  openAuthModal: (mode?: "signup" | "login") => void;
  closeAuthModal: () => void;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  signUp: (
    emailOrOptions: string | SignUpOptions,
    password?: string,
    fullName?: string,
    rollNumber?: string,
    role?: "student"
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: "student" | "admin"; profile?: Profile | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signup" | "login">("signup");

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data: fetchedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && fetchedProfile) {
        if (fetchedProfile.banned) {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          return null;
        }
        setProfile(fetchedProfile);
        return fetchedProfile;
      } else {
        setProfile(null);
        return null;
      }
    } catch {
      setProfile(null);
      return null;
    }
  }, [supabase]);

  const enrichUser = useCallback((rawUser: SupabaseUser | null): AuthUser | null => {
    if (!rawUser) return null;
    const name = (rawUser.user_metadata?.full_name as string) || rawUser.email?.split("@")[0] || "Student";
    const branch = (rawUser.user_metadata?.branch as string) || "Computer Science (CSE)";
    return Object.assign(rawUser, { name, branch });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      const enriched = enrichUser(currentUser);
      setUser(enriched);
      if (enriched) {
        fetchProfile(enriched.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen to onAuthStateChange to keep user in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      const enriched = enrichUser(currentUser);
      setUser(enriched);
      if (enriched) {
        await fetchProfile(enriched.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, enrichUser]);

  const openAuthModal = (mode: "signup" | "login" = "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signUp = async (
    emailOrOptions: string | SignUpOptions,
    passwordArg?: string,
    fullNameArg?: string,
    rollNumberArg?: string,
    _roleArg?: "student"
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Supabase credentials are not configured in .env.local yet.",
      };
    }

    let email = "";
    let password = "";
    let fullName = "";
    let rollNumber: string | undefined = undefined;

    if (typeof emailOrOptions === "object") {
      email = emailOrOptions.email;
      password = emailOrOptions.password;
      fullName = emailOrOptions.fullName;
      rollNumber = emailOrOptions.rollNumber;
    } else {
      if (emailOrOptions.includes("@")) {
        email = emailOrOptions;
        password = passwordArg || "";
        fullName = fullNameArg || "";
        rollNumber = rollNumberArg;
      } else {
        fullName = emailOrOptions;
        email = passwordArg || "";
        password = fullNameArg || "";
        rollNumber = rollNumberArg;
      }
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();

    if (!trimmedFullName || !trimmedEmail || !password) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
            roll_number: rollNumber || null,
            role: "student",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Upsert into profiles table
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: trimmedFullName,
          roll_number: rollNumber || null,
          role: "student",
        });

        await fetchProfile(data.user.id);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      return { success: false, error: message };
    }
  };

  const signIn = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; role?: "student" | "admin"; profile?: Profile | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Supabase credentials are not configured in .env.local yet.",
      };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch fresh profile from Supabase profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile?.banned) {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          const reasonText = profile.ban_reason ? ` Reason: ${profile.ban_reason}.` : "";
          return {
            success: false,
            error: `Your account has been banned.${reasonText} Contact admin if you think this is a mistake.`,
          };
        }

        const enriched = enrichUser(data.user);
        setUser(enriched);

        if (profile) {
          setProfile(profile);
        }

        const userRole: "student" | "admin" =
          profile?.role === "admin" || profile?.role?.toLowerCase() === "admin"
            ? "admin"
            : "student";

        return { success: true, role: userRole, profile: profile || null };
      }

      return { success: true, role: "student", profile: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in.";
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return {
        error: { message: "Supabase credentials are not configured in .env.local yet." },
      };
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });
    return { error };
  };

  const isAdmin = useMemo(() => profile?.role === "admin" || profile?.role?.toLowerCase() === "admin", [profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        fetchProfile,
        signUp,
        signIn,
        signOut,
        resetPassword,
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

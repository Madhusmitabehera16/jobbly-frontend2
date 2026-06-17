"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  currentUser: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Restore session on mount (refresh / initial render)
  useEffect(() => {
    const restoreSession = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // Safely parse cached user JSON; handle empty or malformed data
      if (savedUser) {
        try {
          // Ensure the string is non‑empty before parsing
          const parsed = savedUser.trim() ? JSON.parse(savedUser) : null;
          if (parsed) setCurrentUser(parsed);
        } catch (e) {
          console.warn('Failed to parse cached user JSON:', e);
          // Remove corrupt data to avoid future errors
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await api.get("/auth/me");
        if (response.data.success && response.data.user) {
          const freshUser = response.data.user;
          setCurrentUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        } else {
          // If response does not indicate success
          handleLocalLogout();
        }
      } catch (error) {
        console.error("Failed to restore authentication session:", error);
        // Clear tokens if /me fails (indicating expired/invalid token)
        handleLocalLogout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLocalLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setCurrentUser(null);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setCurrentUser(user);
      router.push("/");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { user, token } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setCurrentUser(user);
      router.push("/");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    handleLocalLogout();
    // Non-blocking call to notify backend if needed (optional since we clear client-side)
    api.post("/auth/logout").catch(() => {});
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

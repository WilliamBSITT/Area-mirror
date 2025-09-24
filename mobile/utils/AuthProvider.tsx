// AuthProvider.tsx
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("jwt");

      if (token) {
        try {
          // Call your backend to validate token and get user data
          const res = await axios.get("https://your-api.com/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.log("Auto-login failed:", err);
          await SecureStore.deleteItemAsync("jwt");
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("jwt", token);
    try {
      const res = await axios.get("https://your-api.com/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log("Login validation failed:", err);
      setUser(null);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

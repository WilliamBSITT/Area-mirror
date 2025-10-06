// AuthProvider.tsx
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, id: number) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [Ip, setIp] = useState(process.env.EXPO_PUBLIC_IP || "don't work");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const token = await SecureStore.getItemAsync("jwt");

      if (token) {
        try {
          const res = await fetch(`http://${Ip}:8080/auth/token`, {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET"
          });

          if (!res.ok) {
            console.log("error", res)
          }
          setIsAuthenticated(true);
          console.log("auto login ok");
        } catch (err) {
          console.log("Auto-login failed:", err);
          await SecureStore.deleteItemAsync("jwt");
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (token: string, id: number) => {
    await SecureStore.setItemAsync("jwt", token);
    await SecureStore.setItemAsync("id", id.toString());
    try {
      const res = await fetch(`http://${Ip}:8080/auth/token`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET"
      });

      if (!res.ok) {
        console.log("err:", res)
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Login validation failed:", err);
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    await SecureStore.deleteItemAsync("id");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

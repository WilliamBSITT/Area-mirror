// AuthProvider.tsx
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import api from "@/utils/api";

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
          const res = await api.get(`/auth/token`).catch((error: any) => {
            console.log("Error validating token:", error);
            setIsAuthenticated(false);
          });

          if (!res || res.status !== 200) {
            throw new Error(`Server error: ${res ? res.status : 'No response'}`);
          } else {
            setIsAuthenticated(true);
            console.log("auto login ok");
          }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (token: string, id: number) => {
    await SecureStore.setItemAsync("jwt", token);
    await SecureStore.setItemAsync("id", id.toString());
    const res = await api.get(`/auth/token`).catch((error: any) => {
      console.log("Error validating token:", error);
      setIsAuthenticated(false);
    }).then((response) => {
      console.log("Login validation response:", response);
      setIsAuthenticated(true);
      return response;
    });

    if (!res || res.status !== 200) {
      throw new Error(`Server error: ${res ? res.status : 'No response'}`);
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

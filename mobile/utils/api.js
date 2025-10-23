import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_IP || "http://10.18.208.13"}:8080`,
  timeout: 10000,
});

// 🔐 Request interceptor: add token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("jwt");
  const ip = await AsyncStorage.getItem("ip");
  // config.baseURL = `http://${ip || process.env.EXPO_PUBLIC_IP}:8080`;
  config.baseURL = "https://avowedly-uncomputed-velvet.ngrok-free.dev/"
  if (token) {
    config.headers["Content-Type"] = "application/json";
    config.headers.Accept = "application/json";
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Maybe refresh the token or logout.");
    }
    return Promise.reject(error);
  }
);

export default api;

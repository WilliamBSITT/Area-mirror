import { Text, Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { service } from "../home";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ServiceScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<service | null >(null);
  const [Ip, setIp] = useState<string | null>(null)

  useEffect(() => {
    const loadIp = async () => {
      const storedIp = await AsyncStorage.getItem("ip");
      setIp(storedIp);
    };
    loadIp();
  }, []);

  useEffect(() => {
    if (!Ip) return; // wait until Ip is set

    const fetchServices = async () => {
      try {
        const res = await fetch(`http://${Ip}:8080/services/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch services");

        const resJson = await res.json();
        setData(resJson);
      } catch (err) {
        console.error("failed to load services", err);
      }
    };

    fetchServices();
  }, [Ip]);

  return (
    <View className="bg-[#F4FBFB] rounded-2xl flex">
          <Text className="text-black font-bold ml-4 mt-2 justify-start">{data?.name}</Text>
          <Text className="text-black font-bold ml-4 mt-2 justify-start"> {data?.description}</Text>
    </View>


  );
}
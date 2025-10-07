import { Text, Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { service } from ".";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import api from "@/utils/api";

export default function ServiceScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<service | null >(null);
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {

    const fetchServices = async () => {
      try {
        const res = await api.get(`/services/${id}`);

        const resJson = await res.data;
        setData(resJson);
        try {
            let icon = await AsyncStorage.getItem(`icon_${id}`);
            setIcon(icon);
        } catch (error) {
            console.log("error", error)
        }
      } catch (err) {
        console.error("failed to load services", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <View className="bg-[#F4FBFB] rounded-2xl flex h-full w-full">
          <Text className="text-black font-bold ml-4 mt-10 justify-start">{data?.name}</Text>
           <View className='items-center'>
                  <Image
                    source={{uri: `data:image/png;base64,${icon}`}}
                    className="w-40 h-40"
                    resizeMode="contain"
                  />
                </View>
          <Text className="text-black font-bold ml-4 mt-2 justify-start"> {data?.description}</Text>
          <Pressable className="absolute bottom-40 right-14 bg-blue-900 w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')}>
                  <Image source={require("../../../images/plus-white.png")} className="w-10 h-10 m-auto"/>
          </Pressable>
    </View>
  );
}
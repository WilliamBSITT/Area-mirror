import { Text, Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { service } from "."
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import api from "@/utils/api";
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Feather from '@expo/vector-icons/Feather';

export const callSpotify = async () => {
    try {
      // Always open the Spotify auth URL
      await Linking.openURL(`https://avowedly-uncomputed-velvet.ngrok-free.dev/spotify/login?frontend=mobile`);
      console.log("Opened Spotify auth URL");
    } catch (error) {
      console.error("Failed to open Spotify auth:", error);
    }
  };

export const openGithub = async () => {
    try {
      // Use your backend GitHub auth URL instead of AuthSession
      await Linking.openURL(`https://avowedly-uncomputed-velvet.ngrok-free.dev/git/login?frontend=mobile`);
    } catch (error) {
      console.error("Failed to open GitHub auth:", error);
    }
  };

export default function ServiceScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<service | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.code) {
        console.log("Received auth code:", queryParams.code);
        setAuthCode(queryParams.code as string);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        const { queryParams } = Linking.parse(url);
        if (queryParams?.code) {
          console.log("Initial URL auth code:", queryParams.code);
          setAuthCode(queryParams.code as string);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!authCode) return;
      
    const handleAuthCallback = async () => {
      try {
        // For Spotify
        if (data?.name === "spotify") {
          const res = await api.post('/spotify/exchange_token', { code: authCode });
          if (res.status === 200 || res.status === 201) {
            console.log("Spotify connected successfully");
            console.log(res.data);
          }
        }
        // For GitHub  
        else if (data?.name === "github") {
          const res = await api.post('/git/exchange_token', { code: authCode });
          if (res.status === 200 || res.status === 201) {
            console.log("GitHub connected successfully");
            console.log(res.data);
          }
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
      }
    };

    handleAuthCallback();
  }, [authCode, data?.name]);



  const handlePress = async () => {
    if (data?.auth_url) {
      if (data?.name === "spotify") {
        callSpotify();
      } else if (data?.name === "github") {
        openGithub();
      } else {
        WebBrowser.openBrowserAsync(data?.auth_url);
      }
    } else {
      console.warn('URL is missing');
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        const resJson = await res.data;
        setData(resJson);
        
        try {
          let icon = await AsyncStorage.getItem(`icon_${(id)?.toString().toLowerCase()}`);
          setIcon(icon);
        } catch (error) {
          console.log("error", error);
        }
      } catch (err) {
        console.error("failed to load services", err);
      }
    };

    fetchServices();
  }, [id]);

  return (
    <View className="bg-background flex h-full w-full">
          <Text className="text-black text-4xl font-bold ml-4 mt-5 justify-start">{data?.name}</Text>
           <View className='items-center'>
                  <Image
                    source={{uri: `data:image/png;base64,${icon}`}}
                    className="w-40 h-40"
                    resizeMode="contain"
                  />
                </View>
          <Text className="text-black text-2xl font-bold ml-4 mt-2 justify-start"> {data?.description}</Text>
          <Pressable className="absolute bottom-40 right-14 bg-blue-900 w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')} style={{shadowColor: '#000', shadowOpacity: 0.8, elevation: 6,}}>
            <Feather name="plus" size={48} color="white" style={{ margin: 'auto' }} className="fg-background"/>
          </Pressable>
          {data?.auth_url != null && (
          <Pressable
            className="absolute bottom-40 left-9 bg-blue-900 w-36 h-16 rounded-full items-center justify-center" style={{shadowColor: '#000', shadowOpacity: 0.8, elevation: 6,}}
            onPress={handlePress}
          >
          <Text className="text-white text-sm">Connexion</Text>
          </Pressable>)}
    </View>
  );
}
import { Text, Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { service } from "."
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, router } from "expo-router";
import api from "@/utils/api";
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from "expo-auth-session";

// const authServices =

export default function ServiceScreen() {
  const discoverySpot = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    revocationEndpoint: 'https://accounts.spotify.com/api/revoke',
  };

  const [requestSpot, responseSpot, promptAsyncSpot] = AuthSession.useAuthRequest(
    {
      clientId: 'a63f13819159493eb695b3c16785aa55',
      scopes: ['user-read-currently-playing', 'user-read-playback-state'],
      usePKCE: true,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'area'})
    },
    discoverySpot
  );

  const discoveryGit = {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
      revocationEndpoint: 'https://github.com/settings/connections/applications/Ov23liSvunSD8xhDGxUs',
    };

    const [requestGit, responseGit, promptAsyncGit] = AuthSession.useAuthRequest(
      {
        clientId: 'Ov23liSvunSD8xhDGxUs',
        scopes: ['identity', 'read:user', 'user:email'],
        extraParams: { prompt: 'consent' },
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'area',})
      },
      discoveryGit
    );
  
  const callSpotify = async () => {

    try {
      await promptAsyncSpot();
      const code = responseSpot?.url.split('code=')[1]?.split('&state=')[0];
      console.log("Spotify auth result:", code);
      console.log("route :", `/spotify/callback?code=${code}`);
      let res = await api.get(`/spotify/callback?code=${code}`, {
    }).catch((error: any) => {
      console.log("Error posting spotify callback:", error);
    });
    if (res && (res.status === 200 || res.status === 201)) {
      console.log("Spotify connected successfully");
    }
    } catch (error) {
      console.error("Failed to open Spotify auth:", error);
    } finally {
      console.log("done");
    }
  };

  const openGithub = async () => {
    try {
      promptAsyncGit();
    } catch (error) {
      console.error("Failed to open GitHub auth:", error);
    }
  }

  const handlePress = async () => {
    if (data?.auth_url) {
      if (data?.name === "spotify") {
        console.log(AuthSession.makeRedirectUri({
          scheme: 'area',}));
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
    <View className="bg-[#F4FBFB] flex h-full w-full">
          <Text className="text-black text-4xl font-bold ml-4 mt-5 justify-start">{data?.name}</Text>
           <View className='items-center'>
                  <Image
                    source={{uri: `data:image/png;base64,${icon}`}}
                    className="w-40 h-40"
                    resizeMode="contain"
                  />
                </View>
          <Text className="text-black text-2xl font-bold ml-4 mt-2 justify-start"> {data?.description}</Text>
          <Pressable className="absolute bottom-40 right-14 bg-blue-900 w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')}>
                  <Image source={require("../../../images/plus-white.png")} className="w-10 h-10 m-auto"/>
          </Pressable>
          {data?.auth_url != null && (
          <Pressable
            className="absolute bottom-40 left-9 bg-blue-900 w-36 h-16 rounded-full items-center justify-center"
            onPress={handlePress}
          >
          <Text className="text-white text-sm">Connexion</Text>
          </Pressable>)}
    </View>
  );
}
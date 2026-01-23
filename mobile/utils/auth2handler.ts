import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import api from '@/utils/api';

export const callSpotify = async () => {
    try {
      api.post('/ip/encode', {"ip": AuthSession.makeRedirectUri({
          scheme: 'area',
        })}).then(async (res) => {
          await AsyncStorage.setItem("ip", res.data.encoded);
          await Linking.openURL(`${process.env.EXPO_PUBLIC_IP}/spotify/login?frontend=mobile&ip=${res.data.encoded}&port=${AuthSession.makeRedirectUri({scheme: 'area'}).split(':').pop()}`);
      }).catch((error) => {
        console.error("Failed to encode IP:", error);
      });
    } catch (error) {
      console.error("Failed to open Spotify auth:", error);
    }
  };

export const openGithub = async () => {
    try {
      // Use your backend GitHub auth URL instead of AuthSession
      api.post('/ip/encode', {"ip": AuthSession.makeRedirectUri({
          scheme: 'area',
        })}).then(async (res) => {
          await AsyncStorage.setItem("ip", res.data.encoded);
          console.log("IP encoded successfully:", res.data);
          await Linking.openURL(`${process.env.EXPO_PUBLIC_IP}/git/login?frontend=mobile&ip=${res.data.encoded}&port=${AuthSession.makeRedirectUri({scheme: 'area'}).split(':').pop()}`);
      }).catch((error) => {
        console.error("Failed to encode IP:", error);
      });
    } catch (error) {
      console.error("Failed to open GitHub auth:", error);
    }
  };
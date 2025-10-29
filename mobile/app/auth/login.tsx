import React, { useContext} from "react";
import { Text, View, Pressable, Image, TextInput} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { AuthContext } from "@/utils/AuthProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from "expo-auth-session";
import api from "@/utils/api";
import showToast from "@/utils/showToast";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function Login() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const [Ip, setIp] = useState(process.env.EXPO_PUBLIC_IP || "10.18.208.13");
  const { login } = useContext(AuthContext)!;
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/Ov23liSvunSD8xhDGxUs',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'Ov23liSvunSD8xhDGxUs',
      scopes: ['identity', 'read:user', 'user:email'],
      extraParams: { prompt: 'consent' },
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'area',})
    },
    discovery
  );

  useEffect(() => {
    AsyncStorage.clear();
  }, []);

  useEffect(() => {
    const handleLoginGithub = async (code?: string) => {
      const res = await api.post(`/auth/github/token`, {
          "code": code
        }).catch((error: any) => {
          console.log("Error posting github token:", error);
        });
        
      if (!res || (res.status !== 201 && res.status !== 200)) {
        throw new Error(`Server error: ${res ? res.status : 'No response'}`);
      }

      const data = await res.data;
      {mode == 'login' ? router.push('/main/home') :
        setMode('login');
        storeData()
        login(data.access_token, 2)
      }
    }

    if (response?.type === 'success') {
      const { code } = response.params;
      console.log("code", code)
      console.log("response", response)
      handleLoginGithub(code)
    }
  }, [response]);

    useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const handleCallDB = async () => {
    const res = await api.post(mode == 'login' ? `/auth/token` : `/users`, {
      "email": mail,
      "password": password,
      ...(mode == 'register' && { "expo_push_token": expoPushToken })
    }).catch((error: any) => {
      console.log("Error posting login:", error);
      showToast("error", "Login failed", error.message);
    });

    if (!res || (res.status !== 201 && res.status !== 200)) {
      return;
    }

    const data = await res.data;
    console.log('response', data);
    {mode == 'login' ? router.push('/main/home') :
      setMode('login');
      login(data.access_token, data.id)
    }
  }

  const storeData = async () => {
    try {
      if (!Ip) return;
      await AsyncStorage.setItem('ip', Ip);
      console.log("login ip: ", Ip);
      showToast("success", "IP changed", Ip);
    } catch (error) {
      console.log("error", error);
    }
  }

  const [mode, setMode] = useState('login');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
      testID="login-root"
      >
      <Image source={require('../../images/logo.png')} className="w-1/2 h-1/4 mt-20 mb-5"/>
      <View className="flex flex-row">
        <TextInput className="border-2 border-solid rounded-full w-1/4 mb-5 p-1 border-blue-900 text-l" placeholder={Ip} onChangeText={setIp} defaultValue={""} onSubmitEditing={storeData}/>
        <Pressable className="bg-blue-900 rounded-full p-1 mb-5 ml-1 text-sm" onPress={storeData} disabled={(password !== confirmPwd) && (mode == 'register')}>
          <Text className="text-white text-2xl">change ip</Text>
        </Pressable>
      </View>
      <TextInput
        className="border-2 border-solid rounded-full w-1/2 mb-5 p-4 border-blue-900 text-2xl"
        placeholder="email"
        onChangeText={(text) => {
          setMail(text);
          if (mode !== 'login' && text.length > 0 && (!text.includes("@") || !text.includes("."))) {
            showToast("error", "Invalid email", "Please enter a valid email address.");
          }
        }}
        defaultValue={mail}
      />
      <TextInput secureTextEntry className="border-2 border-solid rounded-full w-1/2 mb-5 p-4 border-blue-900 text-2xl" placeholder="Password" onChangeText={setPassword} defaultValue={password}/>
      {mode == 'register' && (<View className="w-full justify-center items-center">
        {(password !== confirmPwd && confirmPwd) && <Text className="text-red-600">Password don't match</Text>}
        <TextInput secureTextEntry className="border-2 border-solid rounded-full w-1/2 mb-5 p-4 border-blue-900" placeholder="Confirm your password" onChangeText={setConfirmPwd} defaultValue={confirmPwd}/>
      </View>)}
      <Pressable className="bg-blue-900 rounded-full p-6 mb-30 text-2xl" onPress={handleCallDB} disabled={(password !== confirmPwd) && (mode == 'register')}>
        <Text className="text-white text-2xl">
          {mode == 'register' ? 'Register' : 'Login'}
        </Text>
      </Pressable>
      <Pressable className="rounded-full p-7 mt-20" onPress={() => {mode == 'register' ? setMode('login') : setMode('register')}}>
        <Text className="text-black text-xl">
          {mode == 'register' ? 'Or login' : "I don't have an account"}
        </Text>
      </Pressable>
      <Pressable testID="login-button" onPress={() => {promptAsync()}} className="bg-black rounded-full p-2 flex flex-row">
        <Text className="text-white text-xl m-2">Login</Text>
        <Image source={require('../../images/github-white-icon.png')} className="w-10 h-10 m-auto"/>
      </Pressable>
      <View>
      </View>
    </View>
  );
}

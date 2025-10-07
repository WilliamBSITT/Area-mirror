import React, { useContext } from "react";
import { Stack } from "expo-router";
import { AuthProvider, AuthContext } from "../utils/AuthProvider";
import { ActivityIndicator, View } from "react-native";
import '@/global.css';

function RootLayoutNav() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (auth.loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={auth.isAuthenticated}>
        <Stack.Screen name="main" options={{animationTypeForReplace: 'push',
                                            animation:'slide_from_right'}}/>
      </Stack.Protected>
      <Stack.Protected guard={!auth.isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>
    </Stack>
  );
}


export default function RootLayout() {
  return <>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </>;
}

import React, { useContext } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider, AuthContext } from "../utils/AuthProvider";
import { ErrorBoundary } from 'react-error-boundary';
import '../global.css';
import Header from "@/components/Header";
import { Toast } from "react-native-toast-message/lib/src/Toast";

function ErrorFallback({error}: {error: Error}) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 mb-4">Error: {error.message}</Text>
      <Text className="text-sm">{error.stack}</Text>
    </View>
  );
}

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
    <>
      <Stack >
        <Stack.Protected guard={auth.isAuthenticated}>
          <Stack.Screen name="main" options={{headerTitle: (props) => <Header />,
          }}/>
        </Stack.Protected>
        <Stack.Protected guard={!auth.isAuthenticated}>
          <Stack.Screen name="auth" options={{headerShown: false}}/>
        </Stack.Protected>
        <Stack.Screen name="index" options={{headerTitle: (props) => <Header />}}/>
      </Stack>
      <Toast />
    </>
  );
}


export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}

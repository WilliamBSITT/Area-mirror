import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getToken } from '../utils/secureStore';
import React from 'react';

export default function AppEntry() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        
        if (token) {
          router.push('/main/home');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-900">
        <Text className="text-white text-2xl mb-4">Your App Name</Text>
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  return null;
}
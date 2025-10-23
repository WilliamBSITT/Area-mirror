import { View, Image, Pressable } from 'react-native';
import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter, usePathname } from 'expo-router';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback navigation if can't go back
        router.replace('/main/home');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback to home if there's an error
      router.replace('/main/home');
    }
  };

  return (
    <View className="bg-blur justify-center items-start h-20">
      {pathname !== '/main/home' && (
        <Pressable
          onPress={handleGoBack}
          className="absolute left-4 align-middle"
          style={{ zIndex: 10 }} // Add zIndex to ensure it's pressable
        >
          <FontAwesome6 name="arrow-left" size={24} color="black" />
        </Pressable>
      )}
      <Image
        source={require('../images/logo.png')}
        style={{ width: 200, height: 120 }}
        resizeMode="contain"
      />
    </View>
  );
};
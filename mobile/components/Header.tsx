import { View, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter, usePathname } from 'expo-router';
// import Switch from '@/components/mySwitch';
import ThemeToggle from './ThemeToggle';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@/providers/ThemeProvider';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const switchValue = useSharedValue(false);
  // const [switchValue, setSwitchValue] = useState(theme === "dark");

  // Update shared value when theme changes
  useEffect(() => {
    const isDark = theme === "dark";
    switchValue.value = isDark;
    console.log("Header - Current theme:", theme, "Switch value:", isDark);
  }, [theme]);

  const handleGoBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/main/home');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      router.replace('/main/home');
    }
  };

  const handleToggleTheme = () => {
    switchValue.value = !switchValue.value;
    toggleTheme();
  };

  return (
    <View className="bg-blur flex-row justify-between items-center h-20 px-4">
      <View className="w-8">
        {pathname !== '/main/home' && (
          <Pressable onPress={handleGoBack}>
            <FontAwesome6 name="arrow-left" size={24} color="black" />
          </Pressable>
        )}
      </View>

      <View className="flex-1 items-center">
        <Image
          source={require('../images/logo.png')}
          style={{ width: 200, height: 120 }}
          resizeMode="contain"
        />
      </View>

      <View className="w-16 items-end">
        <ThemeToggle />
      </View>
    </View>
  );
}
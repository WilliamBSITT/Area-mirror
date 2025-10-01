import { View, Text } from "react-native";
import React from 'react';
import "@/global.css"

export default function Card() {
  return (
    <View className="bg-black w-[100px] h-[100px] justify-center items-center rounded-lg">
      <Text className="text-gray-50">Test</Text>
    </View>
  );
}

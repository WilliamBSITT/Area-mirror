import { View, Image } from 'react-native';
import React from 'react';

export default function Header() {
  return (
    <View className="bg-primary justify-center items-start h-24">
      <Image
        source={require('../images/logo.png')}
        style={{ width: 200, height: 120 }}
        resizeMode="contain"
      />
    </View>
  );
};
import { Text, Image, Pressable, View } from "react-native";
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

export default function ServiceScreen() {
  const { id } = useLocalSearchParams();

  return (
    <Text>Service ID: {id}</Text>
  );
}
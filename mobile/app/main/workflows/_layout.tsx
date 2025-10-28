import { Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function FeedLayout() {
  return <Stack screenOptions={{ headerShown: false }}/>;
}

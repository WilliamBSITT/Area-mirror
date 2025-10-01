import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workflows"
        options={{
          title: 'workflows',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="check" color={color} />,
        }}
      />
    </Tabs>
  );
}

import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import React from "react";
import { MyTabBar } from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={props => <MyTabBar {...props}/>}>
      <Tabs.Screen
        name="home"
      />
      <Tabs.Screen
        name="workflows"
      />
      <Tabs.Screen
        name="publics"
      />
      <Tabs.Screen
        name="profile"
      />
    </Tabs>
  );
}

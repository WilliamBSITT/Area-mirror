import React from "react";
import { Text, View, Pressable, Image, TextInput } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Index() {

  return (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>index</Text>
    </View>
  );
}

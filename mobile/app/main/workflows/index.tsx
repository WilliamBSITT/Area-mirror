import { Text, View, Switch, Pressable, Image } from "react-native";
import React, { useEffect, useState } from 'react'
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { workflowProps } from "./[id]";
import api from "@/utils/api.js";

function WorkflowTile({title, id}: {title: string, id: number}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleDelete = () => {
    console.log("it will delete the workflow");
  }

  return (
    <Pressable className="bg-blue-900 w-3/4 h-20 m-10 rounded-2xl p-3" onPress={() => router.push(`/main/workflows/${id}`)}>
      <View className="flex flex-row">
        <Text className="text-xl h-full flex-1 text-white">{title}</Text>
        <View className="flex flex-row justify-between h-full gap-2">
          <Switch onValueChange={toggleSwitch} value={isEnabled} className="w-10" thumbColor={isEnabled ? "#57c229" : 'grey'} trackColor={{true: 'green', false: 'grey'}}/>
          <Pressable onPress={handleDelete}>
            <Image source={require('../../../images/trash-white.png')} className="w-10 h-10 m-auto"/>
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

export default function Index() {
  const [data, setData] = useState<workflowProps[] | null>(null)

  useEffect(() => {
    const fetchAREA = async () => {
      const res = await api.get(`/areas`).catch((error: any) => {
        console.log("Error fetching areas:", error);
      });
      if (res && res.data) {
        console.log('response', res.data);
        setData(res.data);
      }
    }

    fetchAREA()
  }, [])

  return (
    <View className="mt-20 w-full h-full">
      {data?.map((area: workflowProps) => (
        <WorkflowTile title={area.name} id={area.id} key={area.id}/>
      ))}
      <Pressable className="absolute bottom-52 right-14 bg-blue-900 w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')}>
        <Image source={require("../../../images/plus-white.png")} className="w-10 h-10 m-auto"/>
      </Pressable>
    </View>
  );
}

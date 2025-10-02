import { Text, View, Switch, Pressable, Image } from "react-native";
import React, { useEffect, useState } from 'react'
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { workflowProps } from "./[id]";

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
  const [Ip, setIp] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<workflowProps[] | null>(null)

  useEffect(() => {
    const loadIp = async () => {
      const storedIp = await AsyncStorage.getItem("ip");
      setIp(storedIp);
    };
    loadIp();
  }, []);

  useEffect(() => {
    const fetchAREA = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt")
        const res = await fetch(`http://${Ip}:8080/areas`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
          
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
    
        const data = await res.json();
        console.log('response', data);
        setData(data);
      } catch(err) {
        console.log("error fetching areas", err)
      }
    }

    fetchAREA()
  }, [Ip])

  return (
    <View className="mt-20 w-full h-full">
      {data?.map((area: workflowProps) => (
        <WorkflowTile title={area.name} id={area.id} key={area.id}/>
      ))}
      <Pressable className="absolute bottom-52 right-14 bg-slate-400 w-16 h-16 rounded-2xl" onPress={() => router.push('/main/workflows/newWorkflow')}>
        <Image source={require("../../../images/plus.png")} className="w-10 h-10 m-auto"/>
      </Pressable>
    </View>
  );
}

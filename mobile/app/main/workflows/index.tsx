import { Text, View, Pressable, Image } from "react-native";
import React, { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { workflowProps } from "./newWorkflow";
import api from "@/utils/api.js";
import showToast from "@/utils/showToast";
import { useSharedValue } from "react-native-reanimated";
import Switch from "@/components/mySwitch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import { WorkflowWithImage } from "../publics";
import { useTheme } from '../../../providers/ThemeProvider';


function WorkflowTile({title, id, data, setData}: {title: string, id: number, data: WorkflowWithImage[] | null, setData: React.Dispatch<React.SetStateAction<WorkflowWithImage[] | null>>}) {
  const isOn = useSharedValue(data?.find((area) => area.id === id)?.enabled || false);
  const { theme } = useTheme();
  // console.log("image from async storage:", data?.find((area) => area.id === id)?.icon);
  const toggleSwitch = async () => {
    isOn.value = !isOn.value;
    const res = await api.put(`/areas/${id}`, {
        enabled: isOn.value
    }).catch((error: any) => {
      showToast("error", "Failed to update workflow", "There was an error updating the workflow. Please try again later.");
    });
    if (res && res.status === 200) {
      showToast("success", "Workflow updated", `The workflow has been ${isOn.value ? "enabled" : "disabled"} successfully.`);
      setData(data?.map((area) => area.id === id ? { ...area, enabled: !area.enabled } : area) || null);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/areas/${id}`);
      if (res.status === 200) {
        setData(data?.filter((area) => area.id !== id) || null);
        showToast("success", "Workflow deleted", `Workflow ${title} has been deleted.`);
      } else {
        showToast("error", "Failed to delete workflow", "Please try again later.");
      }
    } catch (error: any) {
      showToast("error", "Error deleting workflow", error?.message || "An unknown error occurred.");
    }
  }

  return (
    <Pressable className="bg-secondary w-3/4 h-32 ml-10 mr-10 m-4 rounded-2xl p-3 shadow-4xl" onPress={() => router.push(`/main/workflows/${id}`)}>
      <View className="flex-1 flex-col">
        <Text className="text-xl text-text mb-2">{title}</Text>

        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex flex-row gap-2 items-center">
            <Image source={{ uri: `data:image/png;base64,${data?.find((area) => area.id === id)?.icon_action}` }} className="w-10 h-10 m-auto mr-4"/>
            <FontAwesome5 name="long-arrow-alt-right" size={24} color="white" />
            <Image source={{ uri: `data:image/png;base64,${data?.find((area) => area.id === id)?.icon_reaction}` }} className="w-10 h-10 m-auto ml-4"/>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Switch onPress={toggleSwitch} value={isOn} />
            <Pressable onPress={handleDelete} className="ml-3">
              <FontAwesome5 name="trash" size={24} style={{ margin: 'auto',  color: "#FFF" }}/>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default function Index() {
  const [data, setData] = useState<WorkflowWithImage[] | null>(null)

  const fetchAREA = async () => {
    const res = await api.get(`/areas`).catch((error: any) => {
      showToast("error", "Failed to load areas", "There was an error loading areas.");
    });
    if (res && res.data) {
      const enriched = await Promise.all(
        res.data.map(async (area: any) => {
          try {
        const icon_action = await AsyncStorage.getItem(`icon_${area.action_service}`);
        const icon_reaction = await AsyncStorage.getItem(`icon_${area.reaction_service}`);
        return { ...area, icon_action, icon_reaction };
          } catch {
        return { ...area, icon_action: null, icon_reaction: null };
          }
        })
      );
      setData(enriched);
    }
  };

    // const onRefresh = useCallback(async () => {
    //     setRefreshing(true);
    //     await fetchAREA();
    //     setRefreshing(false);
    // }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAREA();
        }, [])
    );

  return (
    <View className="w-full h-full bg-background">
      <View className="items-center">
        {data?.map((area: WorkflowWithImage) => (
          <WorkflowTile title={area.name} id={area.id} key={area.id} data={data} setData={setData}/>
        ))}
      </View>
      <Pressable className="absolute bottom-32 right-14 bg-primary w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')}>
        <Feather name="plus" size={48} style={{ margin: 'auto', color: "#FFF" }}/>
      </Pressable>
    </View>
  );
}

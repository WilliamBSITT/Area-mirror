import { Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useState } from 'react'
import { router } from "expo-router";
import { workflowProps } from "./newWorkflow";
import api from "@/utils/api.js";
import showToast from "@/utils/showToast";
import { useSharedValue } from "react-native-reanimated";
import Switch from "@/components/mySwitch";

function WorkflowTile({title, id, data, setData}: {title: string, id: number, data: workflowProps[] | null, setData: React.Dispatch<React.SetStateAction<workflowProps[] | null>>}) {
  const isOn = useSharedValue(data?.find((area) => area.id === id)?.enabled || false);
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
    <Pressable className="bg-blue-900 w-3/4 h-20 ml-10 mr-10 m-4 rounded-2xl p-3" onPress={() => router.push(`/main/workflows/${id}`)}>
      <View className="flex flex-row">
        <Text className="text-xl h-full flex-1 text-white">{title}</Text>
        <View className="flex flex-row justify-between h-full gap-2 items-center">
          <Switch onPress={toggleSwitch} value={isOn} />
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
        showToast("error", "Failed to load areas", "There was an error loading areas.");
      });
      if (res && res.data) {
        setData(res.data);
      }
    }

    fetchAREA()
  }, [])

  return (
    <View className="w-full h-full">
      {data?.map((area: workflowProps) => (
        <WorkflowTile title={area.name} id={area.id} key={area.id} data={data} setData={setData}/>
      ))}
      <Pressable className="absolute bottom-32 right-14 bg-blue-900 w-16 h-16 rounded-full" onPress={() => router.push('/main/workflows/newWorkflow')}>
        <Image source={require("../../../images/plus-white.png")} className="w-10 h-10 m-auto"/>
      </Pressable>
    </View>
  );
}

import { View, Text, TextInput, Pressable } from "react-native"
import React, {useEffect, useState} from "react"
import { useLocalSearchParams } from "expo-router";
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import api from "@/utils/api";
export interface workflowProps {
    "action": string,
    "action_service": string,
    "enabled": boolean,
    "id": number,
    "last_run": string,
    "name": string,
    "params": string,
    "reaction": string,
    "reaction_service": string
}

export default function Workflow() {
  const [data, setData] = useState<workflowProps | null>(null)
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState("")
    const [actionOpen, setActionOpen] = useState(false);
    const [reactionOpen, setReactionOpen] = useState(false);
    const [valueAction, setValueAction] = useState(null);
    const [valueReaction, setValueReaction] = useState(null);
    const [action, setAction] = useState([{label: "It is raining", value: "It is raining"},
                                        {label: "It's sunny", value: "It's sunny"}]);
    const [reaction, setReaction] = useState([{label: "send it", value: "send it"},
                                        {label: "ping jona", value: "ping jona"}]);


  useEffect(() => {
    const fetchAREA = async () => {
      try {
        const res = await api.get(`/areas/${id}`).catch((error: any) => {
          console.log("Error fetching areas:", error);
        });
        
        if (!res || res.status !== 200) {
          throw new Error(`Server error: ${res ? res.status : 'No response'}`);
        }
    
        const data = await res.data;
        console.log("data, ", data);
        setData(data);
        setTitle(data.name);
        setAction(prev => [...prev, {label: data?.action, value: data?.action}])
        setReaction(prev => [...prev, {label: data?.reaction, value: data?.reaction}])
      } catch(err) {
        console.error("error fetching areas", err)
      }
    }

        fetchAREA()
    }, [])

    const save = async () => {
      const res = await api.patch(`/areas/${id}`, {
        data
      })
        
      if (!res.status || res.status !== 200) {
        throw new Error(`Server error: ${res.status}`);
      }
  
      const newData = await res.data;
      console.log('response', data);
      setData(newData);
      setTitle(newData.name);
  }

    return (
        <View className="mt-20 ml-10">
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 bottom-1" onPress={() => router.push('/main/workflows/')}>
                <Text className="text-white text-center">Back</Text>
            </Pressable>
            <TextInput className="text-4xl font-bold mb-4" onChangeText={setTitle} value={title} defaultValue={data?.name} placeholder="title"></TextInput>
            
            <Text>Last run: {data?.last_run}</Text>
            <Text>Next run: {data?.last_run}</Text>
            
            <View className="flex flex-row mt-10">
                <Text className="text-2xl font-semibold mt-4">If:</Text>
                <DropDownPicker
                    open={actionOpen}
                    value={valueAction}
                    items={action}
                    setOpen={setActionOpen}
                    setValue={setValueAction}
                    setItems={setAction}
                    style={{width: '60%', margin: 'auto'}}
                />
            </View>
            <View className="flex flex-row mt-10 mb-5 justify-center">
                <Text className="text-2xl font-semibold mt-4">Then:</Text>
                <DropDownPicker
                    open={reactionOpen}
                    value={valueReaction}
                    items={reaction}
                    setOpen={setReactionOpen}
                    setValue={setValueReaction}
                    setItems={setReaction}
                    style={{width: '60%', margin: 'auto'}}
                />
            </View>
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto bottom-1" onPress={save}>
                <Text className="text-white text-center">Save</Text>
            </Pressable>
        </View>
    )
}
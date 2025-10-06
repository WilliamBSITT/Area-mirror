import { View, Text, TextInput, Pressable } from "react-native"
import React, {useEffect, useState} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import { workflowProps } from "./[id]";

export default function NewWorkflow() {
  const [data, setData] = useState<workflowProps | null>(null)
  const [Ip, setIp] = useState<string | null>("")
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
    const loadIp = async () => {
      const storedIp = await AsyncStorage.getItem("ip");
      setIp(storedIp);
    };
    loadIp();
  }, []);

    const save = async () => {
        try {
        const token = await SecureStore.getItemAsync("jwt")
        const res = await fetch(`http://${Ip}:8080/areas/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        })
          
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
    
        const data = await res.json();
        console.log('response', data);
        setData(data);
        setTitle(data.name);
      } catch(err) {
        console.log("error fetching areas", err)
      }
    }

    return (
        <View className="mt-20 ml-10">
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 bottom-1" onPress={() => router.push('/main/workflows/')}>
                <Text className="text-white text-center">Back</Text>
            </Pressable>
            <TextInput className="text-4xl font-bold mb-4" onChangeText={setTitle} value={title} defaultValue={data?.name} placeholder="title"></TextInput>
            
            <View className="flex flex-row mt-10">
                <Text className="text-2xl font-semibold mt-4">If:</Text>
                <DropDownPicker
                    open={actionOpen}
                    value={valueAction}
                    items={action}
                    setOpen={setActionOpen}
                    setValue={setValueAction}
                    setItems={setAction}
                    dropDownContainerStyle={{ width: 200, alignSelf: 'center', zIndex: 1 }}
                    style={{ width: 200, alignSelf: 'center' }}
                    zIndex={1}
                />
            </View>
            <View className="flex flex-row mt-10 mb-5 justify-center items-center">
              <Text className="text-2xl font-semibold mt-4 mr-4">Then:</Text>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <DropDownPicker
                  open={reactionOpen}
                  value={valueReaction}
                  items={reaction}
                  setOpen={setReactionOpen}
                  setValue={setValueReaction}
                  setItems={setReaction}
                  dropDownContainerStyle={{ width: 200, alignSelf: 'center', zIndex: 1 }}
                  style={{ width: 200, alignSelf: 'center'}}
                />
              </View>
            </View>
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto bottom-1" onPress={save}>
                <Text className="text-white text-center">Save</Text>
            </Pressable>
        </View>
    )
}
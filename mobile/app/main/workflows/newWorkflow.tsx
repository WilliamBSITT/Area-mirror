import { View, Text, TextInput, Pressable, Image } from "react-native"
import React, {useEffect, useState} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import { workflowProps } from "./[id]";
import api from "@/utils/api";

export default function NewWorkflow() {
  const [data, setData] = useState<workflowProps | null>(null)
    const [title, setTitle] = useState("")
    const [actionOpen, setActionOpen] = useState(false);
    const [valueAction, setValueAction] = useState(null);
    const [action, setAction] = useState([{label: "It is raining", value: "get_weather"}]);

    const [reactionOpen, setReactionOpen] = useState(false);
    const [valueReaction, setValueReaction] = useState(null);
    const [reaction, setReaction] = useState([{label: "ping jona", value: "send_message"}]);

    const [valueService, setValueServices] = useState(null);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [services, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>([]);

    const [valueServiceRea, setValueServicesRea] = useState(null);
    const [servicesReaOpen, setServicesReaOpen] = useState(false);
    const [servicesRea, setServicesRea] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>([]);


  useEffect(() => {
    const loadIcons = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const iconKeys = keys.filter(key => key.startsWith('icon_'));
        const icons = await AsyncStorage.multiGet(iconKeys);
        const updatedService = icons.map(([key, value]) => {
          const match = key.match(/^icon_(.+)$/);
          const service = match ? match[1] : key;
          return {
            label: service,
            value: service,
            icon: value
              ? () => (
                  <View><Image source={{ uri: `data:image/png;base64,${value}` }} style={{ width: 20, height: 20 }} /></View>)
              : undefined
          };
        });
        setServices(updatedService);
        setServicesRea(updatedService);
      } catch (error) {
        console.log("Error loading icons:", error);
      }
    }
    loadIcons();
  }, []);

    const save = async () => {
        try {
        console.log("name :", title, valueAction, valueReaction, valueService)
        const res = await api.post('/areas', {
          body: JSON.stringify({
            name: title,
            action: valueAction,
            action_service: valueService,
            reaction: valueReaction,
            reaction_service: "discord",
            params: {"city": "Nancy", "message": "meteo {temp} {city} {desc}"}
          })
        })
    
        const data = await res.data;
        console.log('response', data);
        setData(data);
        setTitle(data.name);
      } catch(err) {
        console.log("error posting areas", err)
      }
    }

    return (
        <View className="mt-20 ml-10">
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 bottom-1 mb-4" onPress={() => router.push('/main/workflows/')}>
                <Text className="text-white text-center">Back</Text>
            </Pressable>
            <TextInput className="text-4xl font-bold mb-4" onChangeText={setTitle} value={title} defaultValue={data?.name} placeholder="title"></TextInput>            
            <View className="flex flex-row mt-10">
              <Text className="text-2xl font-semibold mt-4">If:</Text>

              <View style={{ zIndex: 2000 }} className="mx-4">
                <DropDownPicker
                  open={servicesOpen}
                  value={valueService}
                  items={services}
                  setOpen={setServicesOpen}
                  setValue={setValueServices}
                  setItems={setServices}
                  style={{ width: 150, alignSelf: "center" }}
                  dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
                  autoScroll={true}
                  placeholder="Select a service"
                  showArrowIcon={false}
                />
              </View>

              <View style={{ zIndex: 1000 }}>
                <DropDownPicker
                  open={actionOpen}
                  value={valueAction}
                  items={action}
                  setOpen={setActionOpen}
                  setValue={setValueAction}
                  setItems={setAction}
                  style={{ width: 150, alignSelf: "center" }}
                  dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
                  placeholder="Select an action"
                  showArrowIcon={false}
                />
              </View>
            </View>
            <View className="flex flex-row mt-10 mb-5 justify-center items-center">
              <Text className="text-2xl font-semibold mt-4 mr-4">Then:</Text>
              <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ zIndex: 2000 }} className="mx-4">
                <DropDownPicker
                  open={reactionOpen}
                  value={valueReaction}
                  items={reaction}
                  setOpen={setReactionOpen}
                  setValue={setValueReaction}
                  setItems={setReaction}
                  dropDownContainerStyle={{ width: 200, alignSelf: 'center', zIndex: 1 }}
                  style={{ width: 200, alignSelf: 'center', zIndex: 1 }}
                  placeholder="Select a reaction"
                />
              </View>
              <View style={{ zIndex: 1000 }}>
                <DropDownPicker
                  open={servicesReaOpen}
                  value={valueServiceRea}
                  items={servicesRea}
                  setOpen={setServicesReaOpen}
                  setValue={setValueServicesRea}
                  setItems={setServicesRea}
                  style={{ width: 150, alignSelf: "center" }}
                  dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
                  autoScroll={true}
                  placeholder="Select a service"
                  showArrowIcon={false}
                />
              </View>
              </View>
            </View>
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto bottom-1" onPress={save}>
                <Text className="text-white text-center">Save</Text>
            </Pressable>
        </View>
    )
}
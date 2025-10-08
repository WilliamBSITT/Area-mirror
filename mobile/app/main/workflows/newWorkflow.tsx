import { View, Text, TextInput, Pressable, Image } from "react-native"
import React, {use, useEffect, useState} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import { workflowProps } from "./[id]";
import api from "@/utils/api";

function ArgList({args}: {args: {name: string, type: string, required: boolean}[]}) {
  const [values, setValues] = useState<{[key: string]: string}>({});

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View className="mt-4">
      {args.map((arg) => (
        <View key={arg.name} className="flex flex-row mb-4">
          <Text className="w-1/3 text-lg">{arg.name}:</Text>
          <TextInput
            className="border border-gray-300 rounded-full p-2 w-1/3"
            value={values[arg.name] || ""}
            onChangeText={text => handleChange(arg.name, text)}
            placeholder={arg.type}
          />
        </View>
      ))}
    </View>
  );
}

function MultiSelect({type, services}: {type: "action" | "reaction", services?: { label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]}) {
  const [data, setData] = useState<workflowProps | null>(null)
  
  const [actionOpen, setActionOpen] = useState(false);
  const [valueAction, setValueAction] = useState(null);
  const [action, setAction] = useState<any[]>([]);

  const [valueService, setValueServices] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [newServices, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>(services ?? []);
  const [params, setParams] = useState<{name: string, type: string, required: boolean}[]>([]);

  useEffect(() => {
    setServices(services ?? []);
  }, [services]);

  useEffect(() => {
    const fetchActions = async () => {
      const res = await api.get(`/services/${valueService}`).catch((error: any) => {
        console.log("Error fetching actions:", error);
      });
      if (res && res.data) {
        const data = await res.data;
        type == "action" && setAction(data.actions.map((action: { name: string; service: string }) => ({ label: action.name, value: action.name })));
        type == "reaction" && setAction(data.reactions.map((reaction: { name: string; service: string }) => ({ label: reaction.name, value: reaction.service })));
      }
    }
    fetchActions();
  }, [valueService]);

  useEffect(() => {
    const fetchActions = async () => {
      const res = await api.get(`/services/${valueService}/actions/${valueAction}/params`).catch((error: any) => {
        console.log("Error fetching actions params:", error);
      });
      if (res && res.data) {
        const data = await res.data;
        console.log("data", data.params);
        setParams(data.params.map((param: { name: string; type: string; required: boolean }) => ({ key: param.name, type: param.type, required: param.required })));
      }
    }
    fetchActions();
  }, [valueAction]);

  useEffect(() => {
    console.log("params", params);
  }, [params]);

  return (
    <View>
      <View className="flex flex-row mt-10 justify-center mb-10">
        {type == "action" ? <Text className="text-2xl font-semibold mt-4">If:</Text> : <Text className="text-2xl font-semibold mt-4">Then:</Text>}

        <View style={{ zIndex: 4000 }} className="mx-4">
          <DropDownPicker
            open={servicesOpen}
            value={valueService}
            items={newServices}
            setOpen={setServicesOpen}
            setValue={setValueServices}
            setItems={setServices}
            schema={{
              label: "label",
              value: "value",
              icon: "icon"
            }}
            labelStyle={{ marginLeft: 5 }}
            listItemLabelStyle={{ marginLeft: 5, height: 30 }}
            autoScroll={true}
            placeholder="Select a service"
            showArrowIcon={false}
            style={{ width: 150, alignSelf: "center" }}
            dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
            listMode="MODAL"
          />
        </View>

        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={actionOpen}
            value={valueAction}
            items={action}
            setOpen={setActionOpen}
            setValue={setValueAction}
            setItems={setAction}
            schema={{
              label: "label",
              value: "value",
              icon: "icon"
            }}
            style={{ width: 150, alignSelf: "center" }}
            dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
            placeholder={type == "action" ? "Select an action" : "Select a reaction"}
            showArrowIcon={false}
            listMode="MODAL"
          />
        </View>
      </View>
      <ArgList args={params}/>
    </View>
  )
}

export default function NewWorkflow() {
  const [data, setData] = useState<workflowProps | null>(null)
    const [title, setTitle] = useState("")
    const [services, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>([]);


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
            icon: value && !value.startsWith("/") ? () => (
              <Image
                source={{ uri: `data:image/png;base64,${value}` }}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            ) : undefined
          };
        });
        setServices(updatedService);
      } catch (error) {
        console.log("Error loading icons:", error);
      }
    }
    loadIcons();
  }, []);

    const save = async () => {
        try {
        const res = await api.post('/areas', {
            name: "salut",
            action: "get_weather",
            action_service: "openWeather",
            reaction: "send_message",
            reaction_service: "Discord",
            params: {"city": "Nancy", "message": "meteo {temp} {city} {desc}"}
        }).catch((error: any) => {
          console.log("Error posting areas:", error);
        });
    
        if (res && res.data) {
          const data = await res.data;
          console.log('response', data);
          setData(data);
          setTitle(data.name);
        }
      } catch(err) {
        console.log("error posting areas", err)
      }
    }

    return (
        <View className="mt-20">
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 bottom-1 mb-4 ml-5" onPress={() => router.push('/main/workflows/')}>
                <Text className="text-white text-center">Back</Text>
            </Pressable>
            <TextInput className="text-4xl font-bold mb-4 ml-5" onChangeText={setTitle} value={title} defaultValue={data?.name} placeholder="title"></TextInput>            
            <MultiSelect type="action" services={services}/>
            <MultiSelect type="reaction" services={services}/>
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto bottom-1" onPress={save}>
                <Text className="text-white text-center">Save</Text>
            </Pressable>
        </View>
    )
}
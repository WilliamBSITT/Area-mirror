import { View, Text, TextInput, Pressable, Image } from "react-native"
import React, {useEffect, useState} from "react"
import { useLocalSearchParams } from "expo-router";
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WheelPicker from '@quidone/react-native-wheel-picker';

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

const HourData = [...Array(60).keys()].map((index) => ({
    value: index,
    label: index.toString(),
}));

function ArgList({args, paramsValues, setParamsValues}: {args: {name: string, type: string, required: boolean}[], paramsValues: {[key: string]: string}, setParamsValues: React.Dispatch<React.SetStateAction<{[key: string]: string}>>}) {
  const handleChange = (name: string, value: string) => {
    setParamsValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <View className="mt-4 flex flex-row w-full">
      {args.map((arg) => (
        <View key={arg.name} style={{ width: "45%" }} className="flex flex-column mb-4 ml-5">
          <Text className="text-lg">{arg.name}:<Text className="text-red-700">{arg.required ? "*" : ""}</Text></Text>
          <TextInput
            style={{ width: "100%" }}
            className="border border-gray-300 rounded-full p-2"
            value={paramsValues[arg.name] || ""}
            onChangeText={text => handleChange(arg.name, text)}
            placeholder={arg.type}
          />
        </View>
      ))}
    </View>
  );
}

function MultiSelect({workflow, type, services, setServices, onServiceChange, onActionChange, onParamsChange, paramsValues, setParamsValues}: {
  type: "actions" | "reactions",
  services?: { label: string; value: string; icon: (() => React.JSX.Element) | undefined }[],
  setServices: React.Dispatch<React.SetStateAction<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>>,
  onServiceChange: (service: string) => void,
  onActionChange: (action: string) => void,
  onParamsChange: (params: any) => void,
  workflow: any,
  paramsValues?: {[key: string]: string} | undefined,
  setParamsValues?: React.Dispatch<React.SetStateAction<{[key: string]: string}>> | undefined
}) {
  const [actionOpen, setActionOpen] = useState(false);
  const [valueAction, setValueAction] = useState<string | null>(null); // Change to null initially
  const [action, setAction] = useState<any[]>([]);
  const [valueService, setValueServices] = useState<string | null>(null); // Change to null initially
  const [servicesOpen, setServicesOpen] = useState(false);
  const [params, setParams] = useState<{name: string, type: string, required: boolean}[]>([]);

  // Set initial values when workflow data is available
  useEffect(() => {
    if (workflow?.service) {
      setValueServices(workflow.service);
    }
  }, [workflow?.service]);

  useEffect(() => {
    if (workflow?.action) {
      setValueAction(workflow.action);
    }
  }, [workflow?.action]);

  // Set initial service value when services load or workflow changes
  useEffect(() => {
    if (workflow?.service && services?.length > 0) {
      const matchingService = services?.find(s => s.value === workflow.service);
      if (matchingService && valueService !== workflow.service) {
        setValueServices(workflow.service);
      }
    }
  }, [services, workflow?.service]);

  // Set initial action value when actions load
  useEffect(() => {
    if (workflow?.action && action?.length > 0) {
      const matchingAction = action.find(a => a.value === workflow.action);
      if (matchingAction && valueAction !== workflow.action) {
        setValueAction(workflow.action);
      }
    }
  }, [action, workflow?.action]);

  useEffect(() => {
    const fetchActions = async () => {
      if (!valueService) return; // Don't fetch if no service is selected
      
      const res = await api.get(`/services/${valueService}`).catch((error: any) => {
        console.log("Error fetching actions:", error);
      });
      if (res && res.data) {
        const data = await res.data;
        console.log("Service data:", data);
        
        if (type === "actions" && data.actions && Array.isArray(data.actions)) {
          setAction(data.actions.map((action: { name: string; service: string }) => ({ 
            label: action.name, 
            value: action.name 
          })));
        } else if (type === "reactions" && data.reactions && Array.isArray(data.reactions)) {
          setAction(data.reactions.map((reaction: { name: string; service: string }) => ({ 
            label: reaction.name, 
            value: reaction.name 
          })));
        } else {
          setAction([]);
          console.log(`No ${type}s found for service ${valueService}`);
        }
      }
    }
    fetchActions();
  }, [valueService, type]); // Add type as dependency

  useEffect(() => {
    const fetchParams = async () => {
      if (!valueService || !valueAction) return; // Don't fetch if either is missing
    
      const res = await api.get(`/services/${valueService}/${type}/${valueAction}/params`).catch((error: any) => {
        console.log(`/services/${valueService}/${type}/${valueAction}/params`, error);
      });
      if (res && res.data) {
        const data = await res.data;
        console.log("Params data:", data); // Add this to debug
        
        if (data.params && Array.isArray(data.params)) {
          setParams(data.params.map((param: { name: string; type: string; required: boolean }) => ({ 
            name: param.name, 
            type: param.type, 
            required: param.required 
          })));
        } else {
          setParams([]);
          console.log(`No params found for ${valueService}/${valueAction}`);
        }
      }
    }
    fetchParams();
  }, [valueAction, valueService]); // Add valueService as dependency too

  useEffect(() => {
    onServiceChange(valueService);
  }, [valueService]);

  useEffect(() => {
    onActionChange(valueAction);
  }, [valueAction]);

  useEffect(() => {
    onParamsChange(params);
  }, [params]);

  const handleParamsChange = (values: any) => {
    onParamsChange(values);
  };

  return (
    <View>
      <View className="flex flex-row mt-10 justify-center mb-10">
        {type == "actions" ? <Text className="text-2xl font-semibold mt-4">If:</Text> : <Text className="text-2xl font-semibold mt-4">Then:</Text>}

        <View style={{ zIndex: 4000 }} className="mx-4">
          <DropDownPicker
            open={servicesOpen}
            value={valueService}
            items={services ?? []}
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
            defaultValue={workflow?.service} // Add this line
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
            style={{ width: 150, alignSelf: "center" }}
            dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
            placeholder={type == "actions" ? "Select an action" : "Select a reaction"}
            showArrowIcon={false}
            listMode="MODAL"
            defaultValue={workflow?.action} // Add this line
          />
        </View>
      </View>
      <ArgList args={params} paramsValues={paramsValues ?? {}} setParamsValues={setParamsValues!} />
    </View>
  )
}

export default function Workflow() {
  const [title, setTitle] = useState("");
  const [data, setData] = useState<workflowProps | null>(null)
  const [services, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>([]);
  const [workflows, setWorkflows] = useState<Array<{
    type: "actions" | "reactions",
    service: string | null,
    action: string | null,
    params: any
  }>>([
    { type: "actions", service: null, action: null, params: {} },
    { type: "reactions", service: null, action: null, params: {} }
  ]);
  const { id } = useLocalSearchParams();
  const [paramsValues, setParamsValues] = useState<{ [key: string]: string }>({});
  const [min, setMin] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);

  const addWorkflow = (type: "actions" | "reactions") => {
    setWorkflows([...workflows, { type, service: null, action: null, params: {} }]);
  };

  const removeWorkflow = (index: number) => {
    setWorkflows(workflows.filter((_, i) => i !== index));
  };

  const updateWorkflow = (index: number, data: any) => {
    const newWorkflows = [...workflows];
    newWorkflows[index] = { ...newWorkflows[index], ...data };
    setWorkflows(newWorkflows);
  };

  useEffect(() => {
    const fetchAREA = async () => {
      try {
        const res = await api.get(`/areas/${id}`);
        if (!res || res.status !== 200) {
          throw new Error(`Server error: ${res ? res.status : 'No response'}`);
        }
  
        const data = await res.data;
        console.log("data", data);
        setData(data);
        setTitle(data.name);
        
        // Set workflows with the fetched data
        setWorkflows([
          { 
            type: "actions",
            service: data.action_service, 
            action: data.action, 
            params: data.params
          }, 
          { 
            type: "reactions",
            service: data.reaction_service, 
            action: data.reaction, 
            params: data.params
          }
        ]);
      } catch(err) {
        console.error("error fetching areas", err)
      }
    }
    fetchAREA()
  }, [id]) // Add id as dependency

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
      const actions = workflows.filter(w => w.type === "actions");
      const reactions = workflows.filter(w => w.type === "reactions");

      const res = await api.post('/areas', {
        name: title,
        action: actions[0].action,
        action_service: actions[0].service,
        // params: actions[0].params,
        reaction: reactions[0].action,
        reaction_service: reactions[0].service,
      });

      if (res && res.data) {
        router.push('/main/workflows/');
      }
    } catch(err) {
      console.log("error posting areas", err);
    }
  };

  return (
    <View className="mt-20">
      <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 bottom-1 mb-4 ml-5" onPress={() => router.push('/main/workflows/')}>
        <Text className="text-white text-center">Back</Text>
      </Pressable>
      <View className="flex flex-row w-full justify-between">
      <TextInput className="text-4xl font-bold mb-4 ml-5" onChangeText={setTitle} value={title} placeholder="title"></TextInput>            
      <View className="flex flex-row items-center mr-5">
        <WheelPicker
          data={HourData}
          value={hour}
          onValueChanged={({ item: { value } }) => setHour(value)}
          enableScrollByTapOnItem={true}
          width={50}
          itemHeight={20}
          style={{ alignSelf: "center"}}
        />
        <Text className="font-bold">h</Text>
        <WheelPicker
            data={HourData}
            value={min}
            onValueChanged={({ item: { value } }) => setMin(value)}
            enableScrollByTapOnItem={true}
            width={50}
            itemHeight={20}
            style={{ alignSelf: "center"}}
        />
        <Text className="font-bold">min</Text>
        </View>
      </View>           

      <Text className="ml-5">Last run: {data?.last_run ? data?.last_run : 'haven\'t already run'}</Text>
      <Text className="ml-5">Next run: {data?.last_run ? data?.last_run : 'haven\'t already run'}</Text>
      {workflows.map((workflow, index) => (
        <View key={index} className="relative">
          <MultiSelect 
            type={workflow.type}
            services={services}
            setServices={setServices}
            workflow={workflow}
            onServiceChange={(service) => updateWorkflow(index, { service })}
            onActionChange={(action) => updateWorkflow(index, { action })}
            onParamsChange={(params) => updateWorkflow(index, { params })}
            paramsValues={paramsValues}
            setParamsValues={setParamsValues}
          />
          <Pressable 
            className="absolute right-4 top-4 bg-red-500 p-2 rounded-full"
            onPress={() => removeWorkflow(index)}
          >
            <Text className="text-white">×</Text>
          </Pressable>
        </View>
      ))}

      <View className="flex-row justify-center space-x-20 mt-4">
        <Pressable 
          className="bg-green-600 rounded-full p-4 mr-5"
          onPress={() => addWorkflow("actions")}
        >
          <Text className="text-white">Add Action</Text>
        </Pressable>
        <Pressable 
          className="bg-blue-600 rounded-full p-4 right ml-5"
          onPress={() => addWorkflow("reactions")}
        >
          <Text className="text-white">Add Reaction</Text>
        </Pressable>
      </View>

      <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto mt-8" onPress={save}>
        <Text className="text-white text-center">Save</Text>
      </Pressable>
    </View>
  );
}

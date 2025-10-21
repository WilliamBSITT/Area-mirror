import { View, Text, TextInput, Pressable, Image, ScrollView, Switch} from "react-native"
import React, {use, useEffect, useState} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import { router, useLocalSearchParams } from "expo-router";
import api from "@/utils/api";
import WheelPicker from '@quidone/react-native-wheel-picker';
import { setParams } from "expo-router/build/global-state/routing";

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

const minutes = [...Array(60).keys()].map((index) => ({
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

function MultiSelect({
  type,
  services,
  onServiceChange,
  onActionChange,
  onParamsChange,
  paramsValues,
  setParamsValues,
  initialService,  // Add this prop
  initialAction    // Add this prop
}: {
  type: "actions" | "reactions",
  services?: { label: string; value: string; icon: (() => React.JSX.Element) | undefined }[],
  onServiceChange: (service: string) => void,
  onActionChange: (action: string) => void,
  onParamsChange: (params: any) => void,
  paramsValues: { [key: string]: string },
  setParamsValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  initialService?: string | null,  // Add these to the interface
  initialAction?: string | null
}) {
  const [actionOpen, setActionOpen] = useState(false);
  const [valueAction, setValueAction] = useState<string>(initialAction || "");  // Use initial value
  const [action, setAction] = useState<any[]>([]);

  const [valueService, setValueServices] = useState<string>(initialService || "");  // Use initial value
  const [servicesOpen, setServicesOpen] = useState(false);
  const [newServices, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>(services ?? []);
  const [params, setParams] = useState<{name: string, type: string, required: boolean}[]>([]);

  // Set initial values when they change
  useEffect(() => {
    if (initialService) {
      setValueServices(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (initialAction) {
      setValueAction(initialAction);
    }
  }, [initialAction]);

  useEffect(() => {
    setServices(services ?? []);
  }, [services]);

  useEffect(() => {
    if (initialService && newServices) {
      const match = newServices.find(s => s.value === initialService || s.label.toLowerCase() === String(initialService).toLowerCase());
      if (match) {
        setValueServices(match.value);
      } else if (initialService !== "") {
        // append a fallback item so the picker can display it
        const fallback = { label: String(initialService), value: String(initialService), icon: undefined };
        setServices(prev => {
          // avoid duplicates
          if (prev.find(p => p.value === fallback.value)) return prev;
          return [...prev, fallback];
        });
        setValueServices(String(initialService));
      }
    }
  }, [newServices, initialService]);

  useEffect(() => {
    const fetchActions = async () => {
      const res = await api.get(`/services/${valueService}`).catch((error: any) => {
        console.log("Error fetching actions:", error);
      });
      if (res && res.data) {
        const data = await res.data;
        if (type === "actions" && Array.isArray(data.actions)) {
          setAction(data.actions.map((action: { name: string; service: string }) => ({ label: action.name, value: action.name })));
        }
        if (type === "reactions" && Array.isArray(data.reactions)) {
          setAction(data.reactions.map((reaction: { name: string; service: string }) => ({ label: reaction.name, value: reaction.name })));
        }
      }
    }
    fetchActions();
  }, [valueService]);

  useEffect(() => {
    const fetchActions = async () => {
      const res = await api.get(`/services/${valueService}/${type}/${valueAction}/params`).catch((error: any) => {
        console.log(`/services/${valueService}/${type}/${valueAction}/params`, error);
      });
      if (res && res.data) {
        const data = await res.data;
        console.log("data", data.params);
        setParams(data.params.map((param: { name: string; type: string; required: boolean }) => ({ name: param.name, type: param.type, required: param.required })));
      }
    }
    fetchActions();
  }, [valueAction]);

  useEffect(() => {
    if (initialAction && action) {
      const match = action.find(a => a.value === initialAction || a.label.toLowerCase() === String(initialAction).toLowerCase());
      if (match) {
        setValueAction(match.value);
      } else if (initialAction !== "") {
        const fallback = { label: String(initialAction), value: String(initialAction) };
        setAction(prev => {
          if (prev.find(p => p.value === fallback.value)) return prev;
          return [...prev, fallback];
        });
        setValueAction(String(initialAction));
      }
    }
  }, [action, initialAction]);

  // Fetch outputs for the selected service/action and type
  const [outputs, setOutputs] = useState<{name: string, type: string, required: boolean}[]>([]);
  useEffect(() => {
    const fetchOutputs = async () => {
      if (!valueService || !valueAction) {
        setOutputs([]);
        return;
      }
      const res = await api.get(`/services/${valueService}/${type}/${valueAction}/outputs`).catch((error: any) => {
        console.log(`/services/${valueService}/${type}/${valueAction}/outputs`, error);
      });
      if (res && res.data) {
        const data = await res.data;
        // Expect data.outputs to be an array like [{ name, type, required }]
        setOutputs((data.outputs || []).map((out: { name: string; type: string; required?: boolean }) => ({ name: out.name, type: out.type, required: !!out.required })));
      }
    }
    fetchOutputs();
  }, [valueService, valueAction]);

  useEffect(() => {
    console.log("params", params);
  }, [params]);

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
            }}
            style={{ width: 150, alignSelf: "center" }}
            dropDownContainerStyle={{ width: 150, alignSelf: "center" }}
            placeholder={type == "actions" ? "Select an action" : "Select a reaction"}
            showArrowIcon={false}
            listMode="MODAL"
          />
        </View>
      </View>
      <ArgList args={params} paramsValues={paramsValues} setParamsValues={setParamsValues} />

      <View className="mt-6">
        {type === "actions" && (
          <View>
            <Text className="text-xl font-semibold ml-5">Outputs:</Text>
            <View className="mt-2">
          {outputs.length === 0 ? (
            <Text className="ml-5 text-gray-500">No outputs available</Text>
          ) : (
            <View className="mt-2 flex flex-row">
              {outputs.map((out) => (
                <View key={out.name} className="flex flex-row mb-4 ml-5 w-90%">
                  <Text className="text-lg">{out.name}: <Text className="text-gray-600">{out.type}</Text></Text>
                </View>
              ))}
            </View>
          )}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default function Workflow({type = "new"}: {type: "new" | "edit"}) {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  // const [data, setData] = useState<workflowProps | null>(null)
  const [services, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>([]);
  const [workflows, setWorkflows] = useState<Array<{
    type: "actions" | "reactions",
    service: string | null,
    action: string | null,
    params: any,
  }>>([{ type: "actions", service: null, action: null, params: {} }, { type: "reactions", service: null, action: null, params: {} }]);
  const [paramsValues, setParamsValues] = useState<{ [key: string]: string }>({});
  const [min, setMin] = useState<number>(0);
  const [hour, setHour] = useState<number>(1);

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
        setHour(Math.floor(data.frequency / 3600));
        setMin(Math.floor((data.frequency % 3600) / 60));
        setTitle(data.name);
        setIsPub(data.public);

        let parsedParams: any = {};
        if (data.params) {
          if (typeof data.params === 'string') {
            try {
              parsedParams = JSON.parse(data.params);
            } catch (e) {
              console.warn('Failed to parse params JSON:', e);
              parsedParams = {};
            }
          } else if (typeof data.params === 'object') {
            parsedParams = data.params;
          }
        }
        setParamsValues(parsedParams || {});

        // Ensure we're setting the workflows after the data is loaded
        setWorkflows([
          { 
            type: "actions",
            service: data.action_service, 
            action: data.action, 
            params: parsedParams
          }, 
          { 
            type: "reactions",
            service: data.reaction_service, 
            action: data.reaction, 
            params: parsedParams
          }
        ]);
    
      } catch(err) {
        console.error("error fetching areas", err)
      }
    }

    if (type === "edit" && id) {
      fetchAREA();
    }
  }, [id, type])  // Add type as dependency
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
      console.log("actions", {
        name: title,
        action: actions[0].action,
        action_service: actions[0].service,
        params: paramsValues,
        reaction: reactions[0].action,
        reaction_service: reactions[0].service,
      });

      if (type === "edit" && id) {
        const res = await api.put(`/areas/${id}`, {
          name: title,
          action: actions[0].action,
          action_service: actions[0].service,
          params: paramsValues,
          reaction: reactions[0].action,
          reaction_service: reactions[0].service,
          frequency: hour * 3600 + min * 60,
          public: isPub,
        });
        if (res && res.data) {
          router.push('/main/workflows/');
        }
      } else {
        const res = await api.post('/areas', {
          name: title,
          action: actions[0].action,
          action_service: actions[0].service,
          params: paramsValues,
          reaction: reactions[0].action,
          reaction_service: reactions[0].service,
          frequency: hour * 3600 + min * 60,
          public: isPub,
        });
        if (res && res.data) {
          router.push('/main/workflows/');
        }
      }

      
    } catch(err) {
      console.log("error posting areas", err);
    }
  };
  const [isPub, setIsPub] = useState(false);
  return (
    <ScrollView className="border-b border-gray-300 mb-4" contentContainerStyle={{ paddingBottom: 80 }}>
      <View className="flex flex-row w-full justify-between">
      <TextInput className="text-4xl font-bold ml-5" onChangeText={setTitle} value={title} placeholder="title"></TextInput>            
      <View className="flex flex-row items-center mr-5">
        <WheelPicker
          data={minutes}
          value={hour}
          onValueChanged={({ item: { value } }) => setHour(value)}
          enableScrollByTapOnItem={true}
          width={50}
          itemHeight={20}
          style={{ alignSelf: "center"}}
        />
        <Text className="font-bold">h</Text>
        <WheelPicker
            data={minutes}
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
      {workflows.map((workflow, index) => (
        <View key={index} className="relative">
          <MultiSelect 
            type={workflow.type}
            services={services}
            onServiceChange={(service) => updateWorkflow(index, { service })}
            onActionChange={(action) => updateWorkflow(index, { action })}
            onParamsChange={(params) => updateWorkflow(index, { params })}
            paramsValues={paramsValues || {}}
            setParamsValues={setParamsValues}
            initialService={workflow.service}
            initialAction={workflow.action}
          />
          <Pressable 
            className="absolute right-4 top-4 bg-red-500 p-2 rounded-full"
            onPress={() => removeWorkflow(index)}
          >
            <Text className="text-white">×</Text>
          </Pressable>
        </View>
      ))}
      <View className="flex-row m-auto">
        <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto" onPress={save}>
          <Text className="text-white text-center">Save</Text>
        </Pressable>
        <View className="items-center ml-6">
          <Text>Public Workflow</Text>
          <Switch onValueChange={()=> setIsPub(!isPub)} value={isPub} className="w-10" thumbColor={isPub ? "#57c229" : 'grey'} trackColor={{true: 'green', false: 'grey'}}/>
        </View>
      </View>
    </ScrollView>
  );
}
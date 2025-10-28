import { View, Text, TextInput, Pressable, Image, ScrollView, Switch, CodegenTypes} from "react-native"
import React, {use, useEffect, useState} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import { router, useLocalSearchParams } from "expo-router";
import api from "@/utils/api";
import WheelPicker from '@quidone/react-native-wheel-picker';
import showToast from "@/utils/showToast";
import * as Linking from 'expo-linking';
import { callSpotify, openGithub} from "../home/[id]";


export interface workflowProps {
    "action": string,
    "action_service": string,
    "enabled": boolean,
    "id": number,
    "last_run": string,
    "name": string,
    "params": string,
    "reaction": string,
    "reaction_service": string,
    "public": boolean,
    "frequency": number
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
    <View className="mt-6 px-5">
      <View className="flex flex-row flex-wrap justify-between">
        {args.map((arg) => (
          <View key={arg.name} style={{ width: "48%" }} className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {arg.name}
              {arg.required && <Text className="text-red-500 ml-1">*</Text>}
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 shadow-sm"
              value={paramsValues[arg.name] || ""}
              onChangeText={text => handleChange(arg.name, text)}
              placeholder={arg.type}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        ))}
      </View>
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
  initialService,
  initialAction,
  setEventFill,
}: {
  type: "actions" | "reactions",
  services?: { label: string; value: string; icon: (() => React.JSX.Element) | undefined }[],
  onServiceChange: (service: string) => void,
  onActionChange: (action: string) => void,
  onParamsChange: (params: any) => void,
  paramsValues: { [key: string]: string },
  setParamsValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  initialService?: string | null,
  initialAction?: string | null,
  setEventFill: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const [actionOpen, setActionOpen] = useState(false);
  const [valueAction, setValueAction] = useState<string>(initialAction || "");
  const [action, setAction] = useState<any[]>([]);

  const [valueService, setValueServices] = useState<string>(initialService || "");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [newServices, setServices] = useState<{ label: string; value: string; icon: (() => React.JSX.Element) | undefined }[]>(services ?? []);
  const [params, setParams] = useState<{name: string, type: string, required: boolean}[]>([]);
  const [authCode, setAuthCode] = useState<string | null>(null);

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
        const fallback = { label: String(initialService), value: String(initialService), icon: undefined };
        setServices(prev => {
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
        showToast("error", "Failed to load actions/reactions", "There was an error loading actions/reactions for the selected service.");
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
    if (!authCode) return;
      
    const handleAuthCallback = async () => {
      try {
        // For Spotify
        if (valueService === "spotify") {
          const res = await api.post('/spotify/exchange_token', { code: authCode });
          if (res.status === 200 || res.status === 201) {
            console.log("Spotify connected successfully");
            console.log(res.data);
          }
        }
        // For GitHub
        else if (valueService === "github") {
          const res = await api.post('/git/exchange_token', { code: authCode });
          if (res.status === 200 || res.status === 201) {
            console.log("GitHub connected successfully");
            console.log(res.data);
          }
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
      }
    };

    handleAuthCallback();
  }, [authCode, valueService]);

    useEffect(() => {
      const handleDeepLink = (event: Linking.EventType) => {
        const { queryParams } = Linking.parse(event.url);
        if (queryParams?.code) {
          console.log("Received auth code:", queryParams.code);
          setAuthCode(queryParams.code as string);
        }
      };
  
      const subscription = Linking.addEventListener('url', handleDeepLink);
  
      Linking.getInitialURL().then((url) => {
        if (url) {
          const { queryParams } = Linking.parse(url);
          if (queryParams?.code) {
            console.log("Initial URL auth code:", queryParams.code);
            setAuthCode(queryParams.code as string);
          }
        }
      });
  
      return () => {
        subscription.remove();
      };
    }, []);

  useEffect(() => {
    const fetchActions = async () => {
      const res = await api.get(`/services/${valueService}/${type}/${valueAction}/params`).catch((error: any) => {
        console.log(`/services/${valueService}/${type}/${valueAction}/params`, error);
      });
      if (res && res.data) {
        const data = await res.data;
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
        setOutputs((data.outputs || []).map((out: { name: string; type: string; required?: boolean }) => ({ name: out.name, type: out.type, required: !!out.required })));
      }
    }
    if (valueService != initialService) {
      setValueAction("");
    }
    if(valueAction == "")
      setEventFill(false);
    else
      setEventFill(true);
    console.log("valueService changed:", valueService);
    if (valueService == "spotify") {
      callSpotify();
    } else if (valueService == "github") {
      openGithub();
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
    <View className="bg-white rounded-2xl shadow-md mx-4 my-3 p-5">
      <View className="flex flex-row items-center mb-4">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${type === "actions" ? "bg-blue-100" : "bg-purple-100"}`}>
          <Text className={`text-base font-bold ${type === "actions" ? "text-blue-600" : "text-purple-600"}`}>
            {type === "actions" ? "IF" : "THEN"}
          </Text>
        </View>
        <Text className={`text-lg font-semibold ml-3 ${type === "actions" ? "text-blue-800" : "text-purple-800"}`}>
          {type === "actions" ? "Trigger" : "Action"}
        </Text>
      </View>

      <View className="flex flex-row justify-between items-center mb-4">
        <View style={{ zIndex: 4000, flex: 1, marginRight: 8 }}>
          <Text className="text-xs font-medium text-gray-500 mb-2 ml-1">SERVICE</Text>
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
            labelStyle={{ marginLeft: 8, fontSize: 14, fontWeight: "500" }}
            listItemLabelStyle={{ marginLeft: 8 }}
            autoScroll={true}
            placeholder="Select service"
            showArrowIcon={true}
            style={{ 
              borderColor: "#E5E7EB",
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: "#F9FAFB"
            }}
            dropDownContainerStyle={{ 
              borderColor: "#E5E7EB",
              borderRadius: 12,
              marginTop: 4
            }}
            listMode="MODAL"
          />
        </View>

        <View style={{ zIndex: 3000, flex: 1, marginLeft: 8 }}>
          <Text className="text-xs font-medium text-gray-500 mb-2 ml-1">
            {type === "actions" ? "EVENT" : "TASK"}
          </Text>
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
            style={{ 
              borderColor: "#E5E7EB",
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: "#F9FAFB"
            }}
            dropDownContainerStyle={{ 
              borderColor: "#E5E7EB",
              borderRadius: 12,
              marginTop: 4
            }}
            labelStyle={{ marginLeft: 8, fontSize: 14, fontWeight: "500" }}
            placeholder={type === "actions" ? "Select event" : "Select task"}
            showArrowIcon={true}
            listMode="MODAL"
          />
        </View>
      </View>

      <ArgList args={params} paramsValues={paramsValues} setParamsValues={setParamsValues} />

      {type === "actions" && outputs.length > 0 && (
        <View className="mt-6 pt-4 border-t border-gray-100">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Available Outputs</Text>
          <View className="flex flex-row flex-wrap">
            {outputs.map((out) => (
              <View key={out.name} className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
                <Text className="text-sm">
                  <Text className="font-medium text-gray-800">{out.name}</Text>
                  <Text className="text-gray-500"> • {out.type}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

export default function Workflow({type = "new"}: {type: "new" | "edit"}) {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
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
  const [isPub, setIsPub] = useState(false);

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
  }, [id, type])

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

    const test_alpha = () => {

    const isAlpha = (str) => /^[A-Za-z-]+$/.test(str);
    const isAlphanumeric = (str) => /^[A-Za-z0-9]+$/.test(str);
    const isEmailLike = (str) => str.includes('@') && str.includes('.');

    if (paramsValues.city && !isAlpha(paramsValues.city))
      return false;
    if (paramsValues.message != null) {
      if (paramsValues.message === "" || paramsValues.channel_id === "")
        return false;
      if (!isAlphanumeric(paramsValues.channel_id))
        return false;
    }
    if (paramsValues.from != null) {
      if (paramsValues.from === "" || paramsValues.password === "")
        return false;
      if (!isEmailLike(paramsValues.from))
        return false;
      if (paramsValues.to !== "" && !isEmailLike(paramsValues.to))
        return false;
    }

    return true;
  };

  const save = async () => {
    if (test_alpha() == false) {
          showToast("error", "Bad Parameters", "Argument Missing or Bad type argument");
          return;
    }
    try {
      const actions = workflows.filter(w => w.type === "actions");
      const reactions = workflows.filter(w => w.type === "reactions");

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
          showToast("success", "Workflow updated", "The workflow has been updated successfully.");
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
  const [EventFill, setEventFill] = useState(false);
  const TestArgs = () => {
    EventFill?save():showToast("error", "Bad Parameters", "Argument Missing or Bad type argument");
  }
  return (
    <ScrollView className="bg-gray-50" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header Section */}
      <View className="px-5 pt-2">
        <TextInput 
          className="text-3xl font-bold text-gray-900 mb-4" 
          onChangeText={setTitle} 
          value={title} 
          placeholder="Workflow Name"
          placeholderTextColor="#9CA3AF"
        />
        
        {/* Frequency Picker */}
        <View className="bg-white rounded-xl shadow-md p-4 items-center">
          <Text className="text-sm font-medium text-gray-600">Run Every</Text>
          <View className="flex flex-row items-center justify-center">
            <View className="items-center mr-2">
              <WheelPicker
                data={minutes}
                value={hour}
                onValueChanged={({ item: { value } }) => setHour(value)}
                enableScrollByTapOnItem={true}
                width={60}
                itemHeight={25}
                style={{ alignSelf: "center" }}
              />
              <Text className="text-sm font-semibold text-gray-700">hours</Text>
            </View>
            
            <Text className="text-xl font-bold text-gray-400 mx-2">:</Text>
            
            <View className="items-center ml-2">
              <WheelPicker
                data={minutes}
                value={min}
                onValueChanged={({ item: { value } }) => setMin(value)}
                enableScrollByTapOnItem={true}
                width={60}
                itemHeight={25}
                style={{ alignSelf: "center" }}
              />
              <Text className="text-sm font-semibold text-gray-700">minutes</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Workflow Cards */}
      <View className="mt-4">
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
              setEventFill={setEventFill}
            />
            {workflows.length > 2 && (
              <Pressable 
                className="absolute right-6 top-5 bg-red-500 rounded-full w-8 h-8 items-center justify-center shadow-md"
                onPress={() => removeWorkflow(index)}
              >
                <Text className="text-white text-xl font-bold">×</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* Bottom Actions */}
      <View className="px-4 mt-6">
        <View className="bg-white rounded-2xl shadow-md p-5 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">Public Workflow</Text>
              <Text className="text-sm text-gray-500 mt-1">Share with community</Text>
            </View>
            <Switch 
              onValueChange={() => setIsPub(!isPub)} 
              value={isPub} 
              thumbColor={isPub ? "#10B981" : "#D1D5DB"} 
              trackColor={{true: '#86EFAC', false: '#E5E7EB'}}
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>
          <Pressable
          className="rounded-2xl py-4 shadow-lg active:opacity-80 bg-blue-900"
          onPress={TestArgs}
          >
            <Text className="text-white text-center text-lg font-bold">
              {type === "edit" ? "Update Workflow" : "Create Workflow"}
            </Text>
          </Pressable>
      </View>
    </ScrollView>
  );
}
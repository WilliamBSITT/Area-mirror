import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import api from '@/utils/api';
import { service } from '../home/index';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Publics() {
    const [publicAreas, setPublicAreas] = useState<service[]>([]);
    const [data, setData] = useState<service[]>([]);

    useEffect(() => {
        const fetchPublicAreas = async () => {
            try {
                const response = await api.get('/areas/public');
                setPublicAreas(response.data);
            } catch (error) {
                console.error("There was an error fetching the public areas!", error);
            }
        };
        fetchPublicAreas();
    }, []);

    useEffect(() => {
      const fetchServices = async () => {
        try {
          const res = await api.get(`/services`);
          const resJson = await res.data;
          setData(resJson);
          console.log("Available services:", resJson.map((s: service) => s.name));

          resJson.map( async (service: service) => {
            try {
              await AsyncStorage.setItem(`icon_${service.name}`, service.image);
            } catch (error) {
              console.log("error", error)
            }
          })
        } catch (err) {
          console.error("failed to load services", err);
        }
      };

      fetchServices();
    }, []);

    const save = async (area: service) => {
        try {
            const { name, action, action_service, reaction, reaction_service, params, frequency } = area;

            const res = await api.post('/areas', {
                name,
                action,
                action_service,
                reaction,
                reaction_service,
                params,
                frequency,
                public: false,
            });

            if (res?.data) {
                router.push('/main/workflows/');
            }

        } catch (err) {
            console.log("error posting area", err);
        }
    };
    const findService = (serviceName: string) => {
        return data.find(s => s.name.toLowerCase() === serviceName.toLowerCase());
    };
    return (
        <View>
            {publicAreas.map(area => (
                <Pressable
                    key={area.id}
                    className="bg-blue-900 w-3/4 h-50 ml-10 mr-10 m-4 rounded-2xl p-3"
                    onPress={() => save(area)}
                >
                <Text className='text-white'>{area.name}</Text>
                <View className='flex-row items-center'>
                      {data && data.length > 0 && (
                        (() => {
                          const matchedService = findService(area.action_service);
                          if (matchedService) {
                            return (
                              <Image
                                key={`img-${matchedService.name}`}
                                source={{uri: `data:image/png;base64,${matchedService.image}`}}
                                style={{ width: 44, height: 44, marginRight: 6 }}
                              />
                            );
                          } else {
                            console.log("No match for:", area.action_service);
                            return null;
                          }
                        })()
                      )}
                      <Text className='text-white'>{area.action}</Text>
                    </View>
                    <Text className='text-white'> | </Text>
                    <View className='flex-row items-center'>
                      {data && data.length > 0 && (
                        (() => {
                          const matchedService = findService(area.reaction_service);
                          if (matchedService) {
                            return (
                              <Image
                                key={`img-${matchedService.name}`}
                                source={{uri: `data:image/png;base64,${matchedService.image}`}}
                                style={{ width: 44, height: 44, marginRight: 6 }}
                              />
                            );
                          } else {
                            console.log("No match for:", area.reaction_service);
                            return null;
                          }
                        })()
                        )}
                        <Text className='text-white'>{area.reaction}</Text>
                    </View>
                    <Image 
                        source={require("../../images/plus-white.png")} 
                        style={{ width: 40, height: 40, marginLeft: 'auto', marginRight: 'auto' }}
                    />
                </Pressable>
            ))}
        </View>
    );
};
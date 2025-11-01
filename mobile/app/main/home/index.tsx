import React, { useEffect, useState } from 'react';
import { Text, Image, View, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/utils/api';
import showToast from '@/utils/showToast';

function Card({name, path, id}: {name:string, path:any, id:number} ) {
  return (
    <Link
      href={{
        pathname: '/main/home/[id]',
        params: { id: name },
      }}
      asChild>
      <Pressable className="bg-[var(--color-card)] w-70 h-70 rounded-2xl flex" style={{shadowColor: '#000', shadowOpacity: 0.8, elevation: 6,}}>
        <View className="items-start">
          <Text className="text-text font-bold ml-4 mt-2 justify-start">
            {name}
          </Text>
        </View>
        <View className="items-center">
          <Image
            source={{ uri: path }}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>
        <View className="items-end">
          <Text className="bg-secondary rounded-2xl p-1 text-center mr-2 mb-2 text-white">
            Details
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export interface service {
    name: string
    id: string
    image: string
    required: boolean
    description: string
    auth_url: string
}

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/services`);
        const resJson = await res.data;
        setData(resJson);

        resJson.map(async (service: service) => {
          try {
            await AsyncStorage.setItem(`icon_${(service.name).toLowerCase()}`, service.image);
          } catch (error) {
            console.log("error", error)
          }
        })
      } catch (err) {
        console.error("failed to load services", err);
        showToast("error", "Failed to load services", "There was an error loading services.");
      }
    };

    fetchServices();
  }, []);

  return (
    <View className='flex-1 bg-background'>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className='bg-background'
      >
        <View className="flex flex-row flex-wrap ml-4 bg-background">
          {data.map((service: service) => (
            <View className="w-1/2 p-5" key={service.name}>
              <Card
                name={service.name}
                path={`data:image/png;base64,${service.image}`}
                id={Number(service.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

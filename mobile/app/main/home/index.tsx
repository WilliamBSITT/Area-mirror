
import React, { useEffect, useState } from 'react';
import { Text, Image, View, ScrollView, Pressable, StyleSheet } from 'react-native';
import {Link} from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/utils/api';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../../../images/logo.png')}
        style={{ width: 200, height: 120, marginLeft: 5, marginTop: 5 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

function Card({name, path, id}: {name:string, path:any, id:number} ) {
  return (
    <Link
      href={{
        pathname: '/main/home/[id]',
        params: { id: name },
      }}
    asChild>
      <Pressable className="bg-[#F4FBFB] w-70 h-70 rounded-2xl flex">
        <View className="items-start">
          <Text className="text-black font-bold ml-4 mt-2 justify-start">
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
          <Text className="bg-slate-400 rounded-2xl p-1 text-center mr-2 mb-2 text-white">
            Details
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export interface service {
    name: string
    id: number
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
  return (
  <View style={{ flex: 1 }}>
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="flex flex-row flex-wrap ml-4">
        {data.map((service: service) => (
          <View className="w-1/2 p-5" key={service.name}>
            <Card
              name={service.name}
              path={`data:image/png;base64,${service.image}`}
              id={service.id}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);
}


import React, { useEffect, useState } from 'react';
import { Text, Image, View, ScrollView } from 'react-native';
import {Link} from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/utils/api';

function Card({name, path, id}: {name:string, path:any, id:number} ) {
  return (
    <View className="bg-[#F4FBFB] w-70 h-70 rounded-2xl flex">
      <View className="items-start">
      <Text className="text-black font-bold ml-4 mt-2 justify-start">{name}</Text>
      </View>
      <View className='items-center'>
        <Image
          source={{uri: path}}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>
      <View className="items-end">
      <Link
        href={{
          pathname: '/main/home/[id]',
          params: { id: name },
        }}
        className='bg-slate-400 rounded-2xl p-1 w-1/3 justify-end flex text-center mr-2 mb-2'
      >
        Detail
      </Link>
      </View>
    </View>
  );
}

export interface service {
    name: string
    id: number
    image: string
    required: boolean
    description: string
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
    <ScrollView>
    <View className="bg-white flex-1 ">
      <Image
        source={require('../../../images/logo.png')}
        className="w-[200px] h-[120px] ml-5 mt-5"
        resizeMode="contain"
      />
      
      <View className="flex flex-row flex-wrap mt-10 ml-4">
        {
          data.map((service: service)=>  
          <View className="w-1/2 p-5" key={service.name}>
            <Card name={service.name} path={`data:image/png;base64,${service.image}`} id={service.id} key={service.name}/>
          </View>
          )
        }
      </View>
    </View>
    </ScrollView>
  );
}


import React, { useEffect, useState } from 'react';
import { Text, Image, View } from 'react-native';
import {Link} from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          pathname: '/main/services/[id]',
          params: { id: name },
        }}
        className='bg-slate-400 rounded-2xl p-1 w-1/3 justify-end flex text-center mr-2 mb-2'
      >
        See more
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
  const [Ip, setIp] = useState<string | null>(null)

  useEffect(() => {
    const loadIp = async () => {
      const storedIp = await AsyncStorage.getItem("ip");
      setIp(storedIp);
    };
    loadIp();
  }, []);

  useEffect(() => {
    if (!Ip) return; // wait until Ip is set

    const fetchServices = async () => {
      try {
        const res = await fetch(`http://${Ip}:8080/services`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch services");

        const resJson = await res.json();
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
  }, [Ip]);
  return (
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
  );
}

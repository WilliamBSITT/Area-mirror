import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import api from '@/utils/api';
import { service } from '../home/index';
import { router } from "expo-router";
import showToast from '@/utils/showToast';

export default function Publics() {
    const [publicAreas, setPublicAreas] = useState<service[]>([]);

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
            showToast("error", "Failed to save area", "There was an error saving the area. Please try again.");
        }
    };

    return (
        <View>
            {publicAreas.map(area => (
                <Pressable
                    key={area.id}
                    className="bg-blue-900 w-3/4 h-40 ml-10 mr-10 m-4 rounded-2xl p-3"
                    onPress={() => save(area)}
                >
                    <Text className='text-white'>{area.name}</Text>
                    <View className='flex-row'>
                        <Text className='text-white'>{area.action_service} - </Text>
                        <Text className='text-white'>{area.action}</Text>
                    </View>
                    <Text className='text-white'> | </Text>
                    <View className='flex-row'>
                        <Text className='text-white'>{area.reaction_service} - </Text>
                        <Text className='text-white'>{area.reaction}</Text>
                    </View>
                    <Image source={require("../../images/plus-white.png")} className="w-10 h-10 m-auto" />
                </Pressable>
            ))}
        </View>
    );
};

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Image, RefreshControl, ScrollView } from 'react-native';
import api from '@/utils/api';
import { workflowProps } from './workflows/newWorkflow';
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from '@/utils/showToast';
import Feather from '@expo/vector-icons/build/Feather';

export type WorkflowWithImage = workflowProps & { icon_action: string, icon_reaction: string };

export default function Publics() {
    const [publicAreas, setPublicAreas] = useState<WorkflowWithImage[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        await Promise.all([fetchPublicAreas()]);
    };

    const fetchPublicAreas = async () => {
        try {
            const response = await api.get('/areas/public');
            const enriched = await Promise.all(
              response.data.map(async (area: any) => {
                try {
              const icon_action = await AsyncStorage.getItem(`icon_${area.action_service}`);
              const icon_reaction = await AsyncStorage.getItem(`icon_${area.reaction_service}`);
              return { ...area, icon_action, icon_reaction }; // icon is a base64 string or null
                } catch {
              return { ...area, icon_action: null, icon_reaction: null };
                }
              })
            );
            setPublicAreas(enriched);
        } catch (error) {
            showToast("error", "Failed to load public areas", "There was an error loading public areas.");
        }
    };

    const save = async (area: workflowProps) => {
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
            showToast("error", "Error adding area", "Failed to add the selected area. Please try again.");
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    // Use useFocusEffect for automatic refresh
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            className='bg-background'
        >
            {publicAreas.map(area => (
                <Pressable
                    key={area.id}
                    className="bg-blue-900 w-3/4 h-50 ml-10 mr-10 m-4 rounded-2xl p-3"
                    onPress={() => save(area)}
                >
                <Text className='text-white'>{area.name}</Text>
                <View className='flex-row items-center'>
                    <Image
                      key={`img-${area.name}`}
                      source={{uri: `data:image/png;base64,${area.icon_action}`}}
                      style={{ width: 44, height: 44, marginRight: 6 }}
                    />
                      <Text className='text-white'>{area.action}</Text>
                    </View>
                    <Text className='text-white'> | </Text>
                    <View className='flex-row items-center'>
                    <Image
                      key={`img-${area.name}`}
                      source={{uri: `data:image/png;base64,${area.icon_reaction}`}}
                      style={{ width: 44, height: 44, marginRight: 6 }}
                    />
                        <Text className='text-white'>{area.reaction}</Text>
                    </View>
                    <Feather name="plus" size={48} color="white" style={{ margin: 'auto' }}/>
                </Pressable>
            ))}
        </ScrollView>
    );
};
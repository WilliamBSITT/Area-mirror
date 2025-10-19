import React from 'react'
import { View, Text } from 'react-native'
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { service } from '../home/index';

export default function Publics() {
    const [publicAreas, setPublicAreas] = useState<service[]>([]);

    useEffect(() => {
        const fetchPublicAreas = async () => {
            await api.get('/areas/public').then(response => {
                setPublicAreas(response.data);
            }).catch(error => {
                console.error("There was an error fetching the public areas!", error);
            });
        };
        fetchPublicAreas();
    }, []);

    return (
        <View>
            {publicAreas.map(area => (
                <Text key={area.id}>{area.name}</Text>
            ))}
        </View>
    )
}

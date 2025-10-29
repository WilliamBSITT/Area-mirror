import { View, Text, Pressable, TextInput, Image, ScrollView } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { deleteToken } from "@/utils/secureStore";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "@/utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import showToast from "@/utils/showToast";
import Switch from "@/components/mySwitch";
import { useSharedValue } from "react-native-reanimated";

export default function Profile() {
    const auth = useContext(AuthContext);
    const [newEmail, setNewEmail] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [oldPwd, setOldPwd] = useState("")
    const [Mail, setMail] = useState<string>('');
    const [Edit, setEdit] = useState(false);
    const isNotificationsEnabled = useSharedValue(false);
    const toggleNotifications = async () => {
        const id = await SecureStore.getItemAsync("id")
        isNotificationsEnabled.value = !isNotificationsEnabled.value;
        api.put(`/users/${id}`, {
            allow_notifications: isNotificationsEnabled.value
        }).then(() => {
            showToast("success", "Notification setting updated", `Notifications have been ${isNotificationsEnabled.value ? "enabled" : "disabled"}.`);
        }).catch((error: any) => {
            showToast("error", "Failed to update notification settings", "There was an error updating your notification settings.");
        });
    };

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        const id = await SecureStore.getItemAsync("id");
        api.put(`/users/${id}`, {
            pictures: result?.assets?.[0].base64 || "undefined"
        }).then(() => {
            showToast("success", "Profile picture updated", "Your profile picture has been updated successfully.");
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        })
        .catch((error: any) => {
            showToast("error", "Failed to update profile picture", "There was an error updating your profile picture.");
        });
    };

    const verif = (e: any) => {
        if(e.nativeEvent.key == "Enter"){
            sendMail()
        }
    }

    const sendMail = async () => {
        const id = await SecureStore.getItemAsync("id")
        const res = await api.put(`/users/${id}`, {
            email: newEmail
        }).catch((error: any) => {
            showToast("error", "Failed to change email", "There was an error changing your email.");
        });

        if (res && res.status === 200) {
            showToast("success", "Email changed", "Your email has been changed successfully.");
            setMail(newEmail);
            setNewEmail("");
            setEdit(false);
        } else {
            showToast("error", "Failed to change email", "There was an error changing your email.");
        }
    }

    const verifyPwd = async () => {
        const id = await SecureStore.getItemAsync("id")
        const res = await api.put(`http://10.18.208.4:8080/users/${id}`, {
            password: newPwd
        }).catch((error: any) => {
            showToast("error", "Failed to change password", "There was an error changing your password.");
        });

        if (res && res.status === 200) {
            showToast("success", "Password changed", "Your password has been changed successfully.");
            setNewPwd("");
            setOldPwd("");
            setEdit(false);
        } else {
            showToast("error", "Failed to change password", "There was an error changing your password.");
        }
    }

    const logout = () => {
        deleteToken();
        auth?.logout();
        console.log("successfully logged out")
        router.push("/auth/login");
    }

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const id = await SecureStore.getItemAsync("id")
          const res = await api.get(`/users/${id}`);
          if (res.data.pictures) {
              setImage(`data:image/png;base64,${res.data.pictures}`);
          }
          setMail(res.data.email);
          isNotificationsEnabled.value = res.data.allow_notifications;
        } catch (err) {
          console.error("Échec du chargement de l'utilisateur :", err);
        }
      };
        fetchUser();
    }, []);

    return (
    <ScrollView className="bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Section with Profile Picture */}
        <View className="bg-white px-6 pt-8 pb-6 shadow-sm">
            <View className="items-center mb-6">
                <Pressable onPress={pickImage} className="relative">
                    {image ? 
                        <Image 
                            source={{ uri: image }} 
                            className="w-32 h-32 rounded-full border-4 border-blue-100"
                            resizeMode="cover"
                        /> :
                        <View className="w-32 h-32 rounded-full bg-blue-100 items-center justify-center border-4 border-blue-200">
                            <FontAwesome name="user-circle-o" size={80} color="#3B82F6" />
                        </View>
                    }
                    <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-md">
                        <MaterialIcons name="camera-alt" size={20} color="white" />
                    </View>
                </Pressable>
                <Text className="text-sm text-gray-500 mt-3">Tap to change photo</Text>
            </View>

            <Pressable 
                onPress={() => setEdit(!Edit)}
                className="flex-row items-center justify-center bg-blue-50 rounded-xl py-3 px-4"
            >
                <MaterialIcons name="edit" size={20} color="#2563EB" />
                <Text className="text-blue-600 font-semibold ml-2">
                    {Edit ? "Cancel Editing" : "Edit Profile"}
                </Text>
            </Pressable>
        </View>

        {/* Email Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md p-5">
            <View className="flex-row items-center mb-3">
                <MaterialIcons name="email" size={24} color="#6B7280" />
                <Text className="text-xl font-bold text-gray-800 ml-2">Email Address</Text>
            </View>
            
            {Edit ? (
                <View>
                    <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-3"
                        value={newEmail} 
                        placeholder="Enter new email" 
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setNewEmail} 
                        onKeyPress={verif}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Pressable 
                        className="rounded-xl py-3 shadow-sm bg-blue-900"
                        onPress={sendMail}
                    >
                        <Text className="text-white text-center font-semibold">Update Email</Text>
                    </Pressable>
                </View>
            ) : (
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                    <Text className="text-base text-gray-700">{Mail}</Text>
                </View>
            )}
        </View>

        {/* Password Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md p-5">
            <View className="flex-row items-center mb-3">
                <MaterialIcons name="lock" size={24} color="#6B7280" />
                <Text className="text-xl font-bold text-gray-800 ml-2">Password</Text>
            </View>
            
            {Edit ? (
                <View>
                    <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-3"
                        value={oldPwd} 
                        placeholder="Current password" 
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setOldPwd}
                        secureTextEntry
                    />
                    <TextInput 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-3"
                        value={newPwd} 
                        placeholder="New password" 
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setNewPwd}
                        secureTextEntry
                    />
                    <Pressable 
                        className="rounded-xl py-3 shadow-sm bg-blue-900"
                        onPress={verifyPwd}
                    >
                        <Text className="text-white text-center font-semibold">Update Password</Text>
                    </Pressable>
                </View>
            ) : (
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                    <Text className="text-base text-gray-700">••••••••</Text>
                </View>
            )}
        </View>

        <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md p-5">
            <View className="flex-row items-center mb-3">
                <MaterialIcons name="notifications" size={24} color="#6B7280" />
                <Text className="text-xl font-bold text-gray-800 ml-2">Notifications</Text>
            </View>
            <View className="flex-row items-center justify-between">
                <Text className="text-gray-700 text-base">When a workflow is running</Text>
                <Switch value={isNotificationsEnabled} onPress={toggleNotifications} />
            </View>
        </View>

        {/* Logout Section */}
        <View className="mx-4 mt-8">
            <Pressable 
                className="bg-red-400 rounded-2xl py-4 shadow-lg flex-row items-center justify-center"
                onPress={logout}
            >
                <MaterialIcons name="logout" size={22} color="white" />
                <Text className="text-white text-center text-lg font-bold ml-2">Log Out</Text>
            </Pressable>
        </View>

        {/* Footer Space */}
        <View className="h-8" />
    </ScrollView>
    )
}
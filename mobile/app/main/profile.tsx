import { View, Text, Pressable, TextInput, Modal } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { deleteToken } from "@/utils/secureStore";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "@/utils/api";

export default function Profile() {
    const auth = useContext(AuthContext);
    const [newEmail, setNewEmail] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [oldPwd, setOldPwd] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            console.log("Error changing email:", error);
        });

        if (res && res.status === 200) {
            console.log("Email changed successfully")
        } else {
            console.log("Failed to change email")
        }
    }

    const verifyPwd = async () => {
        const id = await SecureStore.getItemAsync("id")
        const res = await api.put(`http://10.18.208.4:8080/users/${id}`, {
            password: newPwd
        }).catch((error: any) => {
            console.log("Error changing password:", error);
        });
        
        if (res && res.status === 200) {    
            console.log("Password changed successfully")
        } else {
            console.log("Failed to change password")
        }
        setIsModalOpen(false)

    }

    const logout = () => {
        deleteToken();
        auth?.logout();
        console.log("successfully logged out")
        router.push("/auth/login");
    }

    return (<View className="mt-60 ml-5 h-full">
        <View className="flex flex-row ">
            <TextInput className="mb-4 text-lg border-2 border-solid border-blue-800 rounded-full" value={newEmail} defaultValue={""} placeholder="replace your email" onChangeText={setNewEmail} onKeyPress={(e) => verif(e)}/>
            <Pressable className="bg-blue-900 rounded-full p-3 w-1/4 m-auto" onPress={logout}>
                <Text className="text-white text-center text-xl">Change</Text>
            </Pressable>
        </View>

        <Pressable className="bg-blue-900 rounded-full p-4 w-1/2" onPress={() => setIsModalOpen(!isModalOpen)}>
            <Text className="text-white text-center">Change password</Text>
        </Pressable>
        <Modal visible={isModalOpen}>
            <TextInput value={oldPwd} defaultValue={""} placeholder="current password" onChangeText={setOldPwd}/>
            <TextInput value={newPwd} defaultValue={""} placeholder="new password" onChangeText={setNewPwd}/>
            <Pressable className="bg-blue-900 rounded-full p-4 w-1/4" onPress={verifyPwd}>
                <Text className="text-white text-center">change</Text>
            </Pressable>
        </Modal>
        <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 m-auto bottom-1" onPress={logout}>
            <Text className="text-white text-center">Log out</Text>
        </Pressable>
    </View>)
}
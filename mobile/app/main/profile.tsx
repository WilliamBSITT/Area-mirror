import { View, Text, Pressable, TextInput, Modal } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { deleteToken } from "@/utils/secureStore";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
    const auth = useContext(AuthContext);
    const mail = auth?.user?.email;
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
        const token = await SecureStore.getItemAsync("jwt")
        const id = await SecureStore.getItemAsync("id")
        try {
            const res = await fetch(`http://10.18.208.4:8080/users/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        email: newEmail
                    })
                }
            )
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            console.log("ok")
        } catch(err) {
            console.error("send mail error", err)
        }
    }

    const verifyPwd = async () => {
        const token = await SecureStore.getItemAsync("jwt")
        const id = await SecureStore.getItemAsync("id")
        console.log("id :", token)
        try {
            const res = await fetch(`http://10.18.208.4:8080/users/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        password: newPwd
                    })
                }
            )
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
        } catch(err) {
            console.error("fail to change pwd", err)
        }
        setIsModalOpen(false)

    }

    const logout = () => {
        deleteToken();
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
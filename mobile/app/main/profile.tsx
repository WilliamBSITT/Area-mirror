import { View, Text, Pressable, TextInput, Modal, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { deleteToken } from "@/utils/secureStore";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "@/utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Profile() {
    const auth = useContext(AuthContext);
    const [newEmail, setNewEmail] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [oldPwd, setOldPwd] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Mail, setMail] = useState();
    const [Edit, setEdit] = useState(false);

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

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const id = await SecureStore.getItemAsync("id")
          const res = await api.get(`/users/${id}`);
          setMail(res.data.email);
        } catch (err) {
          console.error("Échec du chargement de l'utilisateur :", err);
        }
      };
        fetchUser();
    }, [Mail]);
    return (
    <View className="mt-20 ml-5 h-full p-5">
        <View className="flex-row items-center justify-between mb-8">
            <Image
                source={require('../../images/avatar.png')}
                className="w-20 h-20 mr-4"
                resizeMode="contain"
            />
            <Pressable className="" onPress={()=>{setEdit(!Edit)}}>
                <MaterialIcons className="ml-auto" name="edit" size={58}/>
            </Pressable>
        </View>
        <Text className="text-4xl">E-Mail</Text>
        {
            Edit 
            ? <View className="flex flex-row ">
            <TextInput className="mb-4 text-lg border-2 border-solid border-blue-800 rounded-full" value={newEmail} defaultValue={""} placeholder="replace your email" onChangeText={setNewEmail} onKeyPress={(e) => verif(e)}/>
            <Pressable className="bg-blue-900 rounded-full p-3 w-1/4 m-auto" onPress={logout}>
                <Text className="text-white text-center text-xl">Change</Text>
            </Pressable>
            </View>
            : <Text className="text-3xl mb-3 mt-2 ml-4">{Mail}</Text>
        }
        
        <Text className="text-4xl">Password</Text>
        {
            Edit 
            ? <View>
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
            </View>
            : <Text className="text-3xl mb-3 mt-2 ml-4">********</Text>
        }
        {/* <View className="flex flex-row ">
            <TextInput className="mb-4 text-lg border-2 border-solid border-blue-800 rounded-full" value={newEmail} defaultValue={""} placeholder="replace your email" onChangeText={setNewEmail} onKeyPress={(e) => verif(e)}/>
            <Pressable className="bg-blue-900 rounded-full p-3 w-1/4 m-auto" onPress={logout}>
                <Text className="text-white text-center text-xl">Change</Text>
            </Pressable>
        </View>
 */}
        
        <Pressable className="bg-blue-900 rounded-full p-4 w-1/4 mt-96 ml-64" onPress={logout}>
            <Text className="text-white text-center">Log out</Text>
        </Pressable>
    </View>)
}
import React from "react";
import { Text, View, Pressable, Button, TextInput } from "react-native";
import axios from 'axios'
import { useState } from "react";
import { Link } from "expo-router";

export default function Index() {
  const handleCallDB = async () => {
    try {
    const res = await fetch(`http://10.18.207.184:8080/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
      {
        "email": mail,
        "password": password
      })
    })
      
    if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    console.log("response data:", data);

    } catch(err) {
      console.log("error", err)
    }
  }
  const [mode, setMode] = useState('register');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput className="border-2 border-solid rounded-full w-1/2 mb-5 p-4" placeholder="email" onChange={newText => setMail(newText)} defaultValue={mail}/>
      <TextInput className="border-2 border-solid rounded-full w-1/2 mb-5 p-4" placeholder="Password" onChange={newPass => setPassword(newPass)} defaultValue={password}/>
      {mode == 'register' && <TextInput className="border-2 border-solid rounded-full w-1/2 mb-5" placeholder="Confirm your password" onChange={newPass => setConfirmPwd(newPass)} defaultValue={confirmPwd}/>}
      <Pressable className="bg-slate-400 rounded-full p-4 mb-30" onPress={handleCallDB}>
        <Text className="text-black">
          {mode == 'register' ? 'Register' : 'Login'}
        </Text>
      </Pressable>
      <Pressable className="rounded-full p-4 mt-40" onPress={() => {mode == 'register' ? setMode('login') : setMode('register')}}>
        <Text className="text-black">
          {mode == 'register' ? 'Login' : "I don't have an account"}
        </Text>
      </Pressable>
      {/* <Button title="click" onPress={handleCallDB}></Button> */}
    </View>
  );
}

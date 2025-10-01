import React from "react";
import { Text, View, Pressable, Image, TextInput } from "react-native";
import { useState } from "react";

export default function Index() {
  const handleCallDB = async () => {
    try {
    const res = await fetch(`http://10.18.207.184:8080/auth/${mode}`, {
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
      <Image source={require('../../images/logo.png')} className="w-1/2 h-1/4"/>
      <TextInput className="border-2 border-solid rounded-full w-1/2 mb-5 p-4" placeholder="email" onChangeText={setMail} defaultValue={mail}/>
      <TextInput secureTextEntry className="border-2 border-solid rounded-full w-1/2 mb-5 p-4" placeholder="Password" onChangeText={setPassword} defaultValue={password}/>
      {mode == 'register' && <TextInput secureTextEntry className="border-2 border-solid rounded-full w-1/2 mb-5 p-4" placeholder="Confirm your password" onChangeText={setConfirmPwd} defaultValue={confirmPwd}/>}
      <Pressable className="bg-slate-400 rounded-full p-4 mb-30" onPress={handleCallDB}>
        <Text className="text-black">
          {mode == 'register' ? 'Register' : 'Login'}
        </Text>
      </Pressable>
      <Pressable className="rounded-full p-4 mt-40" onPress={() => {mode == 'register' ? setMode('login') : setMode('register')}}>
        <Text className="text-black">
          {mode == 'register' ? 'Or login' : "I don't have an account"}
        </Text>
      </Pressable>
    </View>
  );
}

import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";

export default function LoginScreen (){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    console.log("Sign in", { email, password });
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 py-12">
      <Link href='/' className="text-white" > HOME </Link>
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-semibold text-white mb-8">
          Welcome back
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm text-slate-300 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              className="h-12 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white"
            />
          </View>

          <View>
            <Text className="text-sm text-slate-300 mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              className="h-12 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white"
            />
          </View>
        </View>

        <Pressable
          onPress={handleSignIn}
          className="mt-8 h-12 items-center justify-center rounded-xl bg-indigo-500"
        >
          <Text className="text-base font-semibold text-white">Sign in</Text>
        </Pressable>
      </View>

      <View className="items-center">
        <Text className="text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 font-semibold">
            Create one
          </Link>
        </Text>
      </View>
    </View>
  );
};



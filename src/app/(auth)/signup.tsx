import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";

export default function SignUpScreen (){
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    console.log("Sign up", { fullName, email, password });
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 py-12">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-semibold text-white mb-8">
          Create account
        </Text>

        <View className="gap-4">
          <View>
            <Text className="text-sm text-slate-300 mb-1">Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              placeholder="Jane Doe"
              placeholderTextColor="#94a3b8"
              className="h-12 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white"
            />
          </View>

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
          onPress={handleSignUp}
          className="mt-8 h-12 items-center justify-center rounded-xl bg-indigo-500"
        >
          <Text className="text-base font-semibold text-white">Sign up</Text>
        </Pressable>
      </View>

      <View className="items-center">
        <Text className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 font-semibold">
            Sign in
          </Link>
        </Text>
      </View>
    </View>
  );
};


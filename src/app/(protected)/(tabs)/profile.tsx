import React from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/provider/AuthProvider";


export default function ProfileScreen() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out failed", error.message);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <Text className="text-lg text-slate-300">No profile available.</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-slate-950 px-6 py-12">
      <View className="mb-8 flex-row items-center justify-between">
        <Text className="text-3xl font-semibold text-white">Profile</Text>
        <Pressable
          onPress={handleSignOut}
          className="rounded-xl bg-indigo-500 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-white">Log out</Text>
        </Pressable>
      </View>

      <View className="items-center mb-10">
        <View className="h-24 w-24 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
          <Image
            source={{
              uri:
                user.user_metadata?.avatar_url ??
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user.email ?? user.id
                )}`,
            }}
            resizeMode="cover"
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <Text className="mt-4 text-xl font-semibold text-white">
          {user.user_metadata?.full_name ?? user.email ?? "Unknown User"}
        </Text>
        {user.user_metadata?.username ? (
          <Text className="text-sm text-slate-400">
            @{user.user_metadata.username}
          </Text>
        ) : null}
      </View>

      <View className="space-y-4">
        <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-xs uppercase tracking-wide text-slate-500">
            Email
          </Text>
          <Text className="mt-1 text-base text-white">
            {user.email ?? "Not provided"}
          </Text>
        </View>

        <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-xs uppercase tracking-wide text-slate-500">
            User ID
          </Text>
          <Text className="mt-1 text-base text-white">{user.id}</Text>
        </View>

        <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <Text className="text-xs uppercase tracking-wide text-slate-500">
            Account Created
          </Text>
          <Text className="mt-1 text-base text-white">
            {user.created_at
              ? new Date(user.created_at).toLocaleString()
              : "Unknown"}
          </Text>
        </View>
      </View>
    </View>
  );
}

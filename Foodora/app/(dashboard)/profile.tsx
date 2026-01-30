import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";
import { logoutUser } from "@/services/authService";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import * as Animatable from "react-native-animatable";

const Profile = () => {
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          showLoader();
          try {
            await logoutUser();
            router.replace("/login");
          } catch {
            Alert.alert("Error", "Logout failed");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    showLoader();
    try {
      if (user) {
        await updateProfile(user, { displayName: name });
        Alert.alert("Success", "Profile updated!");
      }
      setEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      hideLoader();
    }
  };

  const menuItems = [
    { icon: "history", label: "Order History", route: "/orders" },
    { icon: "favorite", label: "Favorites", route: null },
    { icon: "location-on", label: "Delivery Address", route: null },
    { icon: "payment", label: "Payment Methods", route: null },
    { icon: "notifications", label: "Notifications", route: null },
    { icon: "help", label: "Help & Support", route: null },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Animatable.View
        animation="fadeInDown"
        className="bg-purple-950 px-6 pt-16 pb-20 rounded-b-[60px]"
      >
        <View className="items-center">
          <View className="bg-white/30 p-5 rounded-full mb-4 border-2 border-white/40 shadow-xl">
            <MaterialIcons name="person" size={88} color="white" />
          </View>

          {editing ? (
            <View className="w-full px-4">
              <TextInput
                className="bg-white/40 text-white text-2xl font-bold text-center p-4 rounded-2xl mb-3 border border-white/50"
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="rgba(255,255,255,0.8)"
              />
              <Text className="text-white/90 text-center text-lg">{email}</Text>
            </View>
          ) : (
            <>
              <Text className="text-white text-4xl font-extrabold tracking-wide">
                {user?.displayName || "Welcome"}
              </Text>
              <Text className="text-white/90 mt-2 text-lg">{email}</Text>
            </>
          )}

          <TouchableOpacity
            className={`mt-6 px-10 py-4 rounded-full ${
              editing ? "bg-white" : "bg-white/30 border-2 border-white/40"
            }`}
            onPress={editing ? handleSave : () => setEditing(true)}
          >
            <Text
              className={`font-bold text-lg ${
                editing ? "text-indigo-700" : "text-white"
              }`}
            >
              {editing ? "Save Profile" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} className="px-5 -mt-14 mb-12">
        <View className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center px-6 py-6 border-b border-gray-100 last:border-b-0 active:bg-indigo-50/30"
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View className="bg-indigo-100 p-4 rounded-2xl mr-5">
                <MaterialIcons name={item.icon as any} size={30} color="#4F46E5" />
              </View>
              <Text className="flex-1 text-gray-900 font-semibold text-lg">
                {item.label}
              </Text>
              <MaterialIcons name="chevron-right" size={30} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="mt-10 bg-red-50 py-6 rounded-3xl items-center shadow-lg"
          onPress={handleLogout}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={30} color="#EF4444" />
            <Text className="text-red-700 font-bold text-lg ml-4">Logout</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
};

export default Profile;


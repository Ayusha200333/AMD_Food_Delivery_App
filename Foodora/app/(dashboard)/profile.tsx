import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable
} from "react-native"
import React, { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/useAuth"
import { useLoader } from "@/hooks/useLoader"
import { logoutUser } from "@/services/authService"
import { useRouter } from "expo-router"

const Profile = () => {
  const { user } = useAuth()
  const { showLoader, hideLoader } = useLoader()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await logoutUser()
              router.replace("/login")
            } catch (error) {
              Alert.alert("Error", "Failed to logout")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill all fields")
      return
    }
    // Here you would typically update the user profile in Firebase
    Alert.alert("Success", "Profile updated successfully")
    setEditing(false)
  }

  const menuItems = [
    { icon: "history", label: "Order History", onPress: () => router.push('/orders') },
    { icon: "favorite", label: "Favorites", onPress: () => Alert.alert("Coming Soon") },
    { icon: "location-on", label: "Delivery Address", onPress: () => Alert.alert("Coming Soon") },
    { icon: "payment", label: "Payment Methods", onPress: () => Alert.alert("Coming Soon") },
    { icon: "notifications", label: "Notifications", onPress: () => Alert.alert("Coming Soon") },
    { icon: "help", label: "Help & Support", onPress: () => Alert.alert("Coming Soon") },
  ]

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-12 pb-8">
        <View className="items-center">
          <View className="bg-white/20 p-4 rounded-full mb-4">
            <MaterialIcons name="person" size={60} color="white" />
          </View>
          {editing ? (
            <View className="w-full">
              <TextInput
                className="bg-white/20 text-white text-xl font-bold p-3 rounded-xl mb-2"
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
              <TextInput
                className="bg-white/20 text-white p-3 rounded-xl"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <>
              <Text className="text-white text-2xl font-bold">
                {user?.displayName || 'User'}
              </Text>
              <Text className="text-white/80 mt-1">
                {user?.email || 'user@example.com'}
              </Text>
            </>
          )}
          <TouchableOpacity
            className={`mt-4 px-6 py-2 rounded-full ${editing ? 'bg-white' : 'bg-white/20'}`}
            onPress={() => editing ? handleSave() : setEditing(true)}
          >
            <Text className={`font-medium ${editing ? 'text-indigo-600' : 'text-white'}`}>
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <View className="px-6 mt-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm"
            onPress={item.onPress}
          >
            <View className="bg-indigo-100 p-3 rounded-xl mr-4">
              <MaterialIcons name={item.icon as any} size={24} color="#4F46E5" />
            </View>
            <Text className="flex-1 text-gray-700 font-medium">{item.label}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Settings */}
        <View className="bg-white rounded-2xl p-4 mt-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Settings</Text>
          
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-gray-700">Dark Mode</Text>
            <MaterialIcons name="toggle-off" size={32} color="#9CA3AF" />
          </View>
          
          <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
            <Text className="text-gray-700">Language</Text>
            <Text className="text-gray-500">English</Text>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          className="mt-8 mb-10 bg-red-50 p-4 rounded-2xl items-center"
          onPress={handleLogout}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={24} color="#EF4444" />
            <Text className="text-red-600 font-bold ml-2">Logout</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Profile
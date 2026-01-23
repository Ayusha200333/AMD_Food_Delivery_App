import { View, Text, ActivityIndicator } from "react-native"
import React from "react"
import "./global.css"
import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"

const Index = () => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-indigo-50 to-white">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    )
  }

  if (user) {
    return <Redirect href="/home" />
  } else {
    return <Redirect href="/login" />
  }
}

export default Index
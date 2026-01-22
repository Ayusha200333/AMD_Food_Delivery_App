import { View, Text, ActivityIndicator } from "react-native"
import React from "react"
import "../global.css"
import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"

const Index = () => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4ade80" />
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
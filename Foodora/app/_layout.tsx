import { View, Text } from "react-native"
import React from "react"
import { Slot } from "expo-router"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { LoaderProvider } from "@/context/LoaderContext"
import { AuthProvider } from "@/context/AuthContext"
import "../global.css"

const RootLayout = () => {
  const insets = useSafeAreaInsets()

  return (
    <LoaderProvider>
      <AuthProvider>
        <View style={{ 
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: '#f9fafb'
        }}>
          <Slot />
        </View>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
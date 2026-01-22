import { View, Text } from "react-native"
import React from "react"
import { Slot, Stack } from "expo-router"

const FoodsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="form" />
      <Stack.Screen name="[id]" />
    </Stack>
  )
}

export default FoodsLayout
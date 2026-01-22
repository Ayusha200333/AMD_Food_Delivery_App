import { View, Text } from "react-native"
import React from "react"
import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

const tabs = [
  { name: "home", icon: "home", title: "Home" },
  { name: "foods", icon: "restaurant-menu", title: "Foods" },
  { name: "orders", icon: "shopping-cart", title: "Orders" },
  { name: "profile", icon: "person", title: "Profile" }
] as const

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            )
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout
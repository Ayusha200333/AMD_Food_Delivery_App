import { View, Text } from "react-native"
import React from "react"
import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/useAuth"

const tabs = [
  { name: "home", icon: "home", title: "Home" },
  { name: "foods", icon: "restaurant-menu", title: "Foods" },
  { name: "orders", icon: "shopping-cart", title: "Orders" },
  { name: "profile", icon: "person", title: "Profile" }
] as const

const DashboardLayout = () => {
  const { user } = useAuth()

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = tabs.find(tab => tab.name === route.name)?.icon || 'circle'
          return (
            <MaterialIcons 
              name={iconName as any} 
              size={size} 
              color={focused ? '#4F46E5' : color} 
            />
          )
        },
        tabBarLabel: ({ focused }) => {
          const tab = tabs.find(t => t.name === route.name)
          return (
            <Text 
              className={`text-xs mt-1 ${focused ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}
            >
              {tab?.title}
            </Text>
          )
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout
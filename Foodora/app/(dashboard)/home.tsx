import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert
} from "react-native"
import React, { useState, useCallback } from "react"
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { useAuth } from "@/hooks/useAuth"
import { getAllFoods } from "@/services/foodService"
import { getAllOrders } from "@/services/orderService"
import { Food } from "@/types/food"
import { Order } from "@/types/order"

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { showLoader, hideLoader } = useLoader()
  const [refreshing, setRefreshing] = useState(false)
  const [featuredFoods, setFeaturedFoods] = useState<Food[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  const loadData = async () => {
    showLoader()
    try {
      const [foods, orders] = await Promise.all([
        getAllFoods(),
        getAllOrders()
      ])
      setFeaturedFoods(foods.slice(0, 3))
      setRecentOrders(orders.slice(0, 2))
    } catch (error) {
      Alert.alert("Error", "Failed to load data")
    } finally {
      hideLoader()
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadData().finally(() => setRefreshing(false))
  }, [])

  React.useEffect(() => {
    loadData()
  }, [])

  const stats = [
    { icon: 'restaurant', label: 'Total Foods', value: featuredFoods.length, color: '#10B981' },
    { icon: 'shopping-cart', label: 'Total Orders', value: recentOrders.length, color: '#3B82F6' },
    { icon: 'star', label: 'Rating', value: '4.8', color: '#F59E0B' },
  ]

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-12 pb-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-sm">Good morning</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {user?.displayName || 'Food Lover'} 👋
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <MaterialIcons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View className="px-6 -mt-6">
        <View className="flex-row justify-between bg-white rounded-2xl p-6 shadow-lg">
          {stats.map((stat, index) => (
            <View key={index} className="items-center">
              <View 
                className="p-3 rounded-full mb-2"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text className="text-2xl font-bold text-gray-800">{stat.value}</Text>
              <Text className="text-gray-500 text-sm">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="flex-1 bg-white p-4 rounded-2xl mr-2 items-center shadow-md"
            onPress={() => router.push('/foods/form')}
          >
            <View className="bg-green-100 p-3 rounded-full mb-2">
              <MaterialIcons name="add-circle" size={28} color="#10B981" />
            </View>
            <Text className="font-medium text-gray-700">Add Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 bg-white p-4 rounded-2xl ml-2 items-center shadow-md"
            onPress={() => router.push('/orders/form')}
          >
            <View className="bg-blue-100 p-3 rounded-full mb-2">
              <MaterialIcons name="add-shopping-cart" size={28} color="#3B82F6" />
            </View>
            <Text className="font-medium text-gray-700">New Order</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Foods */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Featured Foods</Text>
          <TouchableOpacity onPress={() => router.push('/foods')}>
            <Text className="text-indigo-600 font-medium">See all</Text>
          </TouchableOpacity>
        </View>
        
        {featuredFoods.length > 0 ? (
          featuredFoods.map((food) => (
            <TouchableOpacity 
              key={food.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-md"
              onPress={() => router.push(`/foods/${food.id}`)}
            >
              <View className="flex-row">
                <View className="bg-gray-100 w-16 h-16 rounded-xl items-center justify-center mr-4">
                  <MaterialIcons name="restaurant" size={32} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">{food.name}</Text>
                  <Text className="text-gray-500 mb-2" numberOfLines={2}>{food.description}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-indigo-600">${food.price}</Text>
                    <Text className="text-gray-500">{food.category}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center">
            <MaterialIcons name="fastfood" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 mt-2">No foods added yet</Text>
          </View>
        )}
      </View>

      {/* Recent Orders */}
      <View className="px-6 mt-8 mb-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push('/orders')}>
            <Text className="text-indigo-600 font-medium">See all</Text>
          </TouchableOpacity>
        </View>
        
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <TouchableOpacity 
              key={order.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-md"
              onPress={() => router.push(`/orders/${order.id}`)}
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    Order #{order.id.slice(0, 8)}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    Items: {order.items.length}
                  </Text>
                  <Text className="text-gray-500">
                    Total: ${order.total}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${order.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <Text className={`font-medium ${order.isDelivered ? 'text-green-800' : 'text-yellow-800'}`}>
                    {order.isDelivered ? 'Delivered' : 'Pending'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center">
            <MaterialIcons name="receipt" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 mt-2">No orders yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default Home
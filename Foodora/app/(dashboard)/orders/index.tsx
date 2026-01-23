import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import {
  getAllOrders,
  getAllOrdersByStatus,
  completeOrder,
  deleteOrder
} from "@/services/orderService"
import { Order } from "@/types/order"

type Status = "All" | "Delivered" | "Pending"

const Orders = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeStatus, setActiveStatus] = useState<Status>("All")

  const fetchOrders = async (status: Status = "All") => {
    showLoader()
    try {
      let data: Order[] = []
      if (status === "All") data = await getAllOrders()
      else data = await getAllOrdersByStatus(status === "Delivered")
      setOrders(data)
    } catch {
      Alert.alert("Error", "Error fetching orders")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders(activeStatus)
    }, [activeStatus])
  )

  const handleComplete = async (id: string, currentStatus: boolean) => {
    showLoader()
    try {
      await completeOrder(id, !currentStatus)
      fetchOrders(activeStatus)
    } catch {
      Alert.alert("Error", "Could not update order")
    } finally {
      hideLoader()
    }
  }

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteOrder(id)
              fetchOrders(activeStatus)
            } catch {
              Alert.alert("Error", "Could not delete order")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  const handleEdit = (id: string) => {
    router.push({ pathname: "/orders/form", params: { orderId: id } })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const statusOptions: Status[] = ["All", "Pending", "Delivered"]

  return (
    <View className="flex-1 bg-gray-50">
      {/* Status Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 bg-white border-b border-gray-200"
      >
        {statusOptions.map((stat) => (
          <TouchableOpacity 
            key={stat} 
            onPress={() => setActiveStatus(stat)}
            className="mr-3"
          >
            <View className={`px-4 py-2 rounded-full ${activeStatus === stat ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Text className={`font-medium ${activeStatus === stat ? 'text-indigo-600' : 'text-gray-600'}`}>
                {stat}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-xl absolute bottom-6 right-6 p-4 z-50"
        onPress={() => router.push("/orders/form")}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {orders.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <MaterialIcons name="receipt" size={80} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">No orders found</Text>
            <Text className="text-gray-400 mt-2">Create your first order!</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-md"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-bold text-gray-800">
                    Order #{order.id.slice(0, 8)}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {formatDate(order.placedAt)}
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => handleComplete(order.id, order.isDelivered)}
                  className={`p-2 rounded-full ${order.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}
                >
                  <MaterialIcons
                    name={order.isDelivered ? "check-circle" : "schedule"}
                    size={24}
                    color={order.isDelivered ? "#10B981" : "#F59E0B"}
                  />
                </TouchableOpacity>
              </View>

              {/* Items */}
              <View className="mb-4">
                <Text className="text-gray-600 font-medium mb-2">Items:</Text>
                <View className="bg-gray-50 rounded-xl p-3">
                  {order.items.map((item, index) => (
                    <View key={index} className="flex-row items-center mb-2 last:mb-0">
                      <MaterialIcons name="circle" size={8} color="#6B7280" />
                      <Text className="text-gray-700 ml-2">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-indigo-600">
                  ${order.total}
                </Text>
                
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: "/orders/[id]", params: { id: order.id } })}
                    className="p-2 rounded-lg bg-blue-50 mr-2"
                  >
                    <MaterialIcons name="visibility" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleEdit(order.id)}
                    className="p-2 rounded-lg bg-yellow-50 mr-2"
                  >
                    <MaterialIcons name="edit" size={20} color="#F59E0B" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDelete(order.id)}
                    className="p-2 rounded-lg bg-red-50"
                  >
                    <MaterialIcons name="delete" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Status Badge */}
              <View className={`mt-3 px-3 py-1 rounded-full self-start ${order.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Text className={`font-medium ${order.isDelivered ? 'text-green-800' : 'text-yellow-800'}`}>
                  {order.isDelivered ? '✓ Delivered' : '⏳ Pending'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Orders
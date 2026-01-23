import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getOrderById, deleteOrder, completeOrder } from "@/services/orderService"
import { Order } from "@/types/order"

const OrderDetails = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { showLoader, hideLoader } = useLoader()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (id) {
      showLoader()
      getOrderById(id)
        .then(setOrder)
        .catch(() => Alert.alert("Error", "Failed to load order details"))
        .finally(() => hideLoader())
    }
  }, [id])

  const handleDelete = async () => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteOrder(id!)
              Alert.alert("Success", "Order deleted successfully")
              router.back()
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

  const handleToggleStatus = async () => {
    if (!order) return
    showLoader()
    try {
      await completeOrder(id!, !order.isDelivered)
      setOrder({ ...order, isDelivered: !order.isDelivered })
      Alert.alert("Success", `Order marked as ${!order.isDelivered ? 'Delivered' : 'Pending'}`)
    } catch {
      Alert.alert("Error", "Could not update order status")
    } finally {
      hideLoader()
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Order Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Order Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          {/* Order Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Order #{order.id.slice(0, 8)}
              </Text>
              <Text className="text-gray-500">{formatDate(order.placedAt)}</Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleStatus}
              className={`px-4 py-2 rounded-full ${order.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}
            >
              <Text className={`font-bold ${order.isDelivered ? 'text-green-800' : 'text-yellow-800'}`}>
                {order.isDelivered ? 'DELIVERED' : 'PENDING'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-4">Order Items</Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              {order.items.map((item, index) => (
                <View key={index} className="flex-row items-center py-3 border-b border-gray-200 last:border-0">
                  <MaterialIcons name="restaurant" size={20} color="#6B7280" />
                  <Text className="flex-1 text-gray-800 ml-3 text-lg">{item}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              ))}
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-4">Order Summary</Text>
            
            <View className="flex-row justify-between py-3 border-b border-indigo-100">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-800 font-medium">${order.total}</Text>
            </View>
            
            <View className="flex-row justify-between py-3 border-b border-indigo-100">
              <Text className="text-gray-600">Delivery Fee</Text>
              <Text className="text-gray-800 font-medium">$2.99</Text>
            </View>
            
            <View className="flex-row justify-between py-3">
              <Text className="text-gray-800 font-bold text-lg">Total</Text>
              <Text className="text-indigo-600 font-bold text-2xl">
                ${(order.total + 2.99).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Order Timeline */}
          <View className="mb-8">
            <Text className="text-gray-700 text-lg font-semibold mb-4">Order Timeline</Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3"></View>
                <Text className="text-gray-800">Order placed</Text>
                <Text className="text-gray-500 ml-auto">{formatDate(order.placedAt)}</Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${order.isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}></View>
                <Text className={`${order.isDelivered ? 'text-gray-800' : 'text-gray-400'}`}>Order delivered</Text>
                <Text className="text-gray-500 ml-auto">
                  {order.isDelivered ? formatDate(order.placedAt) : 'In progress'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row mb-10">
          <TouchableOpacity
            className="flex-1 bg-indigo-600 p-4 rounded-2xl mr-2 items-center"
            onPress={() => router.push({ pathname: "/orders/form", params: { orderId: id } })}
          >
            <MaterialIcons name="edit" size={24} color="white" />
            <Text className="text-white font-medium mt-1">Edit Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-red-600 p-4 rounded-2xl ml-2 items-center"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text className="text-white font-medium mt-1">Delete Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetails
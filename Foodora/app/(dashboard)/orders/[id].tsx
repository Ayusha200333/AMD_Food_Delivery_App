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
        <Text className="text-gray-500 text-lg">Loading order details...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-purple-950 px-6 pt-14 pb-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">Order Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        <View className="bg-white rounded-3xl p-6 shadow-xl mb-6 border border-gray-100">
          <View className="flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(0, 8)}
              </Text>
              <Text className="text-gray-600 mt-1">
                {formatDate(order.placedAt)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleStatus}
              className={`px-5 py-2 rounded-full ${
                order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              <Text className="font-bold">
                {order.isDelivered ? 'DELIVERED' : 'PENDING'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Order Items</Text>
            <View className="bg-gray-50 rounded-2xl p-5 divide-y divide-gray-200">
              {order.items.map((item, index) => {
                const itemName = typeof item === 'string' ? item : (item as any).name || 'Unknown Item';
                const quantity = typeof item === 'string' ? 1 : (item as any).quantity || 1;
                const price = typeof item === 'string' ? 0 : (item as any).price || 0;

                return (
                  <View 
                    key={index}
                    className="flex-row items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <View className="flex-row items-center flex-1">
                      <MaterialIcons name="restaurant" size={24} color="#6B7280" />
                      <Text className="flex-1 text-gray-800 ml-4 text-base font-medium">
                        {itemName} × {quantity}
                      </Text>
                    </View>
                    <Text className="text-indigo-600 font-semibold">
                      ${(price * quantity).toFixed(2)}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>

          <View className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Order Summary</Text>
            
            <View className="flex-row justify-between py-3 border-b border-indigo-100">
              <Text className="text-gray-700">Subtotal</Text>
              <Text className="text-gray-900 font-medium">${order.total.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between py-3 border-b border-indigo-100">
              <Text className="text-gray-700">Delivery Fee</Text>
              <Text className="text-gray-900 font-medium">$2.99</Text>
            </View>
            
            <View className="flex-row justify-between py-4 mt-2">
              <Text className="text-gray-900 font-bold text-xl">Grand Total</Text>
              <Text className="text-indigo-700 text-2xl font-extrabold">
                ${(order.total + 2.99).toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Order Timeline</Text>
            <View className="space-y-5">
              <View className="flex-row items-center">
                <View className="w-4 h-4 bg-green-500 rounded-full mr-4"></View>
                <Text className="text-gray-800 flex-1">Order placed</Text>
                <Text className="text-gray-600">{formatDate(order.placedAt)}</Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full mr-4 ${order.isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}></View>
                <Text className={`${order.isDelivered ? 'text-gray-800' : 'text-gray-500'}`}>Order delivered</Text>
                <Text className="text-gray-600 ml-auto">
                  {order.isDelivered ? formatDate(order.placedAt) : 'In progress'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row space-x-4 mb-12">
          <TouchableOpacity
            className="flex-1 bg-indigo-600 py-5 rounded-2xl items-center shadow-md active:scale-95"
            onPress={() => router.push({ pathname: "/orders/form", params: { orderId: id } })}
          >
            <MaterialIcons name="edit" size={28} color="white" />
            <Text className="text-white font-medium mt-2">Edit Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-red-600 py-5 rounded-2xl items-center shadow-md active:scale-95"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={28} color="white" />
            <Text className="text-white font-medium mt-2">Delete Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetails
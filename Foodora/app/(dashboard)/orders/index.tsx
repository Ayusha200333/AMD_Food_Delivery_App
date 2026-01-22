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

  const formatDate = (dateStr: string | number | Date) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-around py-3 bg-white border-b border-gray-200">
        {(["All", "Delivered", "Pending"] as Status[]).map((stat) => (
          <TouchableOpacity key={stat} onPress={() => setActiveStatus(stat)}>
            <Text
              className={`text-lg font-semibold ${
                activeStatus === stat ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {stat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-blue-600/80 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-2 z-50"
        onPress={() => router.push("/orders/form")}
      >
        <MaterialIcons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {orders.length === 0 ? (
          <Text className="text-gray-600 text-center mt-10">
            No orders found.
          </Text>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white p-4 rounded-2xl mb-4 border border-gray-300 shadow-md"
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/orders/[id]",
                    params: { id: order.id }
                  })
                }
                className="flex-row justify-between items-center mb-2"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-800 text-lg font-semibold mb-1">
                    Order #{order.id}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    Items: {order.items.length} - Total: ${order.total}
                  </Text>
                  <Text
                    className={`font-medium ${
                      order.isDelivered ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation()
                    handleComplete(order.id, order.isDelivered)
                  }}
                  className={`p-2 rounded-full ${
                    order.isDelivered ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <MaterialIcons
                    name={
                      order.isDelivered
                        ? "check-circle"
                        : "radio-button-unchecked"
                    }
                    size={28}
                    color={order.isDelivered ? "#16A34A" : "#6B7280"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <View className="flex-row justify-between items-end">
                <Text className="text-gray-500 text-sm mb-1">
                  Placed: {order.placedAt ? formatDate(order.placedAt) : "-"}
                </Text>
                <View className="flex-row justify-end mt-2 space-x-3">
                  <TouchableOpacity
                    onPress={() => handleEdit(order.id)}
                    className="p-2 rounded-full bg-yellow-500"
                  >
                    <MaterialIcons name="edit" size={28} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(order.id)}
                    className="p-2 ms-2 rounded-full bg-red-500"
                  >
                    <MaterialIcons name="delete" size={28} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Orders
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import { addOrder, getOrderById, updateOrder } from "@/services/orderService"
import { Order } from "@/types/order"

const OrderForm = () => {
  const router = useRouter()
  const { orderId } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [items, setItems] = useState("") // e.g., "Pizza, Burger"
  const [total, setTotal] = useState("")

  useEffect(() => {
    if (orderId) {
      showLoader()
      getOrderById(orderId as string)
        .then((order: Order) => {
          setItems(order.items.join(", "))
          setTotal(order.total.toString())
        })
        .catch(() => Alert.alert("Error", "Failed to load order"))
        .finally(() => hideLoader())
    }
  }, [orderId])

  const handleSubmit = async () => {
    if (isLoading) return
    if (!items.trim() || !total) {
      Alert.alert("Error", "Please fill all fields")
      return
    }

    showLoader()
    try {
      const itemArray = items.split(",").map(item => item.trim())
      if (orderId) {
        await updateOrder(orderId as string, itemArray, parseFloat(total))
        Alert.alert("Success", "Order updated successfully")
      } else {
        await addOrder(itemArray, parseFloat(total))
        Alert.alert("Success", "Order placed successfully")
      }
      router.back()
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong")
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
        <Text className="text-gray-800 font-medium ml-1">Back</Text>
      </TouchableOpacity>

      <View className="p-6 rounded-2xl bg-white border border-gray-300 shadow-md">
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Items (comma separated)
        </Text>
        <TextInput
          placeholder="Enter items, e.g., Pizza, Burger"
          placeholderTextColor="#999"
          value={items}
          onChangeText={setItems}
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Total Price
        </Text>
        <TextInput
          placeholder="Enter total price"
          placeholderTextColor="#999"
          value={total}
          onChangeText={setTotal}
          keyboardType="numeric"
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        <Pressable
          className={`px-6 py-3 rounded-2xl ${
            orderId ? "bg-blue-600/80" : "bg-green-600/80"
          }`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {isLoading ? "Please wait..." : orderId ? "Update Order" : "Place Order"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default OrderForm
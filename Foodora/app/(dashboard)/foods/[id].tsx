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
import { getFoodById, deleteFood } from "@/services/foodService"
import { Food } from "@/types/food"

const FoodDetails = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { showLoader, hideLoader } = useLoader()
  const [food, setFood] = useState<Food | null>(null)

  useEffect(() => {
    if (id) {
      showLoader()
      getFoodById(id)
        .then(setFood)
        .catch(() => Alert.alert("Error", "Failed to load food details"))
        .finally(() => hideLoader())
    }
  }, [id])

  const handleDelete = async () => {
    Alert.alert(
      "Delete Food",
      "Are you sure you want to delete this food item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteFood(id!)
              Alert.alert("Success", "Food deleted successfully")
              router.back()
            } catch {
              Alert.alert("Error", "Could not delete food")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pizza": return "#EF4444"
      case "Burger": return "#F59E0B"
      case "Dessert": return "#EC4899"
      case "Sushi": return "#10B981"
      case "Pasta": return "#8B5CF6"
      default: return "#6B7280"
    }
  }

  if (!food) {
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
          <Text className="text-2xl font-bold text-white">Food Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Food Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <View className="items-center mb-6">
            <View className="w-32 h-32 bg-gray-100 rounded-2xl items-center justify-center mb-4">
              <MaterialIcons 
                name="restaurant" 
                size={64} 
                color={getCategoryColor(food.category)} 
              />
            </View>
            <Text className="text-3xl font-bold text-gray-800">{food.name}</Text>
            <View className="px-4 py-1 rounded-full mt-2" style={{ backgroundColor: `${getCategoryColor(food.category)}20` }}>
              <Text className="font-medium" style={{ color: getCategoryColor(food.category) }}>
                {food.category}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl mb-6">
            <Text className="text-gray-500 text-sm mb-1">Price</Text>
            <Text className="text-4xl font-bold text-indigo-600">${food.price}</Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">Description</Text>
            <Text className="text-gray-600 text-base leading-relaxed bg-gray-50 p-4 rounded-xl">
              {food.description}
            </Text>
          </View>

          {/* Details */}
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between py-3 border-b border-gray-200">
              <Text className="text-gray-600">Added Date</Text>
              <Text className="text-gray-800 font-medium">
                {new Date(food.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between py-3">
              <Text className="text-gray-600">Status</Text>
              <View className="px-3 py-1 rounded-full bg-green-100">
                <Text className="text-green-800 font-medium">Available</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row mb-10">
          <TouchableOpacity
            className="flex-1 bg-indigo-600 p-4 rounded-2xl mr-2 items-center"
            onPress={() => router.push({ pathname: "/foods/form", params: { foodId: id } })}
          >
            <MaterialIcons name="edit" size={24} color="white" />
            <Text className="text-white font-medium mt-1">Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-red-600 p-4 rounded-2xl ml-2 items-center"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text className="text-white font-medium mt-1">Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Create Order Button */}
        <TouchableOpacity
          className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl mb-10 items-center"
          onPress={() => router.push({ pathname: "/orders/form", params: { foodName: food.name } })}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="add-shopping-cart" size={24} color="white" />
            <Text className="text-white text-lg font-bold ml-2">Create Order</Text>
          </View>
          <Text className="text-white/80 text-sm mt-1">Order this food item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default FoodDetails
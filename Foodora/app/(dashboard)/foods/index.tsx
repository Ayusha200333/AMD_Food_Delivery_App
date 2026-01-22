import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import {
  getAllFoods,
  getAllFoodsByCategory,
  deleteFood
} from "@/services/foodService"
import { Food } from "@/types/food"

type Category = "All" | "Pizza" | "Burger" | "Dessert" // Example categories

const Foods = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [foods, setFoods] = useState<Food[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>("All")

  const fetchFoods = async (category: Category = "All") => {
    showLoader()
    try {
      let data: Food[] = []
      if (category === "All") data = await getAllFoods()
      else data = await getAllFoodsByCategory(category)
      setFoods(data)
    } catch {
      Alert.alert("Error", "Error fetching foods")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchFoods(activeCategory)
    }, [activeCategory])
  )

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this food item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteFood(id)
              fetchFoods(activeCategory)
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

  const handleEdit = (id: string) => {
    router.push({ pathname: "/foods/form", params: { foodId: id } })
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-around py-3 bg-white border-b border-gray-200">
        {(["All", "Pizza", "Burger", "Dessert"] as Category[]).map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)}>
            <Text
              className={`text-lg font-semibold ${
                activeCategory === cat ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-blue-600/80 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-2 z-50"
        onPress={() => router.push("/foods/form")}
      >
        <MaterialIcons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {foods.length === 0 ? (
          <Text className="text-gray-600 text-center mt-10">
            No foods found.
          </Text>
        ) : (
          foods.map((food) => (
            <View
              key={food.id}
              className="bg-white p-4 rounded-2xl mb-4 border border-gray-300 shadow-md"
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/foods/[id]",
                    params: { id: food.id }
                  })
                }
                className="flex-row justify-between items-center mb-2"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-800 text-lg font-semibold mb-1">
                    {food.name}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    ${food.price} - {food.category}
                  </Text>
                  <Text className="text-gray-600">
                    {food.description.length > 30
                      ? `${food.description.substring(0, 30)}...`
                      : food.description}
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="flex-row justify-end mt-2 space-x-3">
                <TouchableOpacity
                  onPress={() => handleEdit(food.id)}
                  className="p-2 rounded-full bg-yellow-500"
                >
                  <MaterialIcons name="edit" size={28} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(food.id)}
                  className="p-2 ms-2 rounded-full bg-red-500"
                >
                  <MaterialIcons name="delete" size={28} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Foods
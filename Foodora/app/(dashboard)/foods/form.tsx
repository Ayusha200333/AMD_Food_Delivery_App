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
import { addFood, getFoodById, updateFood } from "@/services/foodService"
import { Food } from "@/types/food"

const FoodForm = () => {
  const router = useRouter()
  const { foodId } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (foodId) {
      showLoader()
      getFoodById(foodId as string)
        .then((food: Food) => {
          setName(food.name)
          setDescription(food.description || "")
          setPrice(food.price.toString())
          setCategory(food.category || "")
        })
        .catch(() => Alert.alert("Error", "Failed to load food"))
        .finally(() => hideLoader())
    }
  }, [foodId])

  const handleSubmit = async () => {
    if (isLoading) return
    if (!name.trim() || !description.trim() || !price || !category) {
      Alert.alert("Error", "Please fill all fields")
      return
    }

    showLoader()
    try {
      if (foodId) {
        await updateFood(foodId as string, name, description, parseFloat(price), category)
        Alert.alert("Success", "Food updated successfully")
      } else {
        await addFood(name, description, parseFloat(price), category)
        Alert.alert("Success", "Food added successfully")
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
          Food Name
        </Text>
        <TextInput
          placeholder="Enter food name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Description
        </Text>
        <TextInput
          placeholder="Enter description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          className="mb-6 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium h-32"
        />

        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Price
        </Text>
        <TextInput
          placeholder="Enter price"
          placeholderTextColor="#999"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Category
        </Text>
        <TextInput
          placeholder="Enter category (e.g., Pizza)"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        <Pressable
          className={`px-6 py-3 rounded-2xl ${
            foodId ? "bg-blue-600/80" : "bg-green-600/80"
          }`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {isLoading ? "Please wait..." : foodId ? "Update Food" : "Add Food"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default FoodForm
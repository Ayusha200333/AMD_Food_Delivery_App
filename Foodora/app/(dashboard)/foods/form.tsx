import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  Image,
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import { addFood, getFoodById, updateFood } from "@/services/foodService"
import { Food } from "@/types/food"
import * as ImagePicker from "expo-image-picker"
import { uploadImage } from "@/services/foodService"
import { useAuth } from "@/hooks/useAuth"

const OWNER_UID = "SH1T8LweRNeST1qVxJzEYLtWFUy1"; 

const FoodForm = () => {
  const router = useRouter()
  const { foodId } = useLocalSearchParams<{ foodId: string }>()
  const { showLoader, hideLoader, isLoading } = useLoader()
  const { user } = useAuth(); 

  //only owner can add/edit food items
  useEffect(() => {
    if (user && user.uid !== OWNER_UID) {
      Alert.alert("Access Denied", "Only owner can add or edit food items.");
      router.back();
    }
  }, [user, router]);

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const categories = ["Pizza", "Burger", "Dessert", "Sushi", "Pasta", "Salad", "Drinks"]

  useEffect(() => {
    if (foodId) {
      showLoader()
      getFoodById(foodId)
        .then((food: Food) => {
          setName(food.name)
          setDescription(food.description || "")
          setPrice(food.price.toString())
          setCategory(food.category || "")
          setImageUrl(food.imageUrl)
        })
        .catch(() => Alert.alert("Error", "Failed to load food"))
        .finally(() => hideLoader())
    }
  }, [foodId])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need permission to access your gallery")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!name.trim() || !description.trim() || !price || !category) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    showLoader();
    try {
      let uploadedImageUrl = imageUrl;

      if (image) {
        uploadedImageUrl = await uploadImage(image);
      }

      if (foodId) {
        await updateFood(foodId, name, description, priceNum, category, uploadedImageUrl);
        Alert.alert("Success", "Food updated successfully");
      } else {
        await addFood(name, description, priceNum, category, uploadedImageUrl);
        Alert.alert("Success", "Food added successfully");
      }

      router.back();
    } catch (err: any) {
      console.error("Submit error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={28} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">
          {foodId ? "Edit Food" : "Add New Food"}
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Food Image
            </Text>
            <TouchableOpacity onPress={pickImage} className="bg-gray-50 p-4 rounded-xl border border-gray-200 items-center">
              {image || imageUrl ? (
                <Image source={{ uri: image || imageUrl }} className="w-32 h-32 rounded-xl" resizeMode="cover" />
              ) : (
                <MaterialIcons name="add-photo-alternate" size={48} color="#9CA3AF" />
              )}
              <Text className="mt-2 text-gray-600">Tap to select image</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Food Name *
            </Text>
            <TextInput
              placeholder="e.g., Margherita Pizza"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              className="p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 text-base"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Description *
            </Text>
            <TextInput
              placeholder="Describe your food item..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              className="p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 text-base h-32"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Price *
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-500 mr-2 text-lg">$</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                className="flex-1 p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 text-base"
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Category *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`mr-3 px-4 py-3 rounded-full ${category === cat ? 'bg-indigo-100 border-2 border-indigo-200' : 'bg-gray-100'}`}
                >
                  <Text className={`font-medium ${category === cat ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {category && (
              <Text className="text-green-600 mt-2 font-medium">
                Selected: {category}
              </Text>
            )}
          </View>

          <Pressable
            className={`px-6 py-4 rounded-2xl ${isLoading ? 'opacity-70' : ''}`}
            style={{ backgroundColor: foodId ? '#3B82F6' : '#10B981' }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {isLoading ? "Please wait..." : foodId ? "Update Food" : "Add Food"}
            </Text>
          </Pressable>

          <TouchableOpacity 
            className="mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-center font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default FoodForm;
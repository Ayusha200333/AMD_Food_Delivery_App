import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { getFoodById, deleteFood } from "@/services/foodService";
import { Food } from "@/types/food";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

const OWNER_UID = "SH1T8LweRNeST1qVxJzEYLtWFUy1"; 

const FoodDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showLoader, hideLoader } = useLoader();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [food, setFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      showLoader();
      getFoodById(id)
        .then(setFood)
        .catch(() => Alert.alert("Error", "Failed to load food details"))
        .finally(() => hideLoader());
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert("Delete Food", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          showLoader();
          try {
            await deleteFood(id!);
            Alert.alert("Success", "Food deleted");
            router.back();
          } catch {
            Alert.alert("Error", "Could not delete food");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  const handleAddToCart = () => {
    if (!food) return;
    addToCart({
      foodId: food.id,
      name: food.name,
      price: food.price,
      quantity,
      imageUrl: food.imageUrl,
    });
    Alert.alert("Added", `${quantity} × ${food.name} added to cart!`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pizza": return "#EF4444";
      case "Burger": return "#F59E0B";
      case "Dessert": return "#EC4899";
      case "Sushi": return "#10B981";
      case "Pasta": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  if (!food) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  const isOwner = food.userId === OWNER_UID;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-purple-950 px-6 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Food Details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <View className="items-center mb-6">
            <View className="w-40 h-40 rounded-2xl overflow-hidden mb-4">
              {food.imageUrl ? (
                <Image source={{ uri: food.imageUrl }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="bg-gray-100 w-full h-full items-center justify-center">
                  <MaterialIcons name="restaurant" size={80} color={getCategoryColor(food.category)} />
                </View>
              )}
            </View>
            <Text className="text-4xl font-bold text-gray-900">{food.name}</Text>
            <View className="px-5 py-2 rounded-full mt-3" style={{ backgroundColor: `${getCategoryColor(food.category)}20` }}>
              <Text className="font-semibold" style={{ color: getCategoryColor(food.category) }}>
                {food.category}
              </Text>
            </View>
          </View>

          <View className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl mb-6">
            <Text className="text-gray-600 text-base mb-1">Price</Text>
            <Text className="text-5xl font-extrabold text-indigo-700">${food.price.toFixed(2)}</Text>
          </View>

          <View className="mb-8">
            <Text className="text-gray-800 text-xl font-semibold mb-3">Description</Text>
            <Text className="text-gray-700 text-base leading-relaxed bg-gray-50 p-5 rounded-2xl">
              {food.description || "No description available."}
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-gray-800 text-xl font-semibold mb-3">Quantity</Text>
            <View className="flex-row items-center justify-center bg-gray-100 rounded-full p-3">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-4"
              >
                <MaterialIcons name="remove" size={28} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold mx-8 text-gray-900">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                className="p-4"
              >
                <MaterialIcons name="add" size={28} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          </View>

          {isOwner && (
            <View className="flex-row mb-6">
              <TouchableOpacity
                className="flex-1 bg-indigo-600 p-5 rounded-2xl mr-3 items-center shadow-md active:scale-95"
                onPress={() => router.push({ pathname: "/foods/form", params: { foodId: id } })}
              >
                <MaterialIcons name="edit" size={28} color="white" />
                <Text className="text-white font-semibold mt-2">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-600 p-5 rounded-2xl items-center shadow-md active:scale-95"
                onPress={handleDelete}
              >
                <MaterialIcons name="delete" size={28} color="white" />
                <Text className="text-white font-semibold mt-2 ">Delete</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            className="bg-green-600 p-6 rounded-3xl items-center shadow-xl active:scale-95"
            onPress={handleAddToCart}
          >
            <View className="flex-row items-center">
              <MaterialIcons name="add-shopping-cart" size={32} color="white" />
              <Text className="text-white text-2xl font-bold ml-4">
                Add to Cart • ${(food.price * quantity).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FoodDetails;
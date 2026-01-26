import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { useAuth } from "@/hooks/useAuth";
import { deleteFood } from "@/services/foodService";
import { Food } from "@/types/food";
import { onSnapshot, query, where, orderBy } from "firebase/firestore";
import { foodsCollection } from "@/services/foodService";

type Category = "All" | "Pizza" | "Burger" | "Dessert" | "Sushi" | "Pasta" | "Salad" | "Drinks";

const OWNER_UID = "SH1T8LweRNeST1qVxJzEYLtWFUy1"; 

const Foods = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [foods, setFoods] = useState<Food[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const isOwner = user?.uid === OWNER_UID;

  useEffect(() => {
    if (!user) return;

    let q = query(foodsCollection, orderBy('createdAt', 'desc'));
    if (activeCategory !== "All") {
      q = query(q, where('category', '==', activeCategory));
    }

    showLoader();
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Food));
      setFoods(data);
      hideLoader();
    }, (error) => {
      Alert.alert("Error", error.message);
      hideLoader();
    });

    return unsubscribe;
  }, [user, activeCategory]);

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
            showLoader();
            try {
              await deleteFood(id);
            } catch {
              Alert.alert("Error", "Could not delete food");
            } finally {
              hideLoader();
            }
          }
        }
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/foods/form", params: { foodId: id } });
  };

  const categories: Category[] = ["All", "Pizza", "Burger", "Dessert", "Sushi", "Pasta" , "Salad", "Drinks"];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pizza": return "#EF4444";
      case "Burger": return "#F59E0B";
      case "Dessert": return "#EC4899";
      case "Sushi": return "#10B981";
      case "Pasta": return "#8B5CF6";
      case "Salad": return "#10B981";
      case "Drinks": return "#0EA5E9";
      default: return "#6B7280";
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 bg-white border-b border-gray-200 "
      >
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat} 
            onPress={() => setActiveCategory(cat)}
            className="mr-3"
          >
            <View className={`px-4 py-2 rounded-full ${activeCategory === cat ? 'bg-indigo-100' : 'bg-gray-100'}`}>
              <Text className={`font-medium ${activeCategory === cat ? 'text-indigo-600' : 'text-gray-600'}`}>
                {cat}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button - Only owner can see this */}
      {isOwner && (
        <TouchableOpacity
          className="bg-purple-600 rounded-full shadow-xl absolute bottom-6 right-6 p-4 z-50"
          onPress={() => router.push("/foods/form")}
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 120,
        }}
      >
        {foods.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <MaterialIcons name="fastfood" size={80} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">No foods found</Text>
            <Text className="text-gray-400 mt-2">Add your first food item!</Text>
          </View>
        ) : (
          foods.map((food) => (
            <View
              key={food.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-md"
            >
              <View className="flex-row">
                <View className="w-20 h-20 rounded-xl overflow-hidden mr-4">
                  {food.imageUrl ? (
                    <Image source={{ uri: food.imageUrl }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <View className="bg-gray-100 w-full h-full items-center justify-center">
                      <MaterialIcons name="restaurant" size={32} color={getCategoryColor(food.category)} />
                    </View>
                  )}
                </View>
                
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{food.name}</Text>
                    <Text className="text-xl font-bold text-indigo-600">${food.price}</Text>
                  </View>
                  
                  <Text className="text-gray-500 text-sm mb-2">{food.category}</Text>
                  <Text className="text-gray-600 mb-3" numberOfLines={2}>
                    {food.description}
                  </Text>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-400 text-sm">
                      Added: {new Date(food.createdAt).toLocaleDateString()}
                    </Text>
                    
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => router.push({ pathname: "/foods/[id]", params: { id: food.id } })}
                        className="p-2 rounded-lg bg-blue-50 mr-2"
                      >
                        <MaterialIcons name="visibility" size={20} color="#3B82F6" />
                      </TouchableOpacity>
                      
                      {/* // Only show Edit/Delete if the user is the owner// */}
                      {food.userId === OWNER_UID && (
                        <>
                          <TouchableOpacity
                            onPress={() => handleEdit(food.id)}
                            className="p-2 rounded-lg bg-yellow-50 mr-2"
                          >
                            <MaterialIcons name="edit" size={20} color="#F59E0B" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => handleDelete(food.id)}
                            className="p-2 rounded-lg bg-red-50"
                          >
                            <MaterialIcons name="delete" size={20} color="#EF4444" />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Foods;
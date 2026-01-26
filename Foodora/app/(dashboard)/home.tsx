import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { useAuth } from "@/hooks/useAuth";
import { onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { foodsCollection } from "@/services/foodService";
import { ordersCollection } from "@/services/orderService";
import { Food } from "@/types/food";
import { Order } from "@/types/order";
import * as Animatable from "react-native-animatable";

const OWNER_UID = "SH1T8LweRNeST1qVxJzEYLtWFUy1"; 

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredFoods, setFeaturedFoods] = useState<Food[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const isOwner = user?.uid === OWNER_UID;

  useEffect(() => {
    if (!user) return;

    showLoader();

    const foodsQ = query(
      foodsCollection,
      orderBy("createdAt", "desc")
    );

    const unsubscribeFoods = onSnapshot(foodsQ, (snap) => {
      const foodsData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Food));
      setFeaturedFoods(foodsData.slice(0, 3));
      setTotalFoods(foodsData.length);
      hideLoader();
    });

    const ordersQ = query(
      ordersCollection,
      where("userId", "==", user.uid),
      orderBy("placedAt", "desc"),
      limit(2)
    );

    const unsubscribeOrders = onSnapshot(ordersQ, (snap) => {
      const ordersData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
      setRecentOrders(ordersData);
      setTotalOrders(snap.size);
    });

    return () => {
      unsubscribeFoods();
      unsubscribeOrders();
    };
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const stats = [
    { icon: "restaurant", label: "Total Foods", value: totalFoods, color: "#10B981" },
    { icon: "shopping-cart", label: "Total Orders", value: totalOrders, color: "#3B82F6" },
    { icon: "star", label: "Rating", value: "4.8", color: "#F59E0B" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Animatable.View animation="fadeInDown" duration={800} className="bg-purple-950 px-6 pt-16 pb-12">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/80 text-lg">Hi..</Text>
            <Text className="text-white text-4xl font-extrabold mt-1">
              {user?.displayName?.split(" ")[0] || "User"} 👋
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-4 rounded-full">
            <MaterialIcons name="notifications" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <View className="-mt-10 px-5">
        <Animatable.View animation="fadeInUp" delay={200} className="bg-white rounded-3xl p-6 shadow-2xl">
          <View className="flex-row justify-between items-center">
            {stats.map((stat, index) => (
              <Animatable.View
                key={index}
                animation="zoomIn"
                delay={300 + index * 150}
                className="items-center flex-1"
              >
                <View className="p-5 rounded-full mb-3" style={{ backgroundColor: `${stat.color}20` }}>
                  <MaterialIcons name={stat.icon as any} size={36} color={stat.color} />
                </View>
                <Text className="text-4xl font-extrabold text-gray-900">{stat.value}</Text>
                <Text className="text-gray-600 text-sm mt-1 font-medium">{stat.label}</Text>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>
      </View>

      <Animatable.View animation="fadeInUp" delay={400} className="px-5 mt-8">
        <Text className="text-2xl font-bold text-gray-900 mb-5">Quick Actions</Text>
        <View className="flex-row justify-between">
          {isOwner && (
            <TouchableOpacity
              className="flex-1 bg-white p-6 rounded-3xl mr-3 shadow-lg active:scale-95 items-center"
              onPress={() => router.push("/foods/form")}
            >
              <View className="bg-green-100 p-5 rounded-2xl mb-4">
                <MaterialIcons name="add-circle-outline" size={40} color="#10B981" />
              </View>
              <Text className="font-semibold text-gray-800 text-lg text-center">Add Food</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-1 bg-white p-6 rounded-3xl shadow-lg active:scale-95 items-center"
            onPress={() => router.push("/orders/form")}
          >
            <View className="bg-blue-100 p-5 rounded-2xl mb-4">
              <MaterialIcons name="add-shopping-cart" size={40} color="#3B82F6" />
            </View>
            <Text className="font-semibold text-gray-800 text-lg text-center">New Order</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500} className="px-5 mt-8">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-gray-900">Featured Foods</Text>
          <TouchableOpacity onPress={() => router.push("/foods")}>
            <Text className="text-indigo-600 font-semibold">See all</Text>
          </TouchableOpacity>
        </View>

        {featuredFoods.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredFoods.map((food) => (
              <TouchableOpacity
                key={food.id}
                className="bg-white rounded-3xl mr-5 w-72 shadow-lg overflow-hidden active:scale-95"
                onPress={() => router.push(`/foods/${food.id}`)}
              >
                <Image
                  source={{ uri: food.imageUrl || "https://via.placeholder.com/300x180" }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <View className="p-5">
                  <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>
                    {food.name}
                  </Text>
                  <Text className="text-gray-600 mt-2" numberOfLines={2}>
                    {food.description}
                  </Text>
                  <View className="flex-row justify-between items-center mt-4">
                    <Text className="text-2xl font-bold text-indigo-600">${food.price}</Text>
                    <View className="px-4 py-2 rounded-full bg-blue-100">
                      <Text className="text-blue-700 text-sm font-medium">{food.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="bg-white rounded-3xl p-12 items-center shadow-lg">
            <MaterialIcons name="fastfood" size={80} color="#D1D5DB" />
            <Text className="text-gray-600 mt-6 text-xl font-medium">No foods added yet</Text>
          </View>
        )}
      </Animatable.View>

      <View className="h-20" />
    </ScrollView>
  );
};

export default Home;
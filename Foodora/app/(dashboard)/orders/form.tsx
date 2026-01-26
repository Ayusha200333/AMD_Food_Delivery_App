import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useLoader } from "@/hooks/useLoader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addOrder, getOrderById, updateOrder } from "@/services/orderService";
import { foodsCollection } from "@/services/foodService";
import { Food } from "@/types/food";
import { onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const OrderForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { orderId, foodName } = useLocalSearchParams<{ orderId: string; foodName: string }>();
  const { showLoader, hideLoader, isLoading } = useLoader();

  const [items, setItems] = useState("");
  const [total, setTotal] = useState("");
  const [isDelivered, setIsDelivered] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      foodsCollection,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Food[];
      setFoods(data);
    });

    if (orderId) {
      showLoader();
      getOrderById(orderId as string)
        .then((order) => {
          setItems(order.items.join(", "));
          setTotal(order.total.toString());
          setIsDelivered(order.isDelivered);
        })
        .catch(() => Alert.alert("Error", "Failed to load order"))
        .finally(() => hideLoader());
    }

    if (foodName) {
      setItems(foodName as string);
    }

    return () => unsubscribe();
  }, [user, orderId, foodName]);

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!items.trim() || !total) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const totalNum = parseFloat(total);
    if (isNaN(totalNum) || totalNum <= 0) {
      Alert.alert("Error", "Please enter a valid total amount");
      return;
    }

    showLoader();
    try {
      const itemArray = items
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      if (orderId) {
        await updateOrder(orderId as string, itemArray, totalNum, isDelivered);
        Alert.alert("Success", "Order updated successfully");
      } else {
        await addOrder(itemArray, totalNum, isDelivered);
        Alert.alert("Success", "Order placed successfully");
      }
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  const addFoodToOrder = (foodName: string, price: number) => {
    const currentItems = items ? `${items}, ${foodName}` : foodName;
    setItems(currentItems);

    const currentTotal = total ? parseFloat(total) : 0;
    setTotal((currentTotal + price).toString());
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={28} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">
          {orderId ? "Edit Order" : "New Order"}
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Items *
            </Text>
            <TextInput
              placeholder="Enter items separated by commas (e.g., Pizza, Burger, Coke)"
              placeholderTextColor="#9CA3AF"
              value={items}
              onChangeText={setItems}
              multiline
              className="p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 text-base h-32"
            />
            <Text className="text-gray-500 text-sm mt-2">
              Separate multiple items with commas
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 text-lg font-semibold mb-2">
              Total Amount *
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-500 mr-2 text-lg">$</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={total}
                onChangeText={setTotal}
                keyboardType="decimal-pad"
                className="flex-1 p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 text-base"
              />
            </View>
          </View>

          {orderId && (
            <View className="mb-6">
              <Text className="text-gray-700 text-lg font-semibold mb-2">
                Delivery Status
              </Text>
              <TouchableOpacity
                onPress={() => setIsDelivered(!isDelivered)}
                className={`flex-row items-center p-4 rounded-xl ${
                  isDelivered ? "bg-green-50 border-2 border-green-200" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <MaterialIcons
                  name={isDelivered ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color={isDelivered ? "#10B981" : "#9CA3AF"}
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDelivered ? "text-green-800" : "text-gray-600"
                  }`}
                >
                  Mark as Delivered
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Pressable
            className={`px-6 py-4 rounded-2xl ${isLoading ? "opacity-70" : ""}`}
            style={{ backgroundColor: orderId ? "#3B82F6" : "#10B981" }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {isLoading ? "Please wait..." : orderId ? "Update Order" : "Place Order"}
            </Text>
          </Pressable>

          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Text className="text-gray-500 text-center font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>

        {!orderId && foods.length > 0 && (
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-gray-700 text-lg font-semibold mb-4">
              Quick Add from Menu
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {foods.slice(0, 5).map((food) => (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => addFoodToOrder(food.name, food.price)}
                  className="bg-gray-50 rounded-xl p-4 mr-3 min-w-[140px]"
                >
                  <Text className="font-medium text-gray-800">{food.name}</Text>
                  <Text className="text-indigo-600 font-bold mt-1">${food.price}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{food.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderForm;
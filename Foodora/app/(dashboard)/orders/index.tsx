import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { useAuth } from "@/hooks/useAuth";
import {
  ordersCollection,
  completeOrder,
  deleteOrder
} from "@/services/orderService";
import { Order } from "@/types/order";
import { onSnapshot, query, where, orderBy } from "firebase/firestore";

type Status = "All" | "Delivered" | "Pending";

const Orders = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeStatus, setActiveStatus] = useState<Status>("All");

  useEffect(() => {
    if (!user) return;

    showLoader();

    let q = query(
      ordersCollection,
      where("userId", "==", user.uid),
      orderBy("placedAt", "desc")
    );

    if (activeStatus !== "All") {
      const isDelivered = activeStatus === "Delivered";
      q = query(q, where("isDelivered", "==", isDelivered));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(data);
        hideLoader();
      },
      (error) => {
        Alert.alert("Error", error.message);
        hideLoader();
      }
    );

    return () => unsubscribe();
  }, [user, activeStatus]);

  const handleComplete = async (id: string, currentStatus: boolean) => {
    showLoader();
    try {
      await completeOrder(id, !currentStatus);
    } catch {
      Alert.alert("Error", "Could not update order");
    } finally {
      hideLoader();
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          showLoader();
          try {
            await deleteOrder(id);
          } catch {
            Alert.alert("Error", "Could not delete order");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/orders/form", params: { orderId: id } });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions: Status[] = ["All", "Pending", "Delivered"];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 bg-white border-b border-gray-200"
      >
        {statusOptions.map((stat) => (
          <TouchableOpacity
            key={stat}
            onPress={() => setActiveStatus(stat)}
            className="mr-3"
          >
            <View
              className={`px-4 py-2 rounded-full ${
                activeStatus === stat ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  activeStatus === stat ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                {stat}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        className="bg-purple-600 rounded-full shadow-xl absolute bottom-6 right-6 p-4 z-50"
        onPress={() => router.push("/orders/form")}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 120,
        }}
        >
        {orders.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <MaterialIcons name="receipt" size={80} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">No orders found</Text>
            <Text className="text-gray-400 mt-2">Create your first order!</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              className="bg-white rounded-2xl p-5 mb-5 shadow-md border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </Text>
                  <Text className="text-gray-500 text-base mt-1">
                    {formatDate(order.placedAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleComplete(order.id, order.isDelivered)}
                  className={`p-3 rounded-full ${
                    order.isDelivered ? "bg-green-100" : "bg-yellow-100"
                  }`}
                >
                  <MaterialIcons
                    name={order.isDelivered ? "check-circle" : "schedule"}
                    size={28}
                    color={order.isDelivered ? "#10B981" : "#F59E0B"}
                  />
                </TouchableOpacity>
              </View>

              <View className="mb-5">
                <Text className="text-gray-700 font-semibold mb-3 text-lg">Items:</Text>
                <View className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                  {order.items.map((item, index) => {
                    const itemName = typeof item === 'string' ? item : (item as any).name || 'Unknown Item';
                    const quantity = typeof item === 'string' ? 1 : (item as any).quantity || 1;
                    const price = typeof item === 'string' ? 0 : (item as any).price || 0;

                    return (
                      <View 
                        key={index} 
                        className="flex-row items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                      >
                        <View className="flex-row items-center flex-1">
                          <MaterialIcons name="circle" size={10} color="#6B7280" />
                          <Text className="text-gray-800 ml-4 font-medium flex-1">
                            {itemName} × {quantity}
                          </Text>
                        </View>
                        <Text className="text-indigo-600 font-semibold text-lg">
                          ${(price * quantity).toFixed(2)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-indigo-700">
                  ${order.total.toFixed(2)}
                </Text>

                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: "/orders/[id]", params: { id: order.id } })}
                    className="p-3 rounded-xl bg-blue-50"
                  >
                    <MaterialIcons name="visibility" size={24} color="#3B82F6" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleEdit(order.id)}
                    className="p-3 rounded-xl bg-yellow-50"
                  >
                    <MaterialIcons name="edit" size={24} color="#F59E0B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(order.id)}
                    className="p-3 rounded-xl bg-red-50"
                  >
                    <MaterialIcons name="delete" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                className={`px-4 py-2 rounded-full self-start ${
                  order.isDelivered ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    order.isDelivered ? "text-green-800" : "text-yellow-800"
                  }`}
                >
                  {order.isDelivered ? "✓ Delivered" : "⏳ Pending"}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Orders;
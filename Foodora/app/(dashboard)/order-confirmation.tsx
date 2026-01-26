import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Animatable from "react-native-animatable";

const OrderConfirmation = () => {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams<{ orderId: string; total: string }>();

  useEffect(() => {
  }, []);

  const estimatedTime = "30-45 minutes"; 

  return (
    <View className="flex-1 bg-gradient-to-b from-green-50 to-white">
      <Animatable.View
        animation="zoomIn"
        duration={1000}
        className="items-center pt-20 pb-10"
      >
        <View className="bg-green-100 p-8 rounded-full mb-6 shadow-2xl">
          <MaterialIcons name="check-circle" size={120} color="#10B981" />
        </View>
        <Text className="text-4xl font-extrabold text-green-700 text-center">
          Order Placed Successfully!
        </Text>
        <Text className="text-xl text-gray-700 mt-4 text-center">
          Thanks
        </Text>
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={400}
        className="mx-6 bg-white rounded-3xl p-8 shadow-xl mb-8"
      >
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Order #{orderId?.slice(0, 8) || "N/A"}
          </Text>
          <Text className="text-gray-600 mt-2">
            Estimated Delivery: {estimatedTime}
          </Text>
        </View>

        <View className="border-t border-gray-200 pt-6">
          <View className="flex-row justify-between py-3">
            <Text className="text-gray-700 text-lg">Total Amount</Text>
            <Text className="text-indigo-700 text-xl font-bold">
              ${total ? (parseFloat(total) + 2.99).toFixed(2) : "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text className="text-gray-700 text-lg">Payment Method</Text>
            <Text className="text-gray-900 font-medium">Cash on Delivery</Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text className="text-gray-700 text-lg">Status</Text>
            <View className="px-4 py-2 rounded-full bg-green-100">
              <Text className="text-green-700 font-semibold">Confirmed</Text>
            </View>
          </View>
        </View>
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={600}
        className="mx-6 bg-white rounded-3xl p-8 shadow-xl mb-10"
      >
        <Text className="text-xl font-bold text-gray-900 mb-4">
          What's Next?
        </Text>
        <View className="space-y-4">
          <View className="flex-row items-start">
            <View className="bg-green-100 p-3 rounded-full mr-4 mt-1">
              <MaterialIcons name="restaurant" size={24} color="#10B981" />
            </View>
            <Text className="flex-1 text-gray-700">
              Your restaurant has received your order and is preparing it.
            </Text>
          </View>

          <View className="flex-row items-start">
            <View className="bg-green-100 p-3 rounded-full mr-4 mt-1">
              <MaterialIcons name="delivery-dining" size={24} color="#10B981" />
            </View>
            <Text className="flex-1 text-gray-700">
              Our delivery partner will bring it to your doorstep in {estimatedTime}.
            </Text>
          </View>

          <View className="flex-row items-start">
            <View className="bg-green-100 p-3 rounded-full mr-4 mt-1">
              <MaterialIcons name="notifications" size={24} color="#10B981" />
            </View>
            <Text className="flex-1 text-gray-700">
              You'll receive updates on your order status.
            </Text>
          </View>
        </View>
      </Animatable.View>

      <View className="px-6 pb-10 space-y-4">
        <TouchableOpacity
          className="bg-indigo-600 py-5 rounded-2xl items-center shadow-lg active:scale-95"
          onPress={() => router.replace("/orders")}
        >
          <Text className="text-white text-xl font-bold">
            View My Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-600 py-5 rounded-2xl items-center shadow-lg active:scale-95"
          onPress={() => router.replace("/foods")}
        >
          <Text className="text-white text-xl font-bold">
            Order More Food
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/home")}
        >
          <Text className="text-indigo-600 text-lg font-medium text-center mt-4">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderConfirmation;
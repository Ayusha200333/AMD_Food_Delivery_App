import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Add some items first!");
      return;
    }
    router.push("/checkout");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-purple-950 px-6 pt-14 pb-10">
        <Text className="text-white text-3xl font-bold">Your Cart 🛒</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {cart.length === 0 ? (
          <View className="items-center mt-20">
            <MaterialIcons name="shopping-cart" size={100} color="#D1D5DB" />
            <Text className="text-gray-600 text-2xl mt-6 font-medium">Your cart is empty</Text>
            <TouchableOpacity
              className="mt-8 bg-indigo-600 px-10 py-4 rounded-full"
              onPress={() => router.push("/foods")}
            >
              <Text className="text-white text-lg font-bold">Browse Foods</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View
                key={item.foodId}
                className="bg-white rounded-2xl p-4 mb-4 shadow-md flex-row"
              >
                <Image
                  source={{ uri: item.imageUrl || "https://via.placeholder.com/100" }}
                  className="w-24 h-24 rounded-xl mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                  <Text className="text-indigo-600 font-semibold mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View className="flex-row items-center mt-3">
                    <TouchableOpacity onPress={() => updateQuantity(item.foodId, item.quantity - 1)}>
                      <MaterialIcons name="remove-circle" size={32} color="#EF4444" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold mx-4">{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.foodId, item.quantity + 1)}>
                      <MaterialIcons name="add-circle" size={32} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.foodId)}>
                  <MaterialIcons name="delete" size={28} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            <View className="bg-white rounded-2xl p-6 mt-4 shadow-md">
              <View className="flex-row justify-between py-3 border-b border-gray-200">
                <Text className="text-gray-700 text-lg">Subtotal</Text>
                <Text className="text-gray-900 font-bold text-xl">${total.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between py-3 border-b border-gray-200">
                <Text className="text-gray-700 text-lg">Delivery Fee</Text>
                <Text className="text-gray-900 font-bold text-xl">$2.99</Text>
              </View>
              <View className="flex-row justify-between py-4">
                <Text className="text-gray-900 text-2xl font-bold">Total</Text>
                <Text className="text-indigo-700 text-3xl font-extrabold">
                  ${(total + 2.99).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-green-600 py-5 rounded-2xl mt-4 items-center shadow-lg active:scale-95"
                onPress={handleCheckout}
              >
                <Text className="text-white text-2xl font-bold">Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Cart;
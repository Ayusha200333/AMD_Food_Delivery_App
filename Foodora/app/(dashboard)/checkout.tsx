import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";

const Checkout = () => {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showLoader, hideLoader, isLoading } = useLoader();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const deliveryFee = 2.99;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!street.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      Alert.alert("Error", "Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Error", "Cart is empty");
      return;
    }

    showLoader();
    try {
      const orderData = {
        items: cart.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: grandTotal,
        deliveryAddress: {
          street,
          city,
          postalCode,
          phone,
          instructions: instructions.trim() || null,
        },
        paymentMethod,
        isDelivered: false,
        userId: user?.uid,
        placedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      Alert.alert(
        "Success!",
        "Your order has been placed!",
        [
          {
            text: "View Order",
            onPress: () => {
              clearCart();
              router.replace({
                pathname: "/order-confirmation",
                params: { orderId: docRef.id, total: grandTotal.toString() }
              });
            },
          },
          {
            text: "Back to Home",
            onPress: () => {
              clearCart();
              router.replace("/home");
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Order error:", err);
      Alert.alert("Error", "Failed to place order. Try again.");
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-purple-950 px-6 pt-16 pb-12 relative">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-16 left-6 z-10"
        >
          <MaterialIcons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white text-4xl font-extrabold tracking-wide">
            Checkout
          </Text>
          <Text className="text-white/80 text-xl mt-2 font-medium">
            Complete your order
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-2xl font-bold text-gray-900 mb-5">Order Summary</Text>

          {cart.map((item) => (
            <View key={item.foodId} className="flex-row justify-between py-4 border-b border-gray-200 last:border-b-0">
              <Text className="text-gray-800 flex-1 font-medium">
                {item.quantity} × {item.name}
              </Text>
              <Text className="text-gray-900 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View className="flex-row justify-between py-4 border-b border-gray-200 mt-2">
            <Text className="text-gray-700 text-lg">Subtotal</Text>
            <Text className="text-gray-900 font-bold text-xl">${total.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between py-4 border-b border-gray-200">
            <Text className="text-gray-700 text-lg">Delivery Fee</Text>
            <Text className="text-gray-900 font-bold text-xl">${deliveryFee.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between py-5 mt-2">
            <Text className="text-gray-900 text-2xl font-bold">Grand Total</Text>
            <Text className="text-indigo-700 text-3xl font-extrabold">
              ${grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-2xl font-bold text-gray-900 mb-5">Delivery Address</Text>

          <TextInput
            placeholder="Street Address"
            placeholderTextColor="#9CA3AF"
            value={street}
            onChangeText={setStreet}
            className="border border-gray-300 bg-gray-50 p-5 rounded-2xl mb-4 text-lg"
          />

          <TextInput
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
            className="border border-gray-300 bg-gray-50 p-5 rounded-2xl mb-4 text-lg"
          />

          <TextInput
            placeholder="Postal Code"
            placeholderTextColor="#9CA3AF"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            className="border border-gray-300 bg-gray-50 p-5 rounded-2xl mb-4 text-lg"
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            className="border border-gray-300 bg-gray-50 p-5 rounded-2xl mb-4 text-lg"
          />

          <TextInput
            placeholder="Delivery Instructions (optional)"
            placeholderTextColor="#9CA3AF"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
            className="border border-gray-300 bg-gray-50 p-5 rounded-2xl text-lg h-32"
          />
        </View>

        <View className="bg-white rounded-2xl p-6 mb-8 shadow-md">
          <Text className="text-2xl font-bold text-gray-900 mb-5">Payment Method</Text>

          <TouchableOpacity
            className={`flex-row items-center p-5 rounded-2xl mb-4 border-2 ${
              paymentMethod === "cod" ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
            }`}
            onPress={() => setPaymentMethod("cod")}
          >
            <MaterialIcons name="payments" size={32} color={paymentMethod === "cod" ? "#4F46E5" : "#6B7280"} />
            <Text className={`ml-5 text-xl font-medium ${paymentMethod === "cod" ? "text-indigo-700" : "text-gray-700"}`}>
              Cash on Delivery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center p-5 rounded-2xl border-2 ${
              paymentMethod === "card" ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
            }`}
            onPress={() => setPaymentMethod("card")}
          >
            <MaterialIcons name="credit-card" size={32} color={paymentMethod === "card" ? "#4F46E5" : "#6B7280"} />
            <Text className={`ml-5 text-xl font-medium ${paymentMethod === "card" ? "text-indigo-700" : "text-gray-700"}`}>
              Credit / Debit Card (Coming Soon)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-7 rounded-2xl items-center shadow-2xl mb-10 active:scale-90"
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          <Text className="text-white text-3xl font-extrabold">
            {isLoading ? "Placing Order..." : `Place Order - $${grandTotal.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Checkout;
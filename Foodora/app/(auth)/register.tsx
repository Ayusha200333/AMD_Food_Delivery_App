import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/authService";
import { useLoader } from "@/hooks/useLoader";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const { showLoader, hideLoader, isLoading } = useLoader();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  const handleButtonPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword || isLoading) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }
    if (password !== conPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    showLoader();
    try {
      await registerUser(name, email, password);
      Alert.alert("Success", "Account created! Please login.");
      router.replace("/login");
    } catch (e) {
      console.error(e);
      Alert.alert("Registration failed!", "Email may already be in use.");
    } finally {
      hideLoader();
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      }}
      resizeMode="cover"
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100"
        >
          <Text className="text-4xl font-bold text-center text-gray-900 mb-4">
            Create Account 🚀
          </Text>
          <Text className="text-center text-gray-500 mb-10">
            Sign up to order your favorite food
          </Text>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium text-lg">Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm focus:border-indigo-500"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium text-lg">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm focus:border-indigo-500"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium text-lg">Password</Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm focus:border-indigo-500"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium text-lg">Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm focus:border-indigo-500"
              value={conPassword}
              onChangeText={setConPassword}
              secureTextEntry
            />
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={handleRegister}
              disabled={isLoading}
              className={`bg-indigo-500 py-5 rounded-2xl items-center shadow-xl ${
                isLoading ? "opacity-70" : "active:opacity-90"
              }`}
            >
              <Text className="text-white text-xl font-bold">
                {isLoading ? "Creating Account..." : "Register 🍕"}
              </Text>
            </Pressable>
          </Animated.View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-indigo-600 font-semibold text-base"> Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Register;

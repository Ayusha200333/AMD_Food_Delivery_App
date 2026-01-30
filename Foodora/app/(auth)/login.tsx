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
import { useLoader } from "@/hooks/useLoader";
import { login } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    showLoader();
    try {
      await login(email, password);
      router.replace("/home");
    } catch (e) {
      console.error(e);
      Alert.alert("Login failed", "Invalid credentials");
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
            Welcome Back! 👋
          </Text>
          <Text className="text-center text-gray-500 mb-10 text-base">
            Sign in to order your favorite food
          </Text>

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

          <View className="mb-10">
            <Text className="text-gray-700 mb-2 font-medium text-lg">Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm focus:border-indigo-500"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-indigo-500 py-5 rounded-2xl items-center shadow-xl ${
                isLoading ? "opacity-70" : "active:opacity-90"
              }`}
            >
              <Text className="text-white text-xl font-bold">
                {isLoading ? "Logging in..." : "Login 🍕"}
              </Text>
            </Pressable>
          </Animated.View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600 text-base">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-indigo-600 font-semibold text-base"> Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="mt-6">
            <Text className="text-center text-gray-500 text-base">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Login;


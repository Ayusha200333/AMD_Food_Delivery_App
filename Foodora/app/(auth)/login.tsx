import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { login } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showLoader, hideLoader, isLoading } = useLoader();

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
    <ScrollView
      className="flex-1 bg-gradient-to-b from-blue-50 to-white"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-100">
        <Text className="text-4xl font-bold text-center text-gray-900 mb-10">
          Welcome Back! 👋
        </Text>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium text-lg">Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
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
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          className={`bg-indigo-400 py-5 rounded-2xl items-center shadow-lg ${
            isLoading ? 'opacity-70' : 'active:opacity-90'
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-xl font-bold">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

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
      </View>
    </ScrollView>
  );
};

export default Login;


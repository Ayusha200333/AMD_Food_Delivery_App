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
import { registerUser } from "@/services/authService";
import { useLoader } from "@/hooks/useLoader";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const { showLoader, hideLoader, isLoading } = useLoader();

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
    <ScrollView
      className="flex-1 bg-gradient-to-b from-purple-50 to-white"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-100">
        <Text className="text-4xl font-bold text-center text-gray-900 mb-10">
          Create Account 🚀
        </Text>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium text-lg">Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
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
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
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
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
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
            className="border border-gray-300 bg-white/80 p-4 rounded-2xl text-lg shadow-sm"
            value={conPassword}
            onChangeText={setConPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          className={`bg-indigo-400 py-5 rounded-2xl items-center shadow-lg ${
            isLoading ? 'opacity-70' : 'active:opacity-90'
          }`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white text-xl font-bold">
            {isLoading ? "Creating Account..." : "Register"}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600 text-base">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-purple-600 font-semibold text-base"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
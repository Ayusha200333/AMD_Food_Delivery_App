import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { login } from "@/services/authService"

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { showLoader, hideLoader, isLoading } = useLoader()

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Please enter email and password")
      return
    }
    showLoader()
    try {
      await login(email, password)
      router.replace("/home")
    } catch (e) {
      console.error(e)
      Alert.alert("Login failed")
    } finally {
      hideLoader()
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-white p-6">
        <View className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <Text className="text-4xl font-bold mb-8 text-center text-gray-900">
            Welcome Back! 👋
          </Text>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              className="border-2 border-gray-200 bg-white p-4 rounded-xl text-lg"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              className="border-2 border-gray-200 bg-white p-4 rounded-xl text-lg"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            className={`bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-2xl ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-blue-600 font-semibold"> Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="mt-6">
            <Text className="text-center text-gray-500">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Login
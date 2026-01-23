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
import { registerUser } from "@/services/authService"
import { useLoader } from "@/hooks/useLoader"

const Register = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  const { showLoader, hideLoader, isLoading } = useLoader()

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword || isLoading) {
      Alert.alert("Please fill all fields!")
      return
    }
    if (password !== conPassword) {
      Alert.alert("Passwords do not match!")
      return
    }
    showLoader()
    try {
      await registerUser(name, email, password)
      Alert.alert("Account created!")
      router.replace("/login")
    } catch (e) {
      console.error(e)
      Alert.alert("Registration failed!")
    } finally {
      hideLoader()
    }
  }
 return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-purple-50 to-white p-6">
        <View className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <Text className="text-4xl font-bold mb-8 text-center text-gray-900">
            Create Account 🚀
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              className="border-2 border-gray-200 bg-white p-4 rounded-xl text-lg"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
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

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              className="border-2 border-gray-200 bg-white p-4 rounded-xl text-lg"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              className="border-2 border-gray-200 bg-white p-4 rounded-xl text-lg"
              value={conPassword}
              onChangeText={setConPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            className={`bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-2xl ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-lg text-center font-semibold">
              {isLoading ? "Creating Account..." : "Register"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-purple-600 font-semibold"> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}


export default Register
import React, { createContext, useState, ReactNode } from "react"
import { View, ActivityIndicator, Text } from "react-native"  

interface LoaderContextProps {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

export const LoaderContext = createContext<LoaderContextProps>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false
})

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}

      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/50 z-50">
          <View className="bg-white p-8 rounded-2xl shadow-2xl items-center">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="mt-4 text-gray-700 font-medium">Loading...</Text>
          </View>
        </View>
      )}
    </LoaderContext.Provider>
  )
}
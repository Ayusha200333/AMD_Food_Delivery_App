import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import "../global.css";

const Index = () => {
  const { user, loading } = useAuth();

if (loading) {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)"
    }}>
      <View style={{
        backgroundColor: "#fff",
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 24,
        alignItems: "center",
        elevation: 10, 
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
      }}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={{
          marginTop: 12,
          fontSize: 16,
          fontWeight: "600",
          color: "#374151"
        }}>
          Please wait...
        </Text>
      </View>
    </View>
  );
}


  if (user) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }
};

export default Index;